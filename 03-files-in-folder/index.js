const { readdir, stat } = require('fs/promises');
const { join, extname, basename } = require('path');
(async function () {
  const folderPath = join(__dirname, 'secret-folder');
  try {
    const files = await readdir(folderPath, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (!file.isFile()) continue;
      const filePath = join(folderPath, file.name);
      const fileStats = await stat(filePath);
      const fileExt = extname(file.name);
      const fileName = basename(filePath, fileExt);
      const fileSize = (fileStats.size / 1024).toFixed(3) + 'kb';

      console.log(`${fileName} - ${fileExt.replace('.', '')} - ${fileSize}`);
    }
  } catch (err) {
    console.error(err);
  }
})();
