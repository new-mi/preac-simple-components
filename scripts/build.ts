import { build as viteBuild } from "vite";
import preact from "@preact/preset-vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

const entries = {
  cookie: "./src/components/Cookie/index.ts",
};

const build = () => {
  for (const [name, entry] of Object.entries(entries)) {
    viteBuild({
      root: ".",
      plugins: [
        preact(),
        tsconfigPaths(),
        svgr(),
        cssInjectedByJsPlugin({ styleId: `${name}-style` }),
      ],
      build: {
        lib: {
          entry,
          name: "simple-components",
          formats: ["iife"],
          fileName: (format) => `${name}/${name}.${format}.js`,
          cssFileName: `${name}/${name}`,
        },
        rollupOptions: {
          output: {
            extend: true,
          },
        },
      },
    });
  }
};

build();
