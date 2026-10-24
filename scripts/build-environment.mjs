import {loadEnv} from 'vite';

// Match Astro's CLI modes before reading settings used by the release gate
// and adapter selection. Vite preserves exported variables over env files.
export function loadBuildEnvironment(args = process.argv.slice(2), cwd = process.cwd()) {
 const modeFlag = args.findIndex(arg => arg === '--mode');
 const inlineMode = args.find(arg => arg.startsWith('--mode='));
 const mode = inlineMode?.slice('--mode='.length) || (modeFlag >= 0 ? args[modeFlag + 1] : undefined) || (args.includes('build') || args.includes('preview') ? 'production' : 'development');
 const env = loadEnv(mode, cwd, '');
 for (const [key, value] of Object.entries(env)) {
  if (process.env[key] === undefined) process.env[key] = value;
 }
 return env;
}
