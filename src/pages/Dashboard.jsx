import { useState, useEffect, useMemo } from 'react';
import { FiTerminal, FiStar, FiUsers, FiGitPullRequest, FiAlertCircle, FiCode, FiFolder } from 'react-icons/fi';
import FadeIn from '../components/FadeIn';

const bannerFiles = [
  "11936-isaicarb.gif", "1229-code.gif", "1784-thunder.gif", "19237-orderside0.jpg",
  "2332-nike.gif", "24149-celestial-requiem.png", "3373-guts-v-s-griffith.gif", "3752-anime.gif",
  "3760-madeon.gif", "37715-shadow.gif", "4742-grass.gif", "4746-star-wars.png",
  "4855-cat.gif", "5132-pixel-mario.gif", "5466-chise.gif", "55395-banner.jpg",
  "56990-rain.jpg", "6100-.gif", "6136-walking.gif", "6459-purple-to-blue-snowy-mountains-w-girl.gif",
  "7066-katana.gif", "70753-chill-girl-banner.png", "71662-weak-arm-with-a-gun.jpg", "71710-child-and-tanks.jpg",
  "7338-smooth-rick-roll.gif", "7461-car-gif.gif", "7718-wumpus-in-space.gif", "8263-the-garden-of-words-1.gif",
  "8401-white-tree.gif", "85514-zephric.jpg", "8636-gunny.gif", "94015-yo.jpg",
  "9539-the-garden-of-words-2.gif", "99160-maro.jpg"
];

export default function Dashboard() {
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(true);

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    fetch('https://api.github.com/users/kavishkadulshan/repos?sort=updated&per_page=100')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
        }
      })
      .catch((err) => console.error('Failed to fetch repositories', err))
      .finally(() => setLoadingRepos(false));
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (!token) {
        setStatsError("Stats unavailable: Missing API token.");
        setLoadingStats(false);
        return;
      }

      const query = `
        query {
          user(login: "kavishkadulshan") {
            followers {
              totalCount
            }
            issues {
              totalCount
            }
            pullRequests {
              totalCount
            }
            repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
              nodes {
                stargazerCount
              }
            }
          }
        }
      `;

      try {
        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const { data } = await response.json();
        
        if (data && data.user) {
          const totalStars = data.user.repositories.nodes.reduce(
            (acc, repo) => acc + (repo.stargazerCount || 0),
            0
          );
          
          setStats({
            followers: data.user.followers.totalCount,
            issues: data.user.issues.totalCount,
            pullRequests: data.user.pullRequests.totalCount,
            stars: totalStars,
          });
        } else {
          setStatsError("Failed to load stats.");
        }
      } catch (err) {
        console.error(err);
        setStatsError("Failed to fetch GitHub stats.");
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const languages = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});
  
  const sortedLanguages = Object.entries(languages).sort((a, b) => b[1] - a[1]);

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
        // Ensure the newly drawn banner isn't the same as the last one appended across reshuffles
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
      <FadeIn>
        <h1 className="font-serif text-4xl sm:text-5xl font-medium text-gray-900 mb-4 flex items-center gap-3">
          <FiTerminal className="text-gray-400" />
          The Lab
        </h1>
        <p className="text-gray-500 mb-12">Kavishka Dulshan - Developer Dashboard</p>
      </FadeIn>
      
      {/* Developer Stats Card Section */}
      <FadeIn delay={0.05}>
        <div className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Developer Stats</h2>
          {loadingStats ? (
            <div className="text-gray-500">Loading stats...</div>
          ) : statsError ? (
            <div className="text-sm text-gray-500">{statsError}</div>
          ) : stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm flex flex-col items-center">
                <FiStar className="text-gray-400 text-xl mb-3" />
                <div className="text-gray-500 text-sm font-medium mb-2">Total Stars</div>
                <div className="text-3xl font-bold text-gray-900">{stats.stars}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm flex flex-col items-center">
                <FiUsers className="text-gray-400 text-xl mb-3" />
                <div className="text-gray-500 text-sm font-medium mb-2">Followers</div>
                <div className="text-3xl font-bold text-gray-900">{stats.followers}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm flex flex-col items-center">
                <FiGitPullRequest className="text-gray-400 text-xl mb-3" />
                <div className="text-gray-500 text-sm font-medium mb-2">Pull Requests</div>
                <div className="text-3xl font-bold text-gray-900">{stats.pullRequests}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm flex flex-col items-center">
                <FiAlertCircle className="text-gray-400 text-xl mb-3" />
                <div className="text-gray-500 text-sm font-medium mb-2">Issues</div>
                <div className="text-3xl font-bold text-gray-900">{stats.issues}</div>
              </div>
            </div>
          ) : null}
        </div>
      </FadeIn>

      {loadingRepos ? (
        <div className="text-gray-500">Loading data...</div>
      ) : (
        <>
          {/* Language DNA */}
          <FadeIn delay={0.1}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FiCode className="text-gray-400" />
              Language DNA
            </h2>
            <div className="flex flex-wrap gap-3 mb-16">
              {sortedLanguages.map(([lang, count]) => (
                <span key={lang} className="px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-sm font-medium">
                  {lang} ({count})
                </span>
              ))}
            </div>
          </FadeIn>

          {/* Active Repositories */}
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
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="group flex flex-col h-full border border-gray-200 rounded-2xl hover:border-gray-900 transition-colors relative overflow-hidden bg-white">
                    {/* Aesthetic 2D Animated Banner */}
                    <div className="w-full h-24 bg-gray-50 flex-shrink-0 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={`/images/banners/${assignedBanners[i]}`}
                        alt={`${repo.name} aesthetic banner`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-medium text-gray-900 mb-2 truncate group-hover:underline">{repo.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-2">{repo.description || "No description provided."}</p>
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
    </div>
  );
}