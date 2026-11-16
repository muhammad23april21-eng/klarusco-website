import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  MessageCircle,
  Settings2,
} from "lucide-react";
import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/min";
import { config, systems } from "../../content/site";
import {
  countries,
  defaultCountry,
  findCountry,
} from "../../content/countries";
import { useSelection } from "../../hooks/SelectionContext";
import { ease } from "../motion";
import { PhoneInput } from "../ui/PhoneInput";
import { ContactOptionsModal } from "./ContactOptionsModal";

/* Options from the "Quote Form" spreadsheet */
const businessTypes = [
  "Services",
  "Trading",
  "Manufacturing",
  "Not Sure",
] as const;
const systemOptions = [...systems.items, "Not Sure"];
const planModels = [
  { id: "hourly", label: "Hourly Based" },
  { id: "monthly", label: "Monthly Fixed" },
  { id: "unsure", label: "Not Sure" },
] as const;
type PlanModel = (typeof planModels)[number]["id"];

const resourceRoles = [
  { id: "bookkeeper", label: "Bookkeeper" },
  { id: "supervisor", label: "Supervisor" },
  { id: "manager", label: "Manager" },
] as const;
type RoleId = (typeof resourceRoles)[number]["id"];

/** Per plan: what the second column of the resource table asks for. */
const resourceColumn: Record<
  "hourly" | "monthly",
  { heading: string; unit: string; max: number }
> = {
  hourly: { heading: "Daily Hours", unit: "hours", max: 24 },
  monthly: { heading: "Number of Resources", unit: "resources", max: 99 },
};

interface Values {
  companyName: string;
  country: string;
  representativeName: string;
  email: string;
  phoneCountry: CountryCode;
  phone: string;
  businessType: string;
  systemInUse: string;
  planModel: PlanModel | "";
  resources: Record<RoleId, string>;
  resourcesNotSure: boolean;
  requirements: string;
}

type FieldKey = Exclude<keyof Values, "phoneCountry" | "resourcesNotSure">;
type Errors = Partial<Record<FieldKey, string>>;
type Status = "idle" | "submitting" | "sent" | "error" | "unconfigured";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const emptyResources: Record<RoleId, string> = {
  bookkeeper: "",
  supervisor: "",
  manager: "",
};

const showsResources = (p: Values["planModel"]): p is "hourly" | "monthly" =>
  p === "hourly" || p === "monthly";

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.companyName.trim().length < 2)
    e.companyName = "Please enter your company name.";
  // Country is optional
  if (v.representativeName.trim().length < 2)
    e.representativeName = "Please enter the representative’s name.";
  if (!v.email.trim()) e.email = "Please enter your email address.";
  else if (!emailRe.test(v.email.trim()))
    e.email = "Please enter a valid email address.";
  if (!v.phone.trim()) e.phone = "Please enter your contact number.";
  else if (!isValidPhoneNumber(v.phone, v.phoneCountry))
    e.phone = "Please enter a valid number for the selected country code.";
  if (!v.businessType) e.businessType = "Please select your business type.";
  if (!v.systemInUse) e.systemInUse = "Please select the system you use.";
  if (!v.planModel) e.planModel = "Please select a plan model.";
  if (showsResources(v.planModel) && !v.resourcesNotSure) {
    const values = Object.values(v.resources);
    const max = resourceColumn[v.planModel].max;
    if (values.some((x) => x !== "" && (!/^\d+$/.test(x) || Number(x) > max))) {
      e.resources = `Please enter whole numbers between 0 and ${max}.`;
    } else if (!values.some((x) => Number(x) > 0)) {
      e.resources = `Please enter ${resourceColumn[v.planModel].unit} for at least one role, or tick “Not Sure”.`;
    }
  }
  // Requirements are optional; only the length cap applies
  if (v.requirements.length > 2000)
    e.requirements = "Please keep your requirements under 2,000 characters.";
  return e;
}

/** Contact number in international format, e.g. +923001234567 (falls back to code + digits). */
function fullNumber(v: Values) {
  const parsed = parsePhoneNumberFromString(v.phone, v.phoneCountry);
  return (
    parsed?.number ??
    `${findCountry(v.phoneCountry)?.dial ?? ""}${v.phone.replace(/\D/g, "")}`
  );
}

function resourceRows(v: Values) {
  if (!showsResources(v.planModel)) return [];
  if (v.resourcesNotSure)
    return [{ resource: "Not Sure", value: null as number | null }];
  return resourceRoles
    .filter((r) => Number(v.resources[r.id]) > 0)
    .map((r) => ({ resource: r.label, value: Number(v.resources[r.id]) }));
}

/** Submitted payload — every field from the quote form, with readable values. */
function payload(v: Values) {
  const plan = planModels.find((p) => p.id === v.planModel)?.label ?? "";
  const unit = showsResources(v.planModel)
    ? resourceColumn[v.planModel].heading
    : "";
  return {
    _subject: "Quote request",
    companyName: v.companyName.trim(),
    country: findCountry(v.country)?.name ?? v.country,
    representativeName: v.representativeName.trim(),
    email: v.email.trim(),
    contactNumber: fullNumber(v),
    contactCountryCode: findCountry(v.phoneCountry)?.dial ?? "",
    businessType: v.businessType,
    systemInUse: v.systemInUse,
    planModel: plan,
    resourceMeasure: unit,
    resources: resourceRows(v),
    requirements: v.requirements.trim(),
  };
}

function summarise(v: Values) {
  const p = payload(v);
  const res = p.resources.length
    ? `Resources (${p.resourceMeasure}):\n${p.resources.map((r) => `  • ${r.resource}${r.value !== null ? `: ${r.value}` : ""}`).join("\n")}`
    : null;
  return [
    `Company name: ${p.companyName}`,
    `Country: ${p.country || "Not provided"}`,
    `Representative name: ${p.representativeName}`,
    `Email: ${p.email}`,
    `Contact number: ${p.contactNumber}`,
    `Business type: ${p.businessType}`,
    `System in use: ${p.systemInUse}`,
    `Plan model: ${p.planModel}`,
    res,
    p.requirements ? "" : null,
    p.requirements || null,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="quote-form__group">
      <legend className="quote-form__legend">{title}</legend>
      {children}
    </fieldset>
  );
}

export function ContactForm() {
  const { selection } = useSelection();
  const uid = useId();
  const [values, setValues] = useState<Values>({
    companyName: "",
    country: "",
    representativeName: "",
    email: "",
    phoneCountry: defaultCountry,
    phone: "",
    businessType: "",
    systemInUse: "",
    // Pre-fill the plan when the visitor came from the How It Works page
    planModel: selection.plan ?? "",
    resources: emptyResources,
    resourcesNotSure: false,
    requirements: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>(
    {},
  );
  const [status, setStatus] = useState<Status>("idle");
  // Contact options (WhatsApp / email / meeting) shown after a valid submission
  const [optionsOpen, setOptionsOpen] = useState(false);
  // After a confirmed submission the Thank You message waits until the visitor picks a contact option
  const [doneVisible, setDoneVisible] = useState(false);
  const closeOptions = useCallback(() => {
    setOptionsOpen(false);
    // The request was already delivered: closing the popup without choosing still shows the Thank You message
    if (status === "sent") setDoneVisible(true);
  }, [status]);
  const selectOption = useCallback(() => {
    setOptionsOpen(false);
    if (status === "sent") setDoneVisible(true);
  }, [status]);
  // Guards against duplicate submissions while a request is in flight
  const submittingRef = useRef(false);
  const doneRef = useRef<HTMLDivElement>(null);
  // Bring the success message into view once the request is confirmed
  useEffect(() => {
    if (doneVisible) doneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [doneVisible]);

  const update = (patch: Partial<Values>, keys: FieldKey[]) => {
    const next = { ...values, ...patch };
    setValues(next);
    if (keys.some((k) => touched[k])) setErrors(validate(next));
    if (status !== "idle" && status !== "submitting") setStatus("idle");
  };
  const set = <K extends FieldKey>(k: K, val: Values[K]) =>
    update({ [k]: val } as Partial<Values>, [k]);
  const blur = (k: FieldKey) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    const errs = validate(values);
    setErrors(errs);
    setTouched({
      companyName: true,
      country: true,
      representativeName: true,
      email: true,
      phone: true,
      businessType: true,
      systemInUse: true,
      planModel: true,
      resources: true,
      requirements: true,
    });
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      const target =
        first === "resources"
          ? `${uid}-resources-bookkeeper`
          : `${uid}-${first}`;
      document.getElementById(target)?.focus();
      return;
    }
    if (!config.formEndpoint) {
      setStatus("unconfigured");
      setOptionsOpen(true);
      return;
    }
    // Spam trap: hidden field that only bots fill in; the server ignores those submissions.
    const trap = (e.currentTarget as HTMLFormElement).elements.namedItem("website");
    const website = trap instanceof HTMLInputElement ? trap.value : "";
    submittingRef.current = true;
    setOptionsOpen(false);
    setStatus("submitting");
    try {
      const res = await fetch(config.formEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...payload(values), website }),
      });
      // Success only when the backend confirms it: HTTP 2xx and { ok: true }
      const body = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      const ok = res.ok && body?.ok === true;
      setStatus(ok ? "sent" : "error");
      // Emails are sent: offer WhatsApp / email / meeting before showing the Thank You message
      setOptionsOpen(ok);
    } catch {
      setOptionsOpen(false);
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  };

  const text = summarise(values);
  const mailto = config.email
    ? `mailto:${config.email}?subject=${encodeURIComponent("Quote request")}&body=${encodeURIComponent(text)}`
    : null;
  const wa = config.whatsappNumber
    ? `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`
    : null;

  const field = (k: FieldKey) => ({
    id: `${uid}-${k}`,
    name: k,
    "aria-invalid": Boolean(touched[k] && errors[k]),
    "aria-describedby": touched[k] && errors[k] ? `${uid}-${k}-err` : undefined,
    onBlur: () => blur(k),
  });
  const err = (k: FieldKey) =>
    touched[k] && errors[k] ? (
      <span id={`${uid}-${k}-err`} className="field__error">
        <AlertCircle size={13} aria-hidden="true" /> {errors[k]}
      </span>
    ) : null;
  const label = (k: FieldKey, text: string, required = true) => (
    <label htmlFor={`${uid}-${k}`}>
      {text}
      {required && <> <span aria-hidden="true">*</span></>}
    </label>
  );

  const optionsModal = (
    <ContactOptionsModal
      open={optionsOpen}
      onClose={closeOptions}
      summary={text}
      sent={status === "sent"}
      onSelect={selectOption}
    />
  );

  if (status === "sent" && doneVisible) {
    return (
      <>
      <motion.div
        ref={doneRef}
        className="form-done"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        role="status"
      >
        <CheckCircle2 size={40} strokeWidth={1.3} aria-hidden="true" />
        <h3>Thank you — your quote request has been sent.</h3>
        <p>Our team will review your information and get back to you.</p>
      </motion.div>
      {optionsModal}
      </>
    );
  }

  const column = showsResources(values.planModel)
    ? resourceColumn[values.planModel]
    : null;

  return (
    <>
    <form className="form quote-form" onSubmit={onSubmit} noValidate>
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <Section title="Basic information">
        <div className="form__row">
          <div className="field">
            {label("companyName", "Company Name")}
            <input
              {...field("companyName")}
              type="text"
              autoComplete="organization"
              required
              value={values.companyName}
              onChange={(e) => set("companyName", e.target.value)}
            />
            {err("companyName")}
          </div>
          <div className="field">
            {label("country", "Country", false)}
            <select
              {...field("country")}
              value={values.country}
              onChange={(e) => {
                const code = e.target.value;
                // Match the phone country code to the chosen country unless a number is already typed
                update(
                  values.phone
                    ? { country: code }
                    : { country: code, phoneCountry: code as CountryCode },
                  ["country"],
                );
              }}
            >
              <option value="" disabled>
                Select country
              </option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            {err("country")}
          </div>
        </div>
        <div className="form__row">
          <div className="field">
            {label("representativeName", "Representative Name")}
            <input
              {...field("representativeName")}
              type="text"
              autoComplete="name"
              required
              value={values.representativeName}
              onChange={(e) => set("representativeName", e.target.value)}
            />
            {err("representativeName")}
          </div>
          <div className="field">
            {label("email", "Email Address")}
            <input
              {...field("email")}
              type="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
            />
            {err("email")}
          </div>
        </div>
        <div className="form__row">
          <div className="field">
            {label("phone", "Contact Number")}
            <PhoneInput
              {...field("phone")}
              required
              placeholder="Phone number"
              country={values.phoneCountry}
              onCountryChange={(code) =>
                update({ phoneCountry: code }, ["phone"])
              }
              value={values.phone}
              onChange={(v) => set("phone", v)}
              invalid={Boolean(touched.phone && errors.phone)}
            />
            {err("phone")}
          </div>
        </div>
      </Section>

      <Section title="Business details">
        <div className="form__row">
          <div className="field">
            {label("businessType", "Business Type")}
            <select
              {...field("businessType")}
              required
              value={values.businessType}
              onChange={(e) => set("businessType", e.target.value)}
            >
              <option value="" disabled>
                Select business type
              </option>
              {businessTypes.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {err("businessType")}
          </div>
          <div className="field">
            {label("systemInUse", "System in Use")}
            <select
              {...field("systemInUse")}
              required
              value={values.systemInUse}
              onChange={(e) => set("systemInUse", e.target.value)}
            >
              <option value="" disabled>
                Select system
              </option>
              {systemOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {err("systemInUse")}
          </div>
        </div>
      </Section>

      <Section title="Plan & resources">
        <div className="form__row">
          <div className="field">
            {label("planModel", "Plan Model")}
            <select
              {...field("planModel")}
              required
              value={values.planModel}
              onChange={(e) =>
                // Switching plans starts the resource table fresh
                update(
                  {
                    planModel: e.target.value as PlanModel,
                    resources: emptyResources,
                    resourcesNotSure: false,
                  },
                  ["planModel", "resources"],
                )
              }
            >
              <option value="" disabled>
                Select plan model
              </option>
              {planModels.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            {err("planModel")}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {column && (
            <motion.div
              key={values.planModel}
              className="resources"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
            >
              <p className="resources__title">
                Choose Resource <span aria-hidden="true">*</span>
              </p>
              <table
                className={`resources__table ${touched.resources && errors.resources ? "is-invalid" : ""}`}
              >
                <thead>
                  <tr>
                    <th scope="col">Resource</th>
                    <th scope="col">{column.heading}</th>
                  </tr>
                </thead>
                <tbody>
                  {resourceRoles.map((r) => (
                    <tr
                      key={r.id}
                      className={
                        values.resourcesNotSure ? "is-disabled" : undefined
                      }
                    >
                      <th scope="row">
                        <label htmlFor={`${uid}-resources-${r.id}`}>
                          {r.label}
                        </label>
                      </th>
                      <td>
                        <div className="resources__cell">
                          <input
                            id={`${uid}-resources-${r.id}`}
                            type="number"
                            inputMode="numeric"
                            min={0}
                            max={column.max}
                            step={1}
                            placeholder="0"
                            disabled={values.resourcesNotSure}
                            aria-describedby={
                              touched.resources && errors.resources
                                ? `${uid}-resources-err`
                                : undefined
                            }
                            value={values.resources[r.id]}
                            onChange={(e) =>
                              update(
                                {
                                  resources: {
                                    ...values.resources,
                                    [r.id]: e.target.value,
                                  },
                                },
                                ["resources"],
                              )
                            }
                            onBlur={() => blur("resources")}
                          />
                          <span className="resources__unit" aria-hidden="true">
                            {column.unit}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row">
                      <label htmlFor={`${uid}-resources-notsure`}>
                        Not Sure
                      </label>
                    </th>
                    <td>
                      <label className="resources__check">
                        <input
                          id={`${uid}-resources-notsure`}
                          type="checkbox"
                          checked={values.resourcesNotSure}
                          onChange={(e) =>
                            update(
                              {
                                resourcesNotSure: e.target.checked,
                                resources: e.target.checked
                                  ? emptyResources
                                  : values.resources,
                              },
                              ["resources"],
                            )
                          }
                        />
                        <span>I’m not sure yet</span>
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
              {err("resources")}
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      <Section title="Requirements">
        <div className="field">
          {label(
            "requirements",
            "Tell us about your business and accounting requirements",
            false,
          )}
          <textarea
            {...field("requirements")}
            rows={7}
            value={values.requirements}
            onChange={(e) => set("requirements", e.target.value)}
          />
          <span className="field__count" aria-hidden="true">
            {values.requirements.length} / 2000
          </span>
          {err("requirements")}
        </div>
      </Section>

      <div className="quote-form__foot">
        <button
          type="submit"
          className="btn btn--forest btn--lg"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? (
            <Loader2 className="spin" size={18} aria-hidden="true" />
          ) : null}
          <span>
            {status === "submitting" ? "Submitting…" : "Submit Request"}
          </span>
          {status !== "submitting" && (
            <ArrowRight className="btn__arrow" size={17} aria-hidden="true" />
          )}
        </button>
        <p className="form__req">
          <span aria-hidden="true">*</span> Required fields
        </p>
      </div>

      <div aria-live="polite">
        <AnimatePresence>
          {status === "error" && (
            <motion.div
              className="form-msg form-msg--error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AlertCircle size={18} aria-hidden="true" />
              <p>
                Sorry, your request could not be sent. Please try again or use
                WhatsApp or email.
              </p>
            </motion.div>
          )}
          {status === "unconfigured" && (
            <motion.div
              className="form-msg form-msg--pending"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Settings2 size={18} aria-hidden="true" />
              <div>
                <p>
                  <strong>Your request has not been sent.</strong> Online form
                  submission isn’t connected yet
                  {mailto || wa
                    ? " — you can send the same details directly instead:"
                    : ". Contact details will be added soon."}
                </p>
                {(mailto || wa) && (
                  <div className="form-msg__actions">
                    {mailto && (
                      <a className="btn btn--forest" href={mailto}>
                        <Mail size={16} aria-hidden="true" />
                        <span>Send via email</span>
                      </a>
                    )}
                    {wa && (
                      <a
                        className="btn btn--outline-dark"
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle size={16} aria-hidden="true" />
                        <span>Send via WhatsApp</span>
                      </a>
                    )}
                  </div>
                )}
                <p className="form-msg__dev">
                  Site owner: set <code>VITE_FORM_ENDPOINT</code> to enable
                  direct submission.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
    {optionsModal}
    </>
  );
}
