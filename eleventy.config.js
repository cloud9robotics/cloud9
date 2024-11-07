export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ _public: "/" });
  eleventyConfig.addFilter("dropContentFolder", (path, folder) =>
    path.replace(new RegExp(folder + "/"), "")
  );

  return {
    dir: {
      output: "dist",
    },
  };
}
