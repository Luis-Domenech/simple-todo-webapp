const path = require('path')
const micromatch = require('micromatch')
const prettier = require('prettier')

// Figure out all extensions supported by Prettier.
const prettierSupportedExtensions = prettier
  .getSupportInfo()
  .languages.map(({ extensions }) => extensions)
  .flat()

// const buildEslintCommand = (staged_files) =>
//   `next lint --fix --file ${filenames
//     .map((f) => path.relative(process.cwd(), f))
//     .join(' --file ')}`

const next_lint_command = (staged_files) =>
  `next lint --fix --file ${staged_files.join(' --file ')}`

const eslint_command = (staged_files) =>
  `eslint --fix ${staged_files.join(' ')}`

const prettier_command = (staged_files) =>
  `prettier --write ${staged_files.join(' ')}`

// const addQuotes = (a) => `"${a}"`

module.exports = (staged_files) => {
  // Match files for ESLint including dirs and files starting with dot.
  const eslint_files = micromatch(staged_files, ['**/*.{js,jsx,ts,tsx'], {
    dot: true,
  }).filter(file => !file.includes('generated'))

  // Match files for Prettier including dirs and files starting with dot.
  const prettier_files = micromatch(
    staged_files,
    prettierSupportedExtensions.map((extension) => `**/*${extension}`),
    { dot: true }
  ).filter(file => !file.includes('generated'))

  // Array of linters to be run in this sequence.
  const linters = []

  // Add linters only when there are staged files for them.
  // 'prettier --write' causes lint-staged to never terminate when prettierFiles is empty.

  if (eslint_files.length > 0) linters.push(next_lint_command(eslint_files))
  // if (prettier_files.length > 0) linters.push(prettier_command(prettier_files))

  return linters
}
