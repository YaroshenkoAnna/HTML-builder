const { join, extname } = require('path');
const { readdir, writeFile } = require('fs/promises');
const { createReadStream } = require('fs');

(async function (srcDir, destDir) {
  try {
    const srcDirPath = join(__dirname, srcDir);
    const destFilePath = join(__dirname, destDir, 'bundle.css');

    await writeFile(destFilePath, '');
    const files = await readdir(srcDirPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && extname(file.name) === '.css') {
        const srcFilePath = join(srcDirPath, file.name);
        const stream = createReadStream(srcFilePath, 'utf-8');
        let fileData = '';

        for await (const chunk of stream) {
          fileData += chunk;
        }
        await writeFile(destFilePath, fileData + '\n', { flag: 'a' });
      }
    }
  } catch (err) {
    console.error(err);
  }
})('styles', 'project-dist');
