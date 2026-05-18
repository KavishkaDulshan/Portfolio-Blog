/**
 * fetch-github-stats.js
 *
 * Run during `npm run build` (via prerender.js) to pre-fetch GitHub data and
 * write it as static JSON into dist/ so the Dashboard page loads instantly
 * from CDN — no API key exposed to the client.
 *
 * Outputs:
 *   dist/github-stats.json  — followers, stars, PRs, issues
 *   dist/github-repos.json  — full repo list (sorted by updated_at)
 */

import fs from 'node:fs';
import path from 'node:path';

const GITHUB_USER = 'kavishkadulshan';

export async function fetchGitHubStats({ distDir, token }) {
  if (!token) {
    console.warn('  ⚠️  VITE_GITHUB_TOKEN not set — skipping GitHub stats pre-fetch.');
    console.warn('     Dashboard will fall back to live client-side API calls.');
    return;
  }

  console.log('\n📡 Pre-fetching GitHub data...');

  try {
    // ── REST: fetch all repos ──────────────────────────────────────────────
    const reposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'portfolio-prerender/1.0',
        },
      }
    );

    if (!reposRes.ok) {
      throw new Error(`GitHub REST API error: ${reposRes.status} ${reposRes.statusText}`);
    }

    const repos = await reposRes.json();

    // ── GraphQL: fetch aggregate stats ────────────────────────────────────
    const query = `
      query {
        user(login: "${GITHUB_USER}") {
          followers { totalCount }
          issues { totalCount }
          pullRequests { totalCount }
          repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
            nodes { stargazerCount }
          }
        }
      }
    `;

    const gqlRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'portfolio-prerender/1.0',
      },
      body: JSON.stringify({ query }),
    });

    if (!gqlRes.ok) {
      throw new Error(`GitHub GraphQL API error: ${gqlRes.status} ${gqlRes.statusText}`);
    }

    const { data } = await gqlRes.json();

    if (!data?.user) {
      throw new Error('GraphQL returned no user data — check token scopes.');
    }

    const totalStars = data.user.repositories.nodes.reduce(
      (acc, repo) => acc + (repo.stargazerCount || 0),
      0
    );

    const stats = {
      followers: data.user.followers.totalCount,
      issues: data.user.issues.totalCount,
      pullRequests: data.user.pullRequests.totalCount,
      stars: totalStars,
      fetchedAt: new Date().toISOString(),
    };

    // Write static JSON files into dist/
    fs.mkdirSync(distDir, { recursive: true });
    fs.writeFileSync(path.resolve(distDir, 'github-stats.json'), JSON.stringify(stats, null, 2));
    fs.writeFileSync(path.resolve(distDir, 'github-repos.json'), JSON.stringify(repos, null, 2));

    console.log(`  ✅ github-stats.json written (${stats.stars} stars, ${stats.followers} followers)`);
    console.log(`  ✅ github-repos.json written (${repos.length} repos)`);
  } catch (err) {
    // Non-fatal: log and continue. Dashboard will use live API fallback.
    console.error(`  ❌ GitHub pre-fetch failed: ${err.message}`);
    console.error('     Dashboard will fall back to live client-side API calls.');
  }
}
