import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '**/fixtures',
  ],
  gitignore: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
  },

  typescript: true,
  jsonc: false,
  yaml: false,
  rules: {
    'style/brace-style': 'off',
    'perfectionist/sort-imports': 'off',
  },
})
