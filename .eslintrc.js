module.exports = {
  root: true,
  env: {
    node: true,
  },
  // @vue/standard 太严格了，会报错太多
  // extends: ['plugin:vue/essential', '@vue/standard'],
  extends: ["plugin:vue/essential", "eslint:recommended"],
  parserOptions: {
    parser: "babel-eslint",
  },
  // 如果违反了规则情况下，这里的数字：0表示不不处理，1表示警告，2表示错误并退出
  // https://note.youdao.com/ynoteshare1/index.html?id=07e494d6cd0d9e295098f38d1aeba9ff&type=note
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

    // 分号不错误
    // https://eslint.org/docs/user-guide/configuring
    // 'semi': 0, //语句强制分号结尾
    // semi: [2, "never"], // 语句强制分号结尾
    // quotes: [2, "single"], // 引号类型 `` "" ''
    yoda: "off",
    // allow async-await
    "generator-star-spacing": "off", // 生成器函数*的前后空格
    // allow debugger during development

    // 忽略vue组件标签是自闭合有end标签会报错检查
    // IDE检查时去掉这项检查，避免被“优化”掉
    "vue/no-parsing-error": [2, { "x-invalid-end-tag": false }],
    "no-func-assign": 2, // 禁止重复的函数声明
    "no-spaced-func": 2, // 函数调用时 函数名与()之间不能有空格
    // "space-before-function-paren": [2, "never"], // 函数定义时括号前面要不要有空格
    "no-useless-escape": 0, // 禁用不必要的转义字符

    "prefer-const": 0, // 首选const
    "dot-notation": 0,

    "no-unused-vars": 1, //不能有声明后未被使用的变量或参数
    "no-undef": 2, //不能有未定义的变量
    "no-undef-init": 0, //变量初始化时不能直接给它赋值为undefined
    "no-undefined": 0, //不能使用undefined
    "vue/no-unused-components": 1,
    "promise/param-names": 0,
    "no-empty": 0,
    "vue/no-unused-vars": 0
  },
}
