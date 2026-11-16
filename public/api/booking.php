<?php
/**
 * Klarus & Co — Meeting request endpoint (used by the details form in the contact-options popup,
 * src/components/sections/BookingForm.tsx). No database: it only validates and sends email.
 *
 * POST (JSON) → 1. emails the full meeting request to the business inbox (info@klarusco.com),
 *               2. emails the visitor a "request received" confirmation.
 *
 * The date and time are PREFERENCES, not confirmed appointments — the team confirms manually.
 * Accepted: Monday–Friday, today through today + 7 days, one-hour slots starting 9:00 … 17:00
 * Pakistan Standard Time (Asia/Karachi, UTC+5), and not already started.
 *
 * SMTP settings come from the same private mail.ini as contact.php (see README).
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const SLOT_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17]; // start hours, PKT
const WINDOW_DAYS = 7; // today + the next 7 calendar days

function respond(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body);
    exit;
}

/* ------------------------------------------------------------------ config */

/** Same lookup as contact.php: private/mail.ini above public_html. */
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
    error_log('[meeting] mail config missing or incomplete at ' . $configPath);
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
    'rate_limit'      => '5',
    'rate_window'     => '3600',
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

// Honeypot: real visitors never fill this field. Pretend success for bots.
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
    $file = $dir . '/meeting-' . hash('sha256', $ip) . '.json';
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

function line(mixed $v, int $max): string
{
    $s = is_scalar($v) ? (string) $v : '';
    $s = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $s) ?? '';
    $s = trim(preg_replace('/\s+/u', ' ', $s) ?? '');
    return mb_substr($s, 0, $max);
}

function block(mixed $v, int $max): string
{
    $s = is_scalar($v) ? (string) $v : '';
    $s = str_replace(["\r\n", "\r"], "\n", $s);
    $s = preg_replace('/[\x00-\x08\x0B-\x1F\x7F]+/u', '', $s) ?? '';
    return mb_substr(trim($s), 0, $max);
}

/** "9:00 AM – 10:00 AM" */
function slot_label(int $hour): string
{
    $fmt = fn(int $h) => (new DateTimeImmutable('2000-01-01 00:00'))->setTime($h, 0)->format('g:i A');
    return $fmt($hour) . ' – ' . $fmt($hour + 1);
}


$b = [
    'name'     => line($in['name'] ?? '', 120),
    'email'    => line($in['email'] ?? '', 254),
    'phone'    => line($in['phone'] ?? '', 40),
    'company'  => line($in['company'] ?? '', 200),
    'country'  => line($in['country'] ?? '', 100),
    'date'     => line($in['date'] ?? '', 10),
    'hour'     => is_numeric($in['hour'] ?? null) ? (int) $in['hour'] : -1,
    'purpose'  => block($in['purpose'] ?? '', 1000),
    'timezone' => line($in['timezone'] ?? '', 64),
];
if (!in_array($b['timezone'], DateTimeZone::listIdentifiers(), true)) $b['timezone'] = '';

// Details from the contact form submitted just before (optional, shown to the team only).
$enq = is_array($in['enquiry'] ?? null) ? $in['enquiry'] : [];
$e = [
    'businessType' => line($enq['businessType'] ?? '', 60),
    'systemInUse'  => line($enq['systemInUse'] ?? '', 100),
    'planModel'    => line($enq['planModel'] ?? '', 60),
    'requirements' => block($enq['requirements'] ?? '', 2000),
];

$pkt = new DateTimeZone('Asia/Karachi');
$now = new DateTimeImmutable('now', $pkt);
$today = $now->setTime(0, 0);
$day = null;
if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $b['date'])) {
    $d = DateTimeImmutable::createFromFormat('!Y-m-d', $b['date'], $pkt);
    if ($d && $d->format('Y-m-d') === $b['date']) $day = $d;
}

$errors = [];
if (mb_strlen($b['name']) < 2) $errors[] = 'name';
if (!filter_var($b['email'], FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if (!preg_match('/^\+?[0-9 ()\-]{6,40}$/', $b['phone']) || strlen(preg_replace('/\D/', '', $b['phone'])) < 6) $errors[] = 'phone';
if (mb_strlen($b['company']) < 2) $errors[] = 'company';
if ($b['country'] === '') $errors[] = 'country';
// meeting purpose is optional
if (!$day || $day < $today || $day > $today->modify('+' . WINDOW_DAYS . ' days') || (int) $day->format('N') > 5) $errors[] = 'date';
if (!in_array($b['hour'], SLOT_HOURS, true)) $errors[] = 'time';
elseif ($day && $day->setTime($b['hour'], 0) <= $now) $errors[] = 'time'; // that hour has already started
if ($errors) {
    respond(422, ['ok' => false, 'error' => 'validation', 'fields' => array_values(array_unique($errors))]);
}

// Checked only after validation, so rejected (invalid) requests do not use up the allowance.
if (rate_limited($cfg, $configPath)) {
    respond(429, ['ok' => false, 'error' => 'too_many_requests']);
}

/* ------------------------------------------------------------- SMTP client */
/* Same minimal client as contact.php (kept separate so contact.php is untouched). */

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

$dayText = $day->format('l, j F Y');                       // e.g. Tuesday, 17 November 2026
$timeText = slot_label($b['hour']) . ' PKT (Pakistan Standard Time, UTC+5)';

$tzLine = 'Not provided';
if ($b['timezone'] !== '') {
    $start = $day->setTime($b['hour'], 0);
    $tz = new DateTimeZone($b['timezone']);
    $tzLine = $b['timezone'] . ($b['timezone'] === 'Asia/Karachi' ? ' (same as PKT)'
        : ' — ' . $start->setTimezone($tz)->format('l, j F Y, g:i A') . ' – ' . $start->modify('+1 hour')->setTimezone($tz)->format('g:i A') . ' their local time');
}

$details = "Full name:           {$b['name']}\n"
    . "Email:               {$b['email']}\n"
    . "WhatsApp / phone:    {$b['phone']}\n"
    . "Company:             {$b['company']}\n"
    . "Country:             {$b['country']}\n"
    . "Preferred date:      $dayText\n"
    . "Preferred time:      $timeText\n"
    . "Customer timezone:   $tzLine\n\n"
    . "Meeting purpose:\n" . ($b['purpose'] !== '' ? $b['purpose'] : 'Not provided') . "\n";

$enquiryLines = '';
foreach (['Business type' => $e['businessType'], 'System in use' => $e['systemInUse'], 'Plan model' => $e['planModel']] as $label => $v) {
    if ($v !== '') $enquiryLines .= str_pad($label . ':', 21) . $v . "\n";
}
if ($e['requirements'] !== '') $enquiryLines .= "Requirements:\n{$e['requirements']}\n";
$enquiryBlock = $enquiryLines !== '' ? "\nOriginal quote enquiry (from the contact form):\n" . $enquiryLines : '';
$footer = "\n" . str_repeat('-', 52) . "\n"
    . 'Submitted: ' . gmdate('Y-m-d H:i') . " UTC\n"
    . "Reply to this email to respond directly to {$b['name']}.\n";

$adminSubject = "Meeting request: {$b['company']} — preferred {$day->format('D j M Y')}, " . slot_label($b['hour']) . ' PKT';
$adminBody = "New meeting request from the klarusco.com contact popup\n"
    . str_repeat('-', 52) . "\n\n"
    . "The date and time below are the customer's PREFERENCE, not a confirmed\n"
    . "appointment. Please confirm availability with the customer and share the\n"
    . "Google Meet link by email or WhatsApp before the meeting.\n\n"
    . $details . $enquiryBlock . $footer;

$userBody = "Dear {$b['name']},\n\n"
    . "Your meeting request has been received. Our team will review your preferred date and time "
    . "and share the Google Meet link with you via email or WhatsApp before the meeting.\n\n"
    . "Preferred date:   $dayText\n"
    . "Preferred time:   $timeText\n"
    . "Your timezone:    $tzLine\n\n"
    . "Please note this is a request, not a confirmed appointment — we will confirm availability "
    . "with you directly.\n\n"
    . "If you need to change anything, simply reply to this email.\n\n"
    . "Kind regards,\n"
    . "Klarus & Co\n"
    . "https://klarusco.com\n";
$userBody = str_replace(' their local time', ' your local time', $userBody);

$fromEmail = (string) $cfg['mail_from'];
$fromName = (string) $cfg['mail_from_name'];
$toEmail = (string) $cfg['mail_to'];

try {
    $smtp = new Smtp((string) $cfg['smtp_host'], (int) $cfg['smtp_port'], (string) $cfg['smtp_secure']);
    $smtp->login('klarusco.com', (string) $cfg['smtp_user'], (string) $cfg['smtp_pass']);
    $smtp->send($fromEmail, $toEmail, build_message([
        'fromEmail' => $fromEmail, 'fromName' => 'Klarus & Co Website',
        'toEmail' => $toEmail, 'toName' => 'Klarus & Co',
        'replyTo' => $b['email'], 'replyName' => $b['name'],
        'subject' => $adminSubject,
    ], $adminBody));
} catch (Throwable $ex) {
    error_log('[meeting] notification failed: ' . $ex->getMessage());
    if (isset($smtp)) $smtp->quit();
    respond(502, ['ok' => false, 'error' => 'send_failed']);
}

// The request has reached the inbox; a failed confirmation should not show the visitor an error.
try {
    $smtp->cmd('RSET', 250);
    $smtp->send($fromEmail, $b['email'], build_message([
        'fromEmail' => $fromEmail, 'fromName' => $fromName,
        'toEmail' => $b['email'], 'toName' => $b['name'],
        'replyTo' => $toEmail, 'replyName' => $fromName,
        'subject' => 'Your meeting request has been received — Klarus & Co',
        'auto' => true,
    ], $userBody));
} catch (Throwable $ex) {
    error_log('[meeting] confirmation failed: ' . $ex->getMessage());
}
$smtp->quit();

respond(200, ['ok' => true, 'dayText' => $dayText, 'time' => slot_label($b['hour']) . ' PKT']);
