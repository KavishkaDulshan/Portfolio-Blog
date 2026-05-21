import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import FadeIn from '../components/FadeIn';
import SEO from '../components/SEO';
import LinkedInBadge from '../components/LinkedInBadge';
import {
  FiMail, FiGithub, FiLinkedin, FiSend, FiCalendar, FiCheck, FiAlertCircle,
} from 'react-icons/fi';

// ── Zod validation schema ──────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

// ── Quick-link channels ────────────────────────────────────────────────────
const channels = [
  {
    id: 'contact-email',
    icon: FiMail,
    label: 'Email',
    value: 'kavishkadulshan2@gmail.com',
    href: 'mailto:kavishkadulshan2@gmail.com',
    description: 'Best for anything serious. I reply within 1–2 days.',
  },
  {
    id: 'contact-github',
    icon: FiGithub,
    label: 'GitHub',
    value: 'KavishkaDulshan',
    href: 'https://github.com/KavishkaDulshan',
    description: 'Code, contributions, and personal projects.',
  },
  {
    id: 'contact-linkedin',
    icon: FiLinkedin,
    label: 'LinkedIn',
    value: 'kavishka-dulshan',
    href: 'https://www.linkedin.com/in/kavishka-dulshan/',
    description: 'Professional profile and connections.',
  },
];

// ── Field component ────────────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600" role="alert">
          <FiAlertCircle className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Input / Textarea shared styles ─────────────────────────────────────────
const inputCls =
  'w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg px-4 py-2.5 ' +
  'placeholder:text-gray-400 focus:outline-none focus:border-gray-900 ' +
  'transition-colors duration-150';

// ── Main component ─────────────────────────────────────────────────────────
export default function Contact() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data) => {
    setStatus('submitting');
    try {
      // Formspree endpoint — replace YOUR_FORM_ID with your actual Formspree form ID
      // Sign up free at https://formspree.io and create a form to get an ID
      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mojbqzvp';

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10 sm:py-16">
      <SEO
        title="Contact"
        description="Get in touch with Kavishka Dulshan — open to internships, collaboration, and interesting ideas. Reach out via email, GitHub, or LinkedIn."
        path="/contact"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Kavishka Dulshan',
          description: 'Get in touch with Kavishka Dulshan. Open to internships, collaboration, and interesting ideas.',
          url: 'https://kavishkadulshan.dev/contact',
          mainEntity: {
            '@type': 'Person',
            name: 'Kavishka Dulshan',
            email: 'kavishkadulshan2@gmail.com',
            url: 'https://kavishkadulshan.dev/',
            sameAs: [
              'https://github.com/KavishkaDulshan',
              'https://www.linkedin.com/in/kavishka-dulshan/',
            ],
          },
        }}
      />

      {/* ── Header ── */}
      <FadeIn>
        <div className="mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-gray-900 mb-3">
            Let's Talk
          </h1>
          <p className="text-gray-600 text-sm max-w-xl leading-relaxed">
            I'm open to internship opportunities, collaboration, and interesting ideas.
            Fill in the form or pick a channel, I'll get back to you quickly.
          </p>
        </div>
      </FadeIn>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

        {/* Left — Contact Form ── */}
        <FadeIn delay={0.05}>
          <div>
            <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-6">
              Send a Message
            </h2>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center border border-gray-200 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
                  <FiCheck className="text-white text-xl" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Message sent!</p>
                  <p className="text-sm text-gray-500">I'll get back to you as soon as possible.</p>
                </div>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                id="contact-form"
                className="space-y-5"
              >
                <Field label="Your Name" error={errors.name?.message}>
                  <input
                    {...register('name')}
                    id="contact-name"
                    type="text"
                    placeholder="Kavishka Dulshan"
                    autoComplete="name"
                    className={inputCls}
                  />
                </Field>

                <Field label="Email Address" error={errors.email?.message}>
                  <input
                    {...register('email')}
                    id="contact-email-field"
                    type="email"
                    placeholder="hello@example.com"
                    autoComplete="email"
                    className={inputCls}
                  />
                </Field>

                <Field label="Subject" error={errors.subject?.message}>
                  <input
                    {...register('subject')}
                    id="contact-subject"
                    type="text"
                    placeholder="Internship opportunity / Collaboration idea"
                    className={inputCls}
                  />
                </Field>

                <Field label="Message" error={errors.message?.message}>
                  <textarea
                    {...register('message')}
                    id="contact-message"
                    rows={5}
                    placeholder="Tell me what's on your mind…"
                    className={`${inputCls} resize-none`}
                  />
                </Field>

                {status === 'error' && (
                  <p className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
                    <FiAlertCircle className="shrink-0" />
                    Something went wrong. Please email me directly at{' '}
                    <a href="mailto:kavishkadulshan2@gmail.com" className="underline">
                      kavishkadulshan2@gmail.com
                    </a>
                  </p>
                )}

                <button
                  type="submit"
                  id="contact-submit"
                  disabled={status === 'submitting'}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-gray-900 text-white px-6 py-3 text-sm font-medium hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <FiSend />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </FadeIn>

        {/* Right — Channels + Calendly ── */}
        <FadeIn delay={0.1}>
          <div className="space-y-8">
            {/* Quick channels */}
            <div>
              <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-6">
                Quick Channels
              </h2>
              <div className="divide-y divide-gray-200">
                {channels.map(({ id, icon: Icon, label, value, href, description }) => (
                  <div key={id} className="py-4 flex items-start gap-4">
                    <div className="shrink-0 mt-0.5">
                      <Icon className="text-gray-400 text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5">{label}</p>
                      <a
                        id={id}
                        href={href}
                        target={href.startsWith('mailto') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-900 hover:underline underline-offset-2 truncate block"
                      >
                        {value}
                      </a>
                      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule a call */}
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <FiCalendar className="text-gray-400 text-lg shrink-0" />
                <h3 className="text-sm font-semibold text-gray-900">Schedule a 30-min Chat</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Prefer a real-time conversation? Book a slot directly — no email back-and-forth needed.
              </p>
              <a
                id="calendly-schedule-btn"
                href="https://calendly.com/kavishkadulshan2/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gray-900 text-gray-900 px-5 py-2 text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors"
              >
                <FiCalendar className="text-sm" />
                Open Calendly
              </a>
            </div>

            {/* LinkedIn badge */}
            <div>
              <p className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">
                Connect on LinkedIn
              </p>
              <LinkedInBadge vanityName="kavishka-dulshan" />
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
