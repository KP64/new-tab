import catppuccin from "@catppuccin/tailwindcss";

import Config from 'tailwindcss';
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {}
  },
  plugins: [
    catppuccin({
      prefix: false,
      defaultFlavour: "mocha"
    })
  ]
} satisfies Config;
