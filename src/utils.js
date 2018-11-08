const mammoth = require("mammoth");
const fs = require('fs')

module.exports = {
  fileModify (modifyPath) {
    let files = fs.readdirSync(modifyPath)
    files.forEach(file => {
      if (fs.statSync(path.join(modifyPath, file)).isFile()) {
        let data = fs.readFileSync(path.join(modifyPath, file));
        // fs.writeFileSync(path.join(modifyPath, file), data);
      }
    })
  },
  async docxSearch(path, keyWord) {
    // mammoth.extractRawText({ path })
    //   .then(function (result) {
    //     var html = result.value; // The generated HTML
    //     var messages = result.messages; // Any messages, such as warnings during conversion
    //     // if (html.includes(keyWord))
    //     // console.log(result, this.record)
    //     console.log(1)
    //   })
    //   .done();
    let result = await mammoth.extractRawText({ path })
  },
  record (name, content) {
    fs.writeFile(name, content, (err, data) => {
      if (err) return console.error(err);
      console.log(
        chalk.blue(`\n搜索完成！请查看 ${path.join(process.cwd(), name)}`)
      );
    });
  },
  fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.constants.F_OK);
    }catch(e){
        return false;
    }
    return true;
  }
}
