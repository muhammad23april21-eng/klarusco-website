<?php
/**
 * Klarus & Co — Contact / quote form endpoint.
 *
 * Receives the JSON posted by src/components/sections/ContactForm.tsx and:
 *   1. emails the full submission to the business inbox (info@klarusco.com),
 *   2. emails a short confirmation (name, company, plan only) to the visitor.
 *
 * SMTP credentials are NOT in this file or in the repository. They are read from a
 * private INI file stored OUTSIDE public_html (see README → "Contact form email").
 * Location on Hostinger:  /home/<user>/private/mail.ini
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body);
    exit;
}

/* ------------------------------------------------------------------ config */

/**
 * Find private/mail.ini by walking up from the folder ABOVE public_html (never inside it).
 * Hostinger layout: /home/<user>/private/mail.ini, with the site at
 * /home/<user>/domains/klarusco.com/public_html (also reachable as /home/<user>/public_html).
 */
function find_config(): string
{
    $dir = dirname(__DIR__, 2);
    for ($i = 0; $i < 4 && $dir !== dirname($dir); $i++, $dir = dirname($dir)) {
        if (is_file($dir . '/private/mail.ini')) return $dir . '/private/mail.ini';
    }
    return dirname(__DIR__, 4) . '/private/mail.ini';
}

$configPath = getenv('KLARUS_MAIL_CONFIG') ?: find_config();
$cfg = is_readable($configPath) ? parse_ini_file($configPath, false, INI_SCANNER_RAW) : false;
if (!$cfg || empty($cfg['smtp_user']) || empty($cfg['smtp_pass'])) {
    error_log('[contact] mail config missing or incomplete at ' . $configPath);
    respond(500, ['ok' => false, 'error' => 'not_configured']);
}
$cfg += [
    'smtp_host'       => 'smtp.hostinger.com',
    'smtp_port'       => '465',
    'smtp_secure'     => 'ssl',
    'mail_to'         => 'info@klarusco.com',
    'mail_from'       => $cfg['smtp_user'],
    'mail_from_name'  => 'Klarus & Co',
    'allowed_origins' => 'https://klarusco.com,https://www.klarusco.com',
    'rate_limit'      => '5',      // submissions per IP …
    'rate_window'     => '3600',   // … per this many seconds
];

/* ---------------------------------------------------------- request checks */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = array_filter(array_map('trim', explode(',', (string) $cfg['allowed_origins'])));
if ($origin !== '' && !in_array($origin, $allowed, true)) {
    respond(403, ['ok' => false, 'error' => 'forbidden']);
}

if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) {
    respond(415, ['ok' => false, 'error' => 'unsupported_type']);
}

$raw = file_get_contents('php://input', false, null, 0, 32768);
$in = json_decode((string) $raw, true);
if (!is_array($in)) {
    respond(400, ['ok' => false, 'error' => 'invalid_json']);
}

// Honeypot: real visitors never see or fill this field. Pretend success for bots.
if (trim((string) ($in['website'] ?? '')) !== '') {
    respond(200, ['ok' => true]);
}

/* --------------------------------------------------------------- rate limit */

function rate_limited(array $cfg, string $configPath): bool
{
    $dir = dirname($configPath) . '/ratelimit';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) {
        $dir = sys_get_temp_dir() . '/klarus-contact-rl';
        if (!is_dir($dir) && !@mkdir($dir, 0700, true)) return false;
    }
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $file = $dir . '/' . hash('sha256', $ip) . '.json';
    $window = max(60, (int) $cfg['rate_window']);
    $limit = max(1, (int) $cfg['rate_limit']);
    $now = time();

    $fh = @fopen($file, 'c+');
    if (!$fh) return false;
    flock($fh, LOCK_EX);
    $hits = json_decode((string) stream_get_contents($fh), true);
    $hits = array_values(array_filter(is_array($hits) ? $hits : [], fn($t) => is_int($t) && $t > $now - $window));
    $blocked = count($hits) >= $limit;
    if (!$blocked) $hits[] = $now;
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($hits));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $blocked;
}

/* --------------------------------------------------------------- validation */

/** Single-line text: strip control chars (incl. CR/LF), collapse spaces, cap length. */
function line(mixed $v, int $max): string
{
    $s = is_scalar($v) ? (string) $v : '';
    $s = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $s) ?? '';
    $s = trim(preg_replace('/\s+/u', ' ', $s) ?? '');
    return mb_substr($s, 0, $max);
}

/** Multi-line text: keep newlines, strip other control chars. */
function block(mixed $v, int $max): string
{
    $s = is_scalar($v) ? (string) $v : '';
    $s = str_replace(["\r\n", "\r"], "\n", $s);
    $s = preg_replace('/[\x00-\x08\x0B-\x1F\x7F]+/u', '', $s) ?? '';
    return mb_substr(trim($s), 0, $max);
}

$d = [
    'companyName'        => line($in['companyName'] ?? '', 200),
    'country'            => line($in['country'] ?? '', 100),
    'representativeName' => line($in['representativeName'] ?? '', 120),
    'email'              => line($in['email'] ?? '', 254),
    'contactNumber'      => line($in['contactNumber'] ?? '', 40),
    'businessType'       => line($in['businessType'] ?? '', 60),
    'systemInUse'        => line($in['systemInUse'] ?? '', 100),
    'planModel'          => line($in['planModel'] ?? '', 60),
    'resourceMeasure'    => line($in['resourceMeasure'] ?? '', 60),
    'requirements'       => block($in['requirements'] ?? '', 2000),
];

$resources = [];
foreach (array_slice(is_array($in['resources'] ?? null) ? $in['resources'] : [], 0, 10) as $r) {
    if (!is_array($r)) continue;
    $name = line($r['resource'] ?? '', 60);
    if ($name === '') continue;
    $val = $r['value'] ?? null;
    $resources[] = [$name, is_numeric($val) ? (string) (int) $val : null];
}

$errors = [];
// Required: email address, contact number, business type, system in use and plan model.
// Company name, country, representative name, resources and requirements are optional.
if (!filter_var($d['email'], FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if (!preg_match('/^\+?[0-9 ()\-]{6,40}$/', $d['contactNumber'])) $errors[] = 'contactNumber';
if ($d['businessType'] === '') $errors[] = 'businessType';
if ($d['systemInUse'] === '') $errors[] = 'systemInUse';
if ($d['planModel'] === '') $errors[] = 'planModel';
if ($errors) {
    respond(422, ['ok' => false, 'error' => 'validation', 'fields' => $errors]);
}

// Checked only after validation, so rejected (invalid) submissions do not use up the allowance.
if (rate_limited($cfg, $configPath)) {
    respond(429, ['ok' => false, 'error' => 'too_many_requests']);
}

/* ------------------------------------------------------------- SMTP client */

final class Smtp
{
    /** @var resource */
    private $sock;

    public function __construct(string $host, int $port, string $secure)
    {
        $ctx = stream_context_create(['ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'peer_name' => $host,
        ]]);
        $scheme = $secure === 'none' ? 'tcp' : 'ssl';
        $sock = @stream_socket_client("$scheme://$host:$port", $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
        if (!$sock) throw new RuntimeException("connect failed: $errstr ($errno)");
        stream_set_timeout($sock, 20);
        $this->sock = $sock;
        $this->expect(220);
    }

    private function read(): array
    {
        $code = 0;
        $text = '';
        while (($l = fgets($this->sock, 1024)) !== false) {
            $text .= $l;
            $code = (int) substr($l, 0, 3);
            if (strlen($l) < 4 || $l[3] !== '-') break;
        }
        return [$code, trim($text)];
    }

    private function expect(int ...$ok): string
    {
        [$code, $text] = $this->read();
        if (!in_array($code, $ok, true)) throw new RuntimeException("SMTP $code: $text");
        return $text;
    }

    public function cmd(string $line, int ...$ok): string
    {
        fwrite($this->sock, $line . "\r\n");
        return $this->expect(...$ok);
    }

    public function login(string $ehloHost, string $user, string $pass): void
    {
        $this->cmd("EHLO $ehloHost", 250);
        $this->cmd('AUTH LOGIN', 334);
        $this->cmd(base64_encode($user), 334);
        fwrite($this->sock, base64_encode($pass) . "\r\n");
        [$code] = $this->read();
        if ($code !== 235) throw new RuntimeException("SMTP auth failed ($code)");
    }

    public function send(string $from, string $to, string $message): void
    {
        $this->cmd("MAIL FROM:<$from>", 250);
        $this->cmd("RCPT TO:<$to>", 250, 251);
        $this->cmd('DATA', 354);
        // Body is base64 so no line starts with "."; headers never do either.
        fwrite($this->sock, $message . "\r\n.\r\n");
        $this->expect(250);
    }

    public function quit(): void
    {
        @fwrite($this->sock, "QUIT\r\n");
        @fclose($this->sock);
    }
}

function enc(string $s): string
{
    return '=?UTF-8?B?' . base64_encode($s) . '?=';
}

function address(string $email, string $name = ''): string
{
    $name = str_replace(['"', "\r", "\n"], '', $name);
    return $name === '' ? "<$email>" : enc($name) . " <$email>";
}

function build_message(array $h, string $body): string
{
    $domain = substr(strrchr($h['fromEmail'], '@') ?: '@klarusco.com', 1);
    $headers = [
        'Date: ' . date(DATE_RFC2822),
        'From: ' . address($h['fromEmail'], $h['fromName']),
        'To: ' . address($h['toEmail'], $h['toName'] ?? ''),
        'Subject: ' . enc($h['subject']),
        'Message-ID: <' . bin2hex(random_bytes(16)) . '@' . $domain . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
    ];
    if (!empty($h['replyTo'])) $headers[] = 'Reply-To: ' . address($h['replyTo'], $h['replyName'] ?? '');
    if (!empty($h['auto'])) $headers[] = 'Auto-Submitted: auto-replied';
    $body = str_replace("\n", "\r\n", str_replace(["\r\n", "\r"], "\n", $body));
    return implode("\r\n", $headers) . "\r\n\r\n" . rtrim(chunk_split(base64_encode($body), 76, "\r\n"));
}

/* ------------------------------------------------------------ the messages */

$resLines = '';
if ($resources) {
    $resLines = 'Resources' . ($d['resourceMeasure'] !== '' ? " ({$d['resourceMeasure']})" : '') . ":\n";
    foreach ($resources as [$n, $v]) $resLines .= "  - $n" . ($v !== null ? ": $v" : '') . "\n";
}

// Optional fields left blank read "Not provided".
$or = fn(string $v) => $v !== '' ? $v : 'Not provided';
$contactName = $d['representativeName'] !== '' ? $d['representativeName'] : $d['email'];

$adminBody = "New quote request from the klarusco.com contact form\n"
    . str_repeat('-', 52) . "\n\n"
    . "Company name:        {$or($d['companyName'])}\n"
    . "Country:             {$or($d['country'])}\n"
    . "Representative name: {$or($d['representativeName'])}\n"
    . "Email:               {$d['email']}\n"
    . "Contact number:      {$d['contactNumber']}\n"
    . "Business type:       {$or($d['businessType'])}\n"
    . "System in use:       {$or($d['systemInUse'])}\n"
    . "Plan model:          {$or($d['planModel'])}\n"
    . ($resLines !== '' ? "\n" . $resLines : '')
    . "\nRequirements:\n" . $or($d['requirements']) . "\n\n"
    . str_repeat('-', 52) . "\n"
    . 'Submitted: ' . gmdate('Y-m-d H:i') . " UTC\n"
    . "Reply to this email to respond directly to $contactName.\n";

// Confirmation: name, company and plan only — never the visitor's free-text message.
$userBody = ($d['representativeName'] !== '' ? "Dear {$d['representativeName']},\n\n" : "Hello,\n\n")
    . "Thank you for contacting Klarus & Co. We have received your quote request and our team "
    . "will review your information and get back to you shortly.\n\n"
    . "Company:        {$or($d['companyName'])}\n"
    . "Selected plan:  {$or($d['planModel'])}\n\n"
    . "If you need to add anything, simply reply to this email.\n\n"
    . "Kind regards,\n"
    . "Klarus & Co\n"
    . "https://klarusco.com\n";

$fromEmail = (string) $cfg['mail_from'];
$fromName = (string) $cfg['mail_from_name'];
$toEmail = (string) $cfg['mail_to'];

try {
    $smtp = new Smtp((string) $cfg['smtp_host'], (int) $cfg['smtp_port'], (string) $cfg['smtp_secure']);
    $smtp->login('klarusco.com', (string) $cfg['smtp_user'], (string) $cfg['smtp_pass']);

    $smtp->send($fromEmail, $toEmail, build_message([
        'fromEmail' => $fromEmail, 'fromName' => 'Klarus & Co Website',
        'toEmail' => $toEmail, 'toName' => 'Klarus & Co',
        'replyTo' => $d['email'], 'replyName' => $d['representativeName'],
        'subject' => 'New quote request: ' . ($d['companyName'] !== '' ? $d['companyName'] : $contactName),
    ], $adminBody));
} catch (Throwable $e) {
    error_log('[contact] notification failed: ' . $e->getMessage());
    if (isset($smtp)) $smtp->quit();
    respond(502, ['ok' => false, 'error' => 'send_failed']);
}

// The enquiry has reached the inbox; a failed confirmation should not show the visitor an error.
try {
    $smtp->cmd('RSET', 250);
    $smtp->send($fromEmail, $d['email'], build_message([
        'fromEmail' => $fromEmail, 'fromName' => $fromName,
        'toEmail' => $d['email'], 'toName' => $d['representativeName'],
        'replyTo' => $toEmail, 'replyName' => $fromName,
        'subject' => 'We have received your quote request — Klarus & Co',
        'auto' => true,
    ], $userBody));
} catch (Throwable $e) {
    error_log('[contact] confirmation failed: ' . $e->getMessage());
}
$smtp->quit();

respond(200, ['ok' => true]);
