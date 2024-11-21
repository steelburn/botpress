module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: ['prettier'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['*.d.ts', '*.test.ts', '*.js', 'cdk.out/', 'dist/', 'node_modules/', 'bp_modules', '.botpress/', '**/src/gen/'],
  plugins: [
    'eslint-plugin-import',
    'eslint-plugin-jsdoc',
    '@typescript-eslint',
    'unused-imports',
    'eslint-plugin-prettier',
  ],
  rules: {
    'no-console': [
      'warn',
      {
        allow: [
          'warn',
          'dir',
          'time',
          'timeEnd',
          'timeLog',
          'trace',
          'assert',
          'clear',
          'count',
          'countReset',
          'group',
          'groupEnd',
          'table',
          'debug',
          'info',
          'dirxml',
          'error',
          'groupCollapsed',
          'Console',
          'profile',
          'profileEnd',
          'timeStamp',
          'context'
        ]
      }
    ],
    complexity: ['off'],
    'no-cond-assign': 'warn',
    'no-const-assign': 'warn',
    'no-debugger': 'warn',
    'no-sparse-arrays': 'warn',
    'no-unreachable': 'warn',
    'max-lines-per-function': 'off',
    'default-case': 'warn',
    'default-case-last': 'warn',
    'max-depth': 'warn',
    'no-eval': 'warn',
    'no-return-assign': 'warn',
    'no-var': 'warn',
    'prefer-const': 'warn',
    'no-duplicate-imports': 'warn',
    '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
    '@typescript-eslint/member-delimiter-style': [
      'warn',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/prefer-namespace-keyword': 'warn',
    '@typescript-eslint/quotes': [
      'warn',
      'single',
      {
        avoidEscape: true,
      },
    ],
    '@typescript-eslint/no-floating-promises': 'error',
    "@typescript-eslint/no-misused-promises": "error",
    '@typescript-eslint/semi': ['warn', 'never'],
    '@typescript-eslint/type-annotation-spacing': 'warn',
    'brace-style': ['warn', '1tbs'],
    curly: 'warn',
    'eol-last': 'warn',
    eqeqeq: ['warn', 'smart'],
    '@typescript-eslint/no-shadow': 'off',
    'import/order': [
      'warn',
      {
        groups: [['builtin', 'external'], 'parent', 'index', 'sibling'],
        // TODO: Eventually enable this in the future for consistency
        // 'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'jsdoc/check-alignment': 'warn',
    'linebreak-style': ['warn', 'unix'],
    'no-duplicate-imports': 'warn',
    'no-trailing-spaces': 'warn',
    'no-var': 'warn',
    'object-shorthand': 'warn',
    'prefer-const': 'warn',
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    "@typescript-eslint/naming-convention": [
     "warn",
     {
       "selector": "memberLike",
       "modifiers": ["private"],
       "format": ["camelCase"],
       "leadingUnderscore": "require"
     }
   ],
   "@typescript-eslint/explicit-member-accessibility": "warn",
  },
  parser: '@typescript-eslint/parser',
}
