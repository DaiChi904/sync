import { throwOnlyInTry } from "./rules/throw-only-in-try.js";

const plugin = {
  meta: {
    name: "eslint-rules-plugin",
    version: "1.0.0",
  },
  rules: { "throw-only-in-try": throwOnlyInTry },
};

export default plugin;
