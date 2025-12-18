import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      "scripts/**",
      "supabase/**",
      ".next/**",
      "node_modules/**",
      "public/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default config;
