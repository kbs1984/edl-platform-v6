// Session 180: Architectural safeguards to prevent React hooks in Server Components
module.exports = {
  extends: ['next/core-web-vitals'],
  overrides: [
    {
      // Apply to all TypeScript files except those explicitly marked as client
      files: ['src/**/*.tsx', 'src/**/*.ts'],
      excludedFiles: ['src/**/*.client.tsx', 'src/**/*.client.ts'],
      rules: {
        'no-restricted-imports': ['error', {
          paths: [
            {
              name: 'react',
              importNames: ['useState', 'useEffect', 'useContext', 'useReducer', 'useRef', 'useCallback', 'useMemo'],
              message: 'React hooks are not allowed in Server Components. Either:\n1. Add "use client" directive at the top of the file\n2. Use Server Component patterns with V5 bridge\n3. Rename file to .client.tsx'
            }
          ],
          patterns: [
            {
              group: ['*/use-*', '*/hooks/*'],
              message: 'Custom hooks are not allowed in Server Components. Use Server Component patterns instead.'
            }
          ]
        }],
        'no-console': ['warn', { allow: ['warn', 'error'] }],
      }
    },
    {
      // Client components can use hooks
      files: ['src/**/*.client.tsx', 'src/**/*.client.ts'],
      rules: {
        'no-restricted-imports': 'off'
      }
    }
  ],
  rules: {
    // Global rules for all files
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
  }
}