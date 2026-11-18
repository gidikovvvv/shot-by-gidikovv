import { useId, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { site } from '@/config/site'
import { Arrow } from '@/components/ui/ArrowLink'
import { ease } from '@/lib/motion'

/**
 * Real submission via Web3Forms (https://web3forms.com — free, no backend).
 * Set VITE_WEB3FORMS_ACCESS_KEY to enable it. Without a key, the form falls
 * back to opening the visitor's email app with the message pre-filled, so it
 * always works and never pretends to send.
 */
const ENDPOINT = 'https://api.web3forms.com/submit'

const INQUIRY_TYPES = ['Event / concert', 'Portrait session', 'Fashion / editorial', 'Automotive', 'Brand / commercial', 'Something else']

type Fields = { name: string; email: string; type: string; date: string; message: string }
type Errors = Partial<Record<keyof Fields, string>>
type Status = 'idle' | 'sending' | 'sent' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (f.name.trim().length < 2) e.name = 'Please tell me your name.'
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Please enter a valid email address.'
  if (f.message.trim().length < 20) e.message = 'A few more details would help — at least 20 characters.'
  return e
}

export function ContactForm() {
  const uid = useId()
  const hasService = Boolean(site.formAccessKey)
  const [fields, setFields] = useState<Fields>({ name: '', email: '', type: INQUIRY_TYPES[0], date: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverMessage, setServerMessage] = useState('')

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const errs = validate(fields)
    setErrors(errs)
    const firstInvalid = (Object.keys(errs) as (keyof Fields)[])[0]
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    // Honeypot: bots fill hidden fields, humans don't.
    if ((form.elements.namedItem('botcheck') as HTMLInputElement | null)?.checked) return

    const subject = `Photography inquiry — ${fields.type}${fields.name ? ` (${fields.name.trim()})` : ''}`
    const body = [
      `Name: ${fields.name.trim()}`,
      `Email: ${fields.email.trim()}`,
      `Type: ${fields.type}`,
      ...(fields.date ? [`Date: ${fields.date}`] : []),
      '',
      fields.message.trim(),
    ].join('\n')

    if (!hasService) {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: site.formAccessKey,
          subject,
          from_name: site.name,
          replyto: fields.email.trim(),
          name: fields.name.trim(),
          email: fields.email.trim(),
          inquiry_type: fields.type,
          date: fields.date || 'Not specified',
          message: fields.message.trim(),
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string }
      if (!res.ok || !data.success) throw new Error(data.message || `Request failed (${res.status})`)
      setStatus('sent')
    } catch (err) {
      setServerMessage(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <motion.div
            key="sent"
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ease.cinematic }}
            className="border-t border-line pt-10"
          >
            <p className="eyebrow text-brass">Message sent</p>
            <h2 className="mt-5 font-display text-display-md">
              Thank you, <span className="italic">{fields.name.trim().split(' ')[0]}</span>.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-bone-dim">
              Your inquiry is in my inbox. I’ll reply to <span className="text-bone">{fields.email}</span>, usually
              within a day or two.
            </p>
            <button
              type="button"
              className="eyebrow link-draw mt-10 pb-1 text-bone-dim hover:text-bone"
              onClick={() => {
                setFields({ name: '', email: '', type: INQUIRY_TYPES[0], date: '', message: '' })
                setStatus('idle')
              }}
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            aria-describedby={`${uid}-note`}
            className="grid gap-x-10 gap-y-9 sm:grid-cols-2"
          >
            <Field id={`${uid}-name`} label="Your name" error={errors.name}>
              <input
                id={`${uid}-name`}
                name="name"
                autoComplete="name"
                className="field"
                value={fields.name}
                onChange={set('name')}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                required
              />
            </Field>
            <Field id={`${uid}-email`} label="Email" error={errors.email}>
              <input
                id={`${uid}-email`}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                className="field"
                value={fields.email}
                onChange={set('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${uid}-email-err` : undefined}
                required
              />
            </Field>
            <Field id={`${uid}-type`} label="What’s the shoot?">
              <div className="relative">
                <select
                  id={`${uid}-type`}
                  name="type"
                  className="field cursor-pointer appearance-none pr-8"
                  value={fields.type}
                  onChange={set('type')}
                >
                  {INQUIRY_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-ink">
                      {t}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 12 8"
                  className="pointer-events-none absolute top-1/2 right-0 h-2 w-3 -translate-y-1/2 text-bone-dim"
                >
                  <path d="M1 1l5 5 5-5" stroke="currentColor" fill="none" />
                </svg>
              </div>
            </Field>
            <Field id={`${uid}-date`} label="Date (if known)">
              <input
                id={`${uid}-date`}
                name="date"
                type="date"
                className="field [color-scheme:dark]"
                value={fields.date}
                onChange={set('date')}
              />
            </Field>
            <Field id={`${uid}-message`} label="Tell me about it" error={errors.message} className="sm:col-span-2">
              <textarea
                id={`${uid}-message`}
                name="message"
                rows={5}
                className="field resize-y"
                placeholder="Location, the feel you’re after, how the photos will be used…"
                value={fields.message}
                onChange={set('message')}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? `${uid}-message-err` : undefined}
                required
              />
            </Field>

            {/* Honeypot — hidden from people and assistive tech */}
            <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" className="hidden" />

            <div className="flex flex-col gap-6 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p id={`${uid}-note`} className="max-w-sm text-xs leading-relaxed text-mute">
                {hasService
                  ? 'Your details are only used to reply to your inquiry.'
                  : 'Sending opens your email app with this message ready to go.'}
              </p>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="group inline-flex items-center justify-center gap-6 border border-bone px-8 py-5 transition-colors duration-500 hover:bg-bone hover:text-ink focus-visible:bg-bone focus-visible:text-ink disabled:cursor-wait disabled:opacity-60"
              >
                <span className="eyebrow whitespace-nowrap text-[0.75rem]">
                  {status === 'sending' ? 'Sending…' : hasService ? 'Send inquiry' : 'Continue in email app'}
                </span>
                <Arrow className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2" />
              </button>
            </div>

            <div aria-live="assertive" className="sm:col-span-2">
              {status === 'error' && (
                <p className="border-l border-danger pl-4 text-sm leading-relaxed text-bone-dim">
                  <span className="text-danger">The message couldn’t be sent</span> ({serverMessage}). Please try again,
                  or email me directly at{' '}
                  <a className="text-bone underline underline-offset-4" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                  .
                </p>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({
  id,
  label,
  error,
  className = '',
  children,
}: {
  id: string
  label: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow block text-mute">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
