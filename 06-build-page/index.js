const { join, extname, basename } = require('path');
const {
  copyFile,
  mkdir,
  rm,
  readdir,
  readFile,
  writeFile,
} = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');

(async function (dest, srcCopy) {
  try {
    const srcCopyPath = join(__dirname, srcCopy);
    const destPath = join(__dirname, dest);
    const destCopyPath = join(destPath, srcCopy);

    await rm(destCopyPath, { recursive: true, force: true });
    await mkdir(destCopyPath, { recursive: true });

    compile('styles', destPath);
    copy(srcCopyPath, destCopyPath);
    replace('components', 'template.html', destPath);
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

async function compile(srcDir, destDir) {
  const srcDirPath = join(__dirname, srcDir);
  const destFilePath = join(destDir, 'style.css');

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
}

async function replace(srcDir, template, destDir) {
  const srcDirPath = join(__dirname, srcDir);
  const srcTemplatePath = join(__dirname, template);
  const destFilePath = join(destDir, 'index.html');

  const templateData = await readFile(srcTemplatePath, 'utf-8');

  const fileExt = '.html';
  const files = await readdir(srcDirPath, { withFileTypes: true });
  const htmlReplacements = {};
  for (const file of files) {
    if (file.isFile() && extname(file.name) === fileExt) {
      const fileName = basename(file.name, fileExt);
      const filePath = join(srcDirPath, file.name);
      const fileData = await readFile(filePath, 'utf-8');
      htmlReplacements[fileName] = fileData;
    }
  }
  let resultHtml = templateData;
  for (const [key, value] of Object.entries(htmlReplacements)) {
    const placeholder = `{{${key}}}`;
    resultHtml = resultHtml.replace(new RegExp(placeholder, 'g'), value);
  }
  const writeStream = createWriteStream(destFilePath, 'utf-8');
  writeStream.write(resultHtml);
  writeStream.end();
}
