import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';

// this configures ESLint using their new flat config system
// https://eslint.org/docs/latest/use/configure/configuration-files

export default defineConfig(

  // don't lint any transpiled javascript output or library code
  {
    ignores: [
      "**/dist/**",
      "**/lib/**",
      "**/.firebase/**",
      "**/storybook-static/**",
      "node_modules/**",
    ],
  },

  // add .storybook
  globalIgnores(['!.storybook'], 'Include Storybook Directory'),

  // register all of the plugins up front
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "stylistic": stylistic,
      "unused-imports": unusedImports,
    },

    // required for linting with type information
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // BASE CONFIG: Applies globally to all packages
  {
    // environment
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",

      globals: {
        ...globals.es2021,
      },
    },

    // base rulesets to apply
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      storybook.configs['flat/recommended'],
    ],

    // apply to all typescript and javascript files, except the ignores above
    files: ["**/*.{js,mjs,cjs,ts,cts,mts}"],

    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: "warn",
    },

    // custom rules to override the recommended defaults above
    rules: {

      // unused imports
      "unused-imports/no-unused-imports": "error",

      // flag use of declarations marked with @deprecated
      "@typescript-eslint/no-deprecated": "warn",

      // unused variables/arguments
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "local", // only allow global unused variables, complain about locals
          argsIgnorePattern: "^_", // allow unused agrs starting with _
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],

      // keep function overloads together
      "@typescript-eslint/adjacent-overload-signatures": "warn",

      // prefer T[] instead of Array<T> for array types
      "@typescript-eslint/array-type": ["warn", { "default": "array" }],

      // prefer Record instead of index signature
      "@typescript-eslint/consistent-indexed-object-style": ["warn", "record"],

      // complain about confusing non-null assertions such as a! == b
      "@typescript-eslint/no-confusing-non-null-assertion": "warn",

      // complain about empty functions
      "@typescript-eslint/no-empty-function": "warn",

      // complain about empty interfaces
      "@typescript-eslint/no-empty-interface": "warn",

      // prefer for-of instead of using an index variable
      "@typescript-eslint/prefer-for-of": "warn",

      // prefer function types over interfaces with call signatures
      "@typescript-eslint/prefer-function-type": "warn",

      // prefer the use of ?? over ||
      "@typescript-eslint/prefer-nullish-coalescing": "warn",

      // prefer use of ?. over &&
      "@typescript-eslint/prefer-optional-chain": "warn",

      // prefer use of .startsWith() and .endsWith() for strings
      "@typescript-eslint/prefer-string-starts-ends-with": "warn",

      // complain about using a computed key with a constant
      "no-useless-computed-key": "warn",

      // warn about importing a type without annotating it as a type only import
      "@typescript-eslint/consistent-type-imports": ["warn", {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      }],

      // flag import { type A, type B } when all imports are types
      "@typescript-eslint/no-import-type-side-effects": "warn",

      // ==================================================
      // Style/formatting rules
      // ==================================================

      // require () around arrow function parameters
      "stylistic/arrow-parens": ["error", "always"],

      // require dangling commas for multiline constructs
      "stylistic/comma-dangle": ["warn", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "only-multiline", // this looks weird in some cases
        "enums": "always-multiline",
        "generics": "always-multiline",
        "tuples": "always-multiline",
      }],

      // indent style: 2 spaces
      "stylistic/indent": ["warn", 2, { "SwitchCase": 0 }],
      "stylistic/indent-binary-ops": ["warn", 2],

      // unix line endings
      "stylistic/linebreak-style": ["error", "unix"],

      // require semicolons
      "stylistic/semi": ["error", "always"],
    },
  },

  // override any legacy style/formatting rules included above
  stylistic.configs["disable-legacy"],

  // disable type-aware rules for javascript files which have no types
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  // FRONTEND: This is a browser environment
  {
    files: ['apps/frontend/**/*.{ts,mts,cts,js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // BACKEND & SHARED: This is a node environment
  {
    files: [
      'apps/backend/**/*.{ts,mts,cts,js,mjs,cjs}',
      'shared/**/*.{ts,mts,cts,js,mjs,cjs}',
      'mocks/**/*.{ts,mts,cts,js,mjs,cjs}',
      'scripts/**/*.{ts,mts,cts,js,mjs,cjs}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // config files should be treated as node scripts
  {
    files: [
      '**/*.config.{js,ts,mjs,cjs}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
);
