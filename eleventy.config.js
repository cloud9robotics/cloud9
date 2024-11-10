import postcss from "postcss";
import postcsso from "postcss-csso";
import { build as esbuild } from "esbuild";
import { minify as minifyHtml } from "html-minifier";
import { minify as minifyTs } from "terser";
import * as sass from "sass";
import path from "path";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ _public: "/" });
  eleventyConfig.addFilter("dropContentFolder", (path, folder) =>
    path.replace(new RegExp(folder + "/"), "")
  );

  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: async function (inputContent, inputPath) {
      if (inputPath.split("/").at(-1).startsWith("_")) return;

      let { css, loadedUrls } = sass.compileString(inputContent, {
        loadPaths: [path.parse(inputPath).dir || "."],
        sourceMap: false,
      });

      this.addDependencies(inputPath, loadedUrls);

      return async () => {
        const { content } = await postcss([
          postcsso({
            restructure: true,
          }),
        ]).process(css, {
          from: undefined,
        });

        return content;
      };
    },
    compileOptions: {
      permalink: function (contents, inputPath) {
        return inputPath.replace("styles/", "").replace(".scss", ".css");
      },
    },
  });

  eleventyConfig.addTransform("html", function (content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      return minifyHtml(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });

  eleventyConfig.addCollection("posts", function (collection) {
    console.log(collection.getFilteredByGlob("pages/blog/*.md"));
    return collection.getFilteredByGlob("pages/blog/*.md");
  });

  return {
    dir: {
      output: "dist",
    },
  };
}
