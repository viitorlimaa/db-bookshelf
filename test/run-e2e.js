const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const databaseUrl =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/bookshelf_test';
const directDatabaseUrl =
  process.env.DIRECT_DATABASE_URL || databaseUrl;
const env = { ...process.env, DATABASE_URL: databaseUrl };
env.DIRECT_DATABASE_URL = directDatabaseUrl;

function run(script, args) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    env,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exitCode = result.status || 1;
    return false;
  }

  return true;
}

try {
  if (
    run(
      path.join(root, 'node_modules', 'prisma', 'build', 'index.js'),
      ['migrate', 'deploy'],
    )
  ) {
    run(path.join(root, 'node_modules', 'jest', 'bin', 'jest.js'), [
      '--config',
      './test/jest-e2e.json',
    ]);
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
