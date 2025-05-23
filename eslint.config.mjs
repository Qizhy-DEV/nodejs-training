import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
    {
        ignores: ['dist/'],
    },
    {
        files: ['jest.config.js', '**/*.cjs'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: globals.node,
        },
    },
    { files: ['**/*.{js,mjs,cjs,ts}', 'test/**/*.{js,ts,jsx,tsx}'] },
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['tests/**/*.{js,ts,jsx,tsx}'],
        ...jest.configs['flat/recommended'],
        rules: {
            ...jest.configs['flat/recommended'].rules,
            'jest/prefer-expect-assertions': 'off',
        },
    },
    eslintPluginPrettierRecommended,
];
