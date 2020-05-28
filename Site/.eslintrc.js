module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "prettier",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended",
        "plugin:react/recommended",
    ],
    plugins: ["react", "prettier"],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/ban-ts-ignore":"off",
        "react/prop-types": "off",
        "react/no-unescaped-entities": "off",
        "react/display-name": "off",
        "prettier/prettier": "error",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
