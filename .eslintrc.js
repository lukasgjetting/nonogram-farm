module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  ignorePatterns: ["/**/*.generated.ts"],
  rules: {
    "prettier/prettier": "error",
  },
};
