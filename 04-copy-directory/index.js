const { join } = require('path');
const { copyFile, mkdir, rmdir } = require('fs/promises');
async function copyDir(src, dest) {
  const srcPath = join(__dirname, src);
  const destPath = join(__dirname, dest);
  try {
    await rm(destPath, { recursive: true, force: true });
  } catch (err) {
    console.error(err);
  }
}

copyDir('files', 'files-copy');
