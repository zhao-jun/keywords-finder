# keywords-finder
a keywords-finder for Word

## Requirement
依赖 antiword 对 doc 格式的 word 进行解析
### macOS
1. 安装 [brew](https://brew.sh/)
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
2. 安装 [antiword](http://www.winfield.demon.nl/)
```
brew install antiword
```
### Windows
- 获取 [antiword](http://www.winfield.demon.nl/)
  - 位于项目 test/files/antiword-0_37-windows.zip
- 解压并在系统环境变量 path 新增相应 antiword 路径

## Usage
### Executables
- 生成可执行文件
```
yarn run pkg
```
- 在 keywords.txt 输入关键字，以 = 分隔
```
关键词=测试位置=人
```
- 将 keywords.txt 和可执行文件放到要搜索的 word 文件下，执行后将对文件下所有 word 进行搜索，并获取结果 keywords-result.txt
