const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const chalk = require('chalk');
var textract = require('textract');
const { promisify } = require('util');
const { fsExistsSync } = require('./utils');

const fromFileWithPath = promisify(textract.fromFileWithPath);
let resolve;
if (process.env.NODE_ENV == 'development') {
  resolve = dir => path.join(__dirname, '..', dir);
} else {
  resolve = dir => path.join(path.dirname(process.execPath), dir);
}

const searchPathTop = resolve('./');
let keyWord = '';
const results = [];
const keywordsFile = 'keywords.txt';
const resName = 'keywords-result.txt';
const resError = 'keywords-error.txt';
const runError = 'keywords-runtime-error.txt';
const search = async (searchPath, loop) => {
  let files = fs.readdirSync(searchPath);
  let keyWords = keyWord.split('=');
  for (let file of files) {
    if (fs.statSync(path.join(searchPath, file)).isFile()) {
      if (/.doc$/.test(file)) {
        try {
          // https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=307657
          // Word file are mostly smaller than about 12 kilobytes and have less than 1024 bytes of text.
          const stat = fs.statSync(path.join(searchPath, file));
          if (stat.size < 12000) {
            results.push(` ${path.join(searchPath, file)} 过小，未进行搜索`);
          } else {
            let text = await fromFileWithPath(path.join(searchPath, file));
            if (text) {
              keyWords.map(keyWord => {
                if (text.includes(keyWord))
                  results.push(
                    ` ${path.join(searchPath, file)} 中含有 ${keyWord} 请修改`
                  );
              });
            }
          }
        } catch (error) {
          fs.writeFileSync(path.join(searchPathTop, resError), error);
        }
      }
      if (/.docx$/.test(file)) {
        let result = await mammoth.extractRawText({
          path: path.join(searchPath, file)
        });
        keyWords.map(keyWord => {
          if (result.value.includes(keyWord))
            results.push(
              ` ${path.join(searchPath, file)} 中含有 ${keyWord} 请修改`
            );
        });
      }
    } else {
      await search(path.join(searchPath, file), true);
    }
  }
  if (!loop) {
    fs.writeFileSync(path.join(searchPathTop, resName), results.join('\r\n'));
    console.log(
      chalk.blue(`\n搜索完成！请查看 ${path.join(searchPathTop, resName)}`)
    );
  }
  // setTimeout(() => {}, 10000);
};

// 捕获异常
const init = () => {
  // 搜索结果、error存在则删除
  if (fsExistsSync(path.join(searchPathTop, resName)))
    fs.unlinkSync(path.join(searchPathTop, resName));
  if (fsExistsSync(path.join(searchPathTop, resError)))
    fs.unlinkSync(path.join(searchPathTop, resError));
  if (fsExistsSync(path.join(searchPathTop, runError)))
    fs.unlinkSync(path.join(searchPathTop, runError));
  try {
    const data = fs.readFileSync(resolve(keywordsFile), 'UTF-8');
    keyWord = data.toString().trim();
    results.push(`关键词为 ${keyWord.split('=').join('、')}`);
    search(searchPathTop);
  } catch (error) {
    fs.writeFileSync(path.join(searchPathTop, runError), error);
  }
};

init();
