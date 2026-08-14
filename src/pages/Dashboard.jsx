import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import SEO from '../components/SEO';
import { FiTerminal, FiStar, FiUsers, FiGitPullRequest, FiAlertCircle, FiCode, FiFolder, FiClock, FiZap } from 'react-icons/fi';
import FadeIn from '../components/FadeIn';

const bannerFiles = [
  "11936-isaicarb.webp", "1229-code.webp", "1784-thunder.webp", "19237-orderside0.webp",
  "2332-nike.webp", "24149-celestial-requiem.webp", "3373-guts-v-s-griffith.webp", "3752-anime.webp",
  "3760-madeon.webp", "37715-shadow.webp", "4742-grass.webp", "4746-star-wars.webp",
  "4855-cat.webp", "5132-pixel-mario.webp", "5466-chise.webp", "55395-banner.webp",
  "56990-rain.webp", "6100-.webp", "6136-walking.webp", "6459-purple-to-blue-snowy-mountains-w-girl.webp",
  "7066-katana.webp", "70753-chill-girl-banner.webp", "71662-weak-arm-with-a-gun.webp", "71710-child-and-tanks.webp",
  "7338-smooth-rick-roll.webp", "7461-car-gif.webp", "7718-wumpus-in-space.webp", "8263-the-garden-of-words-1.webp",
  "8401-white-tree.webp", "85514-zephric.webp", "8636-gunny.webp", "94015-yo.webp",
  "9539-the-garden-of-words-2.webp", "99160-maro.webp"
];

// ── Skeleton card ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center animate-pulse">
      <div className="w-6 h-6 bg-gray-100 rounded-full mb-3" />
      <div className="h-3 w-20 bg-gray-100 rounded mb-3" />
      <div className="h-8 w-12 bg-gray-100 rounded" />
    </div>
  );
}

// ── Score ring for Lighthouse ──────────────────────────────────────────────
function ScoreRing({ score, label, color }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-14 h-14">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={radius} fill="none" stroke="currentColor" className="text-gray-200" strokeWidth="4" />
          <circle
            cx="28" cy="28" r={radius} fill="none"
            stroke={color} strokeWidth="4"
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
          {score}
        </span>
      </div>
      <span className="text-xs text-gray-500 text-center">{label}</span>
    </div>
  );
}

export default function Dashboard() {
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(true);

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const [lighthouseScores, setLighthouseScores] = useState(null);

  // ── Fetch repos: prefer pre-built static JSON, fall back to live API ──────
  useEffect(() => {
    fetch('/github-repos.json')
      .then((res) => {
        if (!res.ok) throw new Error('Static JSON not available');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setRepos(data);
      })
      .catch(() => {
        // Fall back to live GitHub REST API (dev mode / missing static file)
        fetch('https://api.github.com/users/kavishkadulshan/repos?sort=updated&per_page=100')
          .then((res) => res.json())
          .then((data) => { if (Array.isArray(data)) setRepos(data); })
          .catch((err) => console.error('Failed to fetch repositories', err));
      })
      .finally(() => setLoadingRepos(false));
  }, []);

  // ── Fetch stats: prefer pre-built static JSON, fall back to live GraphQL ──
  useEffect(() => {
    fetch('/github-stats.json')
      .then((res) => {
        if (!res.ok) throw new Error('Static JSON not available');
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoadingStats(false);
      })
      .catch(() => {
        setStatsError('Failed to load stats.');
        setLoadingStats(false);
      });
  }, []);

  // ── Lighthouse scores ─────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/lighthouse.json')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data) setLighthouseScores(data); })
      .catch(() => {});
  }, []);

  // ── Language DNA ─────────────────────────────────────────────────────────
  const languages = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});
  const sortedLanguages = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  const totalReposWithLang = sortedLanguages.reduce((s, [, n]) => s + n, 0);

  // ── Shuffled banner assignments ───────────────────────────────────────────
  const assignedBanners = useMemo(() => {
    const assignments = [];
    let availableBanners = [];
    let lastBanner = null;
    const shuffle = (array) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };
    for (let i = 0; i < repos.length; i++) {
      if (availableBanners.length === 0) {
        availableBanners = shuffle(bannerFiles);
        if (availableBanners[availableBanners.length - 1] === lastBanner && availableBanners.length > 1) {
          const temp = availableBanners[availableBanners.length - 1];
          availableBanners[availableBanners.length - 1] = availableBanners[availableBanners.length - 2];
          availableBanners[availableBanners.length - 2] = temp;
        }
      }
      const chosenBanner = availableBanners.pop();
      assignments.push(chosenBanner);
      lastBanner = chosenBanner;
    }
    return assignments;
  }, [repos]);

  return (
    <div className="bg-white min-h-screen pt-10 pb-16 max-w-5xl mx-auto px-6 sm:px-8">
      <SEO
        title="Dashboard"
        description="Kavishka Dulshan's developer dashboard — live GitHub stats, repositories, language breakdown, and coding activity."
        path="/dashboard"
      />
      <FadeIn>
        <h1 className="font-serif text-4xl sm:text-5xl font-medium text-gray-900 mb-4 flex items-center gap-3">
          <FiTerminal className="text-gray-400" />
          The Lab
        </h1>
        <p className="text-gray-500 mb-12">Kavishka Dulshan — Developer Dashboard</p>
      </FadeIn>

      {/* ── Developer Stats ── */}
      <FadeIn delay={0.05}>
        <div className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Developer Stats</h2>
          {loadingStats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : statsError ? (
            <div className="text-sm text-gray-500">{statsError}</div>
          ) : stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: FiStar,          label: 'Total Stars',   value: stats.stars },
                { icon: FiUsers,         label: 'Followers',     value: stats.followers },
                { icon: FiGitPullRequest, label: 'Pull Requests', value: stats.pullRequests },
                { icon: FiAlertCircle,   label: 'Issues',        value: stats.issues },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm flex flex-col items-center">
                  <Icon className="text-gray-400 text-xl mb-3" />
                  <div className="text-gray-500 text-sm font-medium mb-2">{label}</div>
                  <div className="text-3xl font-bold text-gray-900">{value}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </FadeIn>

      {/* ── Main Dashboard Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* ── Language DNA (Left) ── */}
        <FadeIn delay={0.1} className="flex flex-col h-full">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FiCode className="text-gray-400" />
            Language DNA
          </h2>
          {loadingRepos ? (
            <div className="flex-1 min-h-[300px] flex items-center justify-center bg-white border border-gray-200 rounded-2xl animate-pulse shadow-sm">
              <div className="w-32 h-32 rounded-full border-8 border-gray-100" />
            </div>
          ) : (
            <div className="flex-1 min-h-[300px] bg-white border border-gray-200 rounded-2xl p-6 flex flex-col shadow-sm">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={sortedLanguages.slice(0, 8).map(([name, value]) => ({ name, value }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                      if (percent <= 0.04) return null;
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius + 20;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text x={x} y={y} fill="currentColor" className="text-gray-700" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12" fontWeight="500">
                          {`${name} ${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                    labelLine={false}
                  >
                    {sortedLanguages.slice(0, 8).map(([lang], index) => {
                      const languageColorMap = {
                        'JavaScript': '#D4AF37', // Muted Gold
                        'TypeScript': '#3182CE', // Muted Blue
                        'Python': '#457B9D',     // Muted Teal/Blue
                        'PHP': '#6C5B7B',        // Muted Plum
                        'HTML': '#C05621',       // Muted Orange
                        'CSS': '#2B6CB0',        // Muted Blue
                        'C++': '#2C5282',        // Muted Dark Blue
                        'Java': '#B7791F',       // Muted Brown
                      };
                      const fallbackColors = ['#171717', '#3f3f46', '#52525b', '#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7', '#f4f4f5'];
                      const fill = languageColorMap[lang] || fallbackColors[index % fallbackColors.length];
                      return <Cell key={`cell-${index}`} fill={fill} />;
                    })}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} repos`, name]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-gray-200)', backgroundColor: 'var(--color-white)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '14px', fontWeight: '500' }}
                    itemStyle={{ color: 'var(--color-gray-900)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {sortedLanguages.length > 8 && (
                <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-gray-100 justify-center">
                  {sortedLanguages.slice(8).map(([lang, count]) => (
                    <span key={lang} className="px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-md text-xs font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </FadeIn>

        {/* ── Lighthouse CI Scores (Right) ── */}
        {lighthouseScores ? (
          <FadeIn delay={0.07} className="flex flex-col h-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FiZap className="text-gray-400" />
              Site Quality
            </h2>
            <div className="flex-1 min-h-[300px] bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-center items-center shadow-sm">
              <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-8">
                <ScoreRing score={lighthouseScores.performance}    label="Performance"     color="#4E8D9C" />
                <ScoreRing score={lighthouseScores.accessibility}  label="Accessibility"   color="#9C5E4E" />
                <ScoreRing score={lighthouseScores.seo}            label="SEO"             color="#4E9C6B" />
                <ScoreRing score={lighthouseScores.best_practices} label="Best Practices"  color="#7C4E9C" />
              </div>
              <p className="text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                Lighthouse scores for kavishkadulshan.dev
              </p>
            </div>
          </FadeIn>
        ) : (
          <div className="hidden lg:block" /> 
        )}
      </div>

      {loadingRepos ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
              <div className="w-full h-24 bg-gray-100" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : (

        <>
          {/* ── Active Repositories ── */}
          <div>
            <FadeIn delay={0.2}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiFolder className="text-gray-400" />
                Active Repositories
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {repos.map((repo, i) => (
                <FadeIn key={repo.id} delay={i < 10 ? i * 0.05 : 0}>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col h-full border border-gray-200 rounded-2xl hover:border-gray-900 transition-colors relative overflow-hidden bg-white"
                  >
                    <div className="w-full h-24 bg-gray-50 flex-shrink-0 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={`/images/banners/${assignedBanners[i]}`}
                        alt={`${repo.name} banner`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-medium text-gray-900 mb-2 truncate group-hover:underline">{repo.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-2">{repo.description || 'No description provided.'}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
                        <span className="font-medium">{repo.language || 'Multiple'}</span>
                        <span className="flex items-center gap-1"><FiStar className="text-gray-400" /> {repo.stargazers_count}</span>
                      </div>
                    </div>
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Build timestamp ── */}
      {stats?.fetchedAt && (
        <FadeIn delay={0.3}>
          <p className="mt-16 text-xs text-gray-400 flex items-center gap-1">
            <FiClock className="text-gray-300" />
            Stats last updated: {new Date(stats.fetchedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </FadeIn>
      )}
    </div>
  );
}