import js from "@eslint/js"
import parser from "@typescript-eslint/parser"
import plugin from "@typescript-eslint/eslint-plugin"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import next from "@next/eslint-plugin-next"
import globals from "globals"

export default [
    js.configs.recommended,
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        languageOptions: {
            parser: parser,
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                project: "./tsconfig.json",
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },
        plugins: {
            "@typescript-eslint": plugin,
            "react": react,
            "react-hooks": reactHooks,
            "@next/next": next,
        },
        rules: {
            "no-undef": "off",
            "no-explicit-any": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/explicit-member-accessibility": "error",
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    "selector": "function",
                    "format": ["camelCase", "PascalCase", "UPPER_CASE"],
                    "leadingUnderscore": "allow"
                },
                {
                    "selector": "variable",
                    "format": ["camelCase", "UPPER_CASE", "PascalCase"],
                    "leadingUnderscore": "allow"
                },
                {
                    "selector": "typeLike",
                    "format": ["PascalCase"]
                }
            ],
            "no-multiple-empty-lines": [
                "error",
                { "max": 1 }
            ],
            "indent": [
                "error",
                4,
                { "SwitchCase": 1 }
            ],
            "quotes": [
                "error",
                "double"
            ],
            "semi": [
                "error",
                "never"
            ],
            "comma-dangle": [
                "error",
                "always-multiline"
            ],

            // React/Next specific
            "react/jsx-uses-react": "off", // Next.js gère React 17+
            "react/react-in-jsx-scope": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "@next/next/no-html-link-for-pages": "off",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
]