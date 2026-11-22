const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const databaseUrl = 'file:./test.db';
const databasePath = path.join(root, 'prisma', 'test.db');
const databaseFiles = [databasePath, `${databasePath}-journal`];
const env = { ...process.env, DATABASE_URL: databaseUrl };

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

function removeTestDatabase() {
  for (const file of databaseFiles) {
    fs.rmSync(file, { force: true });
  }
}

try {
  removeTestDatabase();
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
} finally {
  removeTestDatabase();
}
