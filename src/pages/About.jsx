import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';
import { getAboutData } from '../utils/getAbout';
import FadeIn from '../components/FadeIn';
import Timeline from '../components/Timeline';
import { FiDownload } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Chronological milestones for the NSBM journey timeline
const TIMELINE_EVENTS = [
  {
    year: '2021',
    title: 'A/L Completed — Commerce Stream',
    subtitle: 'Kaluthara Vidyalaya National School',
    description: 'Information Communication Technology, Accounting, Economics.',
  },
  {
    year: '2023',
    title: 'BSc Software Engineering Begins',
    subtitle: 'NSBM Green University (National School of Business Management)',
    description:
      'Studying core SE principles, algorithms, data structures, system design, and modern development practices.',
  },
  {
    year: 'Sep 2023',
    title: 'Python for Beginners Certificate',
    subtitle: 'University of Moratuwa (Open Learning)',
  },
  {
    year: 'Jun 2024',
    title: 'EF SET English Certificate — C1 Advanced (67/100)',
    subtitle: 'EF Standard English Test',
  },
  {
    year: 'Jul 2025',
    title: 'Web Design for Beginners Certificate',
    subtitle: 'University of Moratuwa (Open Learning)',
  },
  {
    year: 'Sep 2025',
    title: 'Launched kavishkadulshan.dev',
    subtitle: 'Personal portfolio & technical blog',
    description:
      'Built with React + Vite SSG. Covers full-stack projects, IoT builds, and software engineering writing.',
  },
  {
    year: 'Mar 2026',
    title: 'MongoDB Document Model Certificate',
    subtitle: 'MongoDB University via Credly',
  },
  {
    year: '2026 →',
    title: 'Building, shipping, and writing publicly',
    subtitle: 'Full-Stack · IoT · Security',
    description:
      'Open to software engineering internship opportunities. Currently building full-stack systems and ESP32 IoT projects.',
    highlight: 'Open to Internships',
  },
];

export default function About() {
  const {
    name,
    tagline,
    education = [],
    skills = [],
    certificates = [],
    currently = [],
    body,
  } = getAboutData();

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10 sm:py-16">
      <SEO
        title="About"
        description={`${name} — ${tagline}. Full-stack developer and IoT enthusiast specializing in React, Node.js, Flutter, and embedded systems.`}
        path="/about"
      />

      {/* ── Header + Resume CTA ── */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-12">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-gray-900 mb-2">{name}</h1>
            <p className="text-gray-600 text-sm">{tagline}</p>
          </div>
          {/* Resume Download — highly visible CTA */}
          <div className="flex flex-col sm:flex-row gap-3 self-start shrink-0">
            <a
              href="/resume.pdf"
              download
              id="resume-download-btn"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors"
              aria-label="Download Kavishka Dulshan's resume as PDF"
            >
              <FiDownload className="text-base" />
              Download Resume (PDF)
            </a>
            <Link
              to="/academic-record"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white text-gray-900 px-5 py-2.5 text-sm font-medium hover:border-gray-900 transition-colors"
            >
              Academic Record
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* ── Bio ── */}
      {body?.trim() && (
        <FadeIn delay={0.05}>
          <section className="mb-12">
            <div className="prose prose-gray max-w-none prose-p:text-gray-800 prose-p:leading-relaxed prose-strong:text-gray-900">
              <ReactMarkdown>{body}</ReactMarkdown>
            </div>
          </section>
        </FadeIn>
      )}

      <div className="border-t border-gray-200 mb-12" />

      {/* ── NSBM Journey Timeline ── */}
      <FadeIn delay={0.05}>
        <section className="mb-12">
          <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-8">
            Journey
          </h2>
          <Timeline events={TIMELINE_EVENTS} />
        </section>
      </FadeIn>

      <div className="border-t border-gray-200 mb-12" />

      {/* ── Education ── */}
      {education.length > 0 && (
        <FadeIn delay={0.05}>
          <section className="mb-12">
            <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-6">Education</h2>
            <div className="space-y-8">
              {education.map((entry, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-0.5 bg-gray-900 rounded-full shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{entry.degree}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{entry.institution} · {entry.period}</p>
                    {entry.description && (
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">{entry.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      <div className="border-t border-gray-200 mb-12" />

      {/* ── Skills ── */}
      {skills.length > 0 && (
        <FadeIn delay={0.05}>
          <section className="mb-12">
            <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-6">Skills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {skills.map(({ category, items }) => (
                <div key={category}>
                  <p className="text-xs uppercase tracking-widest text-gray-600 mb-3">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ── Certificates ── */}
      {certificates.length > 0 && (
        <FadeIn delay={0.05}>
          <>
            <div className="border-t border-gray-200 mb-12" />
            <section className="mb-12">
              <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-6">Certificates</h2>
              <div className="space-y-4">
                {certificates.map((cert, i) => (
                  <div key={i} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{cert.title}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{cert.issuer} · {cert.date}</p>
                    </div>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-600 hover:text-gray-900 hover:underline underline-offset-2 whitespace-nowrap shrink-0"
                      >
                        View ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        </FadeIn>
      )}

      {/* ── Currently ── */}
      {currently.length > 0 && (
        <FadeIn delay={0.05}>
          <>
            <div className="border-t border-gray-200 mb-12" />
            <section>
              <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">Currently</h2>
              <ul className="space-y-2">
                {currently.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-800">
                    <span className="text-gray-500 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </>
        </FadeIn>
      )}
    </div>
  );
}
