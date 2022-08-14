module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es2021: true
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 13,
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
    },
    // global: {
    //     "NodeJS": "readonly" //readonly writable
    // },
    globals: {
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly'
    },
    plugins: ['vue', '@typescript-eslint'], // , 'prettier'
    extends: [
        'eslint:recommended', //继承Eslint中推荐的（打钩的）规则项http://eslint.cn/docs/rules/
        'plugin:vue/essential', // 此项是用来配置vue.js风格
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        // 'plugin:prettier/recommended', // 添加 prettier 插件
        // 'prettier', // 把prettier中设置的规则添加进来，让它覆盖上面设置的规则。这样就不会和上面的规则冲突了
        './.eslintrc-auto-import.json'
    ],
    rules: {
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/interface-name-prefix': 0,
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-parameter-properties': 0,
        '@typescript-eslint/no-this-alias': 'off',
        'vue/no-multiple-template-root': 'off',
        'vue/one-component-per-file': 'off',
        'vue/comment-directive': 'off',
        'vue/multi-word-component-names': 'off', // 顶部第一行class问题
        'no-useless-constructor': 'off',
        'no-async-promise-executor': 'off',
        // 'prettier/prettier': 'error',
        'no-undef': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-console': 'off',
        // 'no-var': 'error',
        // 禁止对 function 声明重新赋值
        'no-func-assign': 'warn',
        // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码
        'no-unreachable': 'warn',
        // 关闭强制所有控制语句使用一致的括号风格
        curly: 'off',
        // 要求 switch 语句中有 default 分支
        'default-case': 'warn',
        // 强制尽可能地使用点号
        'dot-notation': 'warn',
        // 要求使用 === 和 !==
        eqeqeq: 'warn',
        // 禁止出现空函数
        'no-empty-function': 'warn',
        // 禁用不必要的嵌套块
        'no-lone-blocks': 'warn',
        // 禁止使用多个空格
        'no-multi-spaces': 'warn',
        // "no-debugger": "off"
        // 禁止多次声明同一变量
        'no-redeclare': 'warn',
        // 禁止在 return 语句中使用赋值语句
        'no-return-assign': 'warn',
        // 禁用不必要的 return await
        'no-return-await': 'warn',
        // 禁止自我赋值
        'no-self-assign': 'warn',
        // 禁止自身比较
        'no-self-compare': 'warn',
        // 禁止不必要的 catch 子句
        'no-useless-catch': 'warn',
        // 禁止多余的 return 语句
        'no-useless-return': 'warn',
        // 禁止变量声明与外层作用域的变量同名
        'no-shadow': 'off',
        // 允许delete变量
        'no-delete-var': 'off',
        // 强制数组方括号中使用一致的空格
        'array-bracket-spacing': 'warn',
        // 强制在代码块中使用一致的大括号风格
        'brace-style': 'warn',
        // 强制使用骆驼拼写法命名约定
        camelcase: 'warn',
        // 强制使用一致的缩进
        indent: 'off',
        // 强制可嵌套的块的最大深度4
        'max-depth': 'warn',
        // 强制函数块最多允许的的语句数量100
        'max-statements': ['warn', 160],
        // 强制回调函数最大嵌套深度
        'max-nested-callbacks': ['warn', 4],
        // 强制函数定义中最多允许的参数数量
        // 'max-params': ['warn', 3],
        // 强制每一行中所允许的最大语句数量
        'max-statements-per-line': ['warn', { max: 1 }],
        // 要求方法链中每个调用都有一个换行符
        'newline-per-chained-call': ['warn', { ignoreChainWithDepth: 3 }],
        // 禁止 if 作为唯一的语句出现在 else 语句中
        'no-lonely-if': 'warn',
        // 禁止空格和 tab 的混合缩进
        'no-mixed-spaces-and-tabs': 'warn',
        // 禁止出现多行空行
        'no-multiple-empty-lines': 'warn',
        // 禁止出现;
        semi: ['warn', 'never'],
        // 强制在块之前使用一致的空格
        'space-before-blocks': 'warn',
        // 强制在 function的左括号之前使用一致的空格
        // 'space-before-function-paren': ['warn', 'never'],
        // 强制在圆括号内使用一致的空格
        'space-in-parens': 'warn',
        // 要求操作符周围有空格
        'space-infix-ops': 'warn',
        // 强制在一元操作符前后使用一致的空格
        'space-unary-ops': 'warn',
        // 强制在注释中 // 或 /* 使用一致的空格
        // "spaced-comment": "warn",
        // 强制在 switch 的冒号左右有空格
        'switch-colon-spacing': 'warn',
        // 强制箭头函数的箭头前后使用一致的空格
        'arrow-spacing': 'warn',
        'no-var': 'warn',
        'prefer-const': 'warn',
        'prefer-rest-params': 'warn',
        'no-useless-escape': 'warn',
        'no-irregular-whitespace': 'warn',
        'no-prototype-builtins': 'warn',
        'no-fallthrough': 'warn',
        'no-extra-boolean-cast': 'warn',
        'no-case-declarations': 'warn',
        // 标签闭合控制   any 都可以 always必须  never不闭合
        "vue/html-self-closing": ["error", {
            "html": {
                "void": "any",
                "normal": "any",
                "component": "any"
            },
            "svg": "always",
            "math": "always"
        }],

        "vue/v-on-event-hyphenation": ["off", "never", {
            "autofix": false,
            "ignore": []
        }],
        "vue/no-v-model-argument": 0,
        "vue/html-indent": ["warn", 4, {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }],
        // dom标签属性换行
        // 强制第一个属性的位置(属性换行)
        'vue/first-attribute-linebreak': [2, {
            // 单行时，第一属性前不允许使用换行符
            singleline: 'beside',
            // 多行时，第一属性前必须使用换行符
            multiline: 'below',
        }],
        // 强制每行的最大属性数
        'vue/max-attributes-per-line': [2, {
            // 单行时可以接收最大数量
            singleline: 10,
            // 多行时可以接收最大数量
            multiline: {
                max: 1,
            },
        }],
    },

}
