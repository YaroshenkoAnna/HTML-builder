const { join } = require('path');
const { copyFile, mkdir, rm, readdir } = require('fs/promises');

(async function (dest, srcCopy) {
  try {
    const srcCopyPath = join(__dirname, srcCopy);
    const destPath = join(__dirname, dest, srcCopy);

    await rm(destPath, { recursive: true, force: true });
    await mkdir(destPath, { recursive: true });

    await copy(srcCopyPath, destPath);
  } catch (err) {
    console.error(err);
  }
})('project-dist', 'assets');

async function copy(src, dest) {
  const elements = await readdir(src, { withFileTypes: true });

  for (const element of elements) {
    const srcPath = join(src, element.name);
    const destPath = join(dest, element.name);

    if (element.isFile()) {
      await copyFile(srcPath, destPath);
    } else if (element.isDirectory()) {
      await mkdir(destPath, { recursive: true });
      await copy(srcPath, destPath);
    }
  }
}
