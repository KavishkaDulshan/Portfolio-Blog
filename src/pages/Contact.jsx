import FadeIn from '../components/FadeIn';

const contacts = [
  {
    label: 'Email',
    value: 'kavishkadulshan2@gmail.com',
    href: 'mailto:kavishkadulshan2@gmail.com',
    description: 'Best way to reach me for anything serious.',
  },
  {
    label: 'GitHub',
    value: 'https://github.com/KavishkaDulshan',
    href: 'https://github.com/KavishkaDulshan',
    description: 'Code, contributions, personal projects.',
  },
  {
    label: 'LinkedIn',
    value: 'https://www.linkedin.com/in/kavishka-dulshan/',
    href: 'https://www.linkedin.com/in/kavishka-dulshan/',
    description: 'Professional profile and connections.',
  },
];

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-16">
      <FadeIn>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-gray-900 mb-3">Contact</h1>
        <p className="text-gray-600 text-sm mb-12">
          I'm open to conversations about internships, collaboration, and interesting ideas.
          Pick a channel that works for you.
        </p>
      </FadeIn>

      {/* Contact list — each row staggers in */}
      <div className="divide-y divide-gray-200">
        {contacts.map(({ label, value, href, description }, i) => (
          <FadeIn key={label} delay={i * 0.07}>
            <div className="py-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">{label}</p>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs">{description}</p>
              </div>
              <a
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-900 hover:underline underline-offset-2 whitespace-nowrap"
              >
                {value}
              </a>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.3}>
        <div className="border-t border-gray-200 mt-4 pt-10">
          <p className="text-sm text-gray-600">
            I typically respond to emails within 1–2 days. For quick questions, LinkedIn DMs work too.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
