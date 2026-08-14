
import { fetchGitHubStats } from './scripts/fetch-github-stats.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  await fetchGitHubStats({
    distDir: path.resolve(__dirname, 'public'),
    token: process.env.GITHUB_TOKEN,
  });
  console.log('Done generating stats to public/ !');
}

run();
