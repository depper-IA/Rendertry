// Removes the .next build directory before a build. On Windows, `output:
// 'standalone'` + pnpm leaves dangling symlinks under .next/standalone that
// Next's own cleaner trips over (EPERM on scandir). The native rmdir handles
// them; on POSIX (CI/Docker) rm -rf is used. Missing dir is not an error.
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { platform } from 'node:os';

const target = '.next';

if (!existsSync(target)) {
  process.exit(0);
}

try {
  if (platform() === 'win32') {
    execSync(`rmdir /s /q "${target}"`, { stdio: 'ignore', shell: 'cmd.exe' });
  } else {
    execSync(`rm -rf "${target}"`, { stdio: 'ignore' });
  }
} catch {
  // Best effort: if something still holds a lock, the build will report it.
}
