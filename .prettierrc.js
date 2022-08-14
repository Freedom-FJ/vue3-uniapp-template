module.exports = {
    // 一行最多 100 字符
    // printWidth: 100,
    // 使用 4 个空格缩进
    tabWidth: 4,
    // 不使用缩进符，而使用空格
    useTabs: false,
    // 行尾需要有分号
    semi: false,
    // 使用单引号
    singleQuote: true,
    // 末尾不需要逗号
    trailingComma: "none",
    // 大括号内的首尾需要空格
    bracketSpacing: true,
    // 箭头函数，只有一个参数的时候，不需要括号
    arrowParens: "avoid",
    parser: 'typescript',
    insertPragma: false, //在已被preitter格式化的文件顶部加上标注
    endOfLine: 'auto',
    jsxBracketSameLine: false, //多属性html标签的‘>’折行放置
}