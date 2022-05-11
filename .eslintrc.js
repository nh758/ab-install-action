module.exports = {
   env: {
      commonjs: true,
      es6: true,
      jest: true,
      node: true,
   },
   parserOptions: {
      ecmaVersion: 2018,
   },
   extends: ["eslint:recommended", "prettier"],
   globals: {
      Atomics: "readonly",
      SharedArrayBuffer: "readonly",
   },
   plugins: ["prettier"],
   rules: {
      "prettier/prettier": [
         "error",
         {
            arrowParens: "always",
            endOfLine: "lf",
            printWidth: 80,
            tabWidth: 3,
         },
      ],
      "no-console": 0,
   },
};
