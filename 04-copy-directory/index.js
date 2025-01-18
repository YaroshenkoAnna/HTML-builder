const { join } = require('path');
const { copyFile, mkdir, rm, readdir } = require('fs/promises');
async function copyDir(src, dest) {
  try {
    const srcPath = join(__dirname, src);
    const destPath = join(__dirname, dest);

    await rm(destPath, { recursive: true, force: true });
    await mkdir(destPath);
    const files = await readdir(srcPath, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        const fileSrcPath = join(srcPath, file.name);
        const fileDestPath = join(destPath, file.name);
        copyFile(fileSrcPath, fileDestPath);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

copyDir('files', 'files-copy');
