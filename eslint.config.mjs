import globals from 'globals';
import pluginJs from '@eslint/js';
import daStyle from 'eslint-config-dicodingacademy';


export default [
  daStyle,
  { files: ['**/*.{js,jsx}'], languageOptions: { sourceType: 'module', globals: globals.browser, parserOptions: { ecmaFeatures: { jsx: true } } } },
  pluginJs.configs.recommended,
];