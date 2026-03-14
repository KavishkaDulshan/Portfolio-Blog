import ReactMarkdown from 'react-markdown';
import { getAboutData } from '../utils/getAbout';

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
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-16">
      {/* Header */}
      <h1 className="font-serif text-3xl sm:text-4xl font-medium text-gray-900 mb-2">{name}</h1>
      <p className="text-gray-600 text-sm mb-12">{tagline}</p>

      {/* Bio — rendered from markdown body of about.md */}
      {body?.trim() && (
        <section className="mb-12">
          <div className="prose prose-gray max-w-none prose-p:text-gray-800 prose-p:leading-relaxed prose-strong:text-gray-900">
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>
        </section>
      )}

      <div className="border-t border-gray-200 mb-12" />

      {/* Education */}
      {education.length > 0 && (
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
      )}

      <div className="border-t border-gray-200 mb-12" />

      {/* Skills */}
      {skills.length > 0 && (
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
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
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
      )}

      {/* Currently */}
      {currently.length > 0 && (
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
      )}
    </div>
  );
}
