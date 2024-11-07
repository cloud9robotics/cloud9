export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ _public: "/" });

  return {
    dir: {
      output: "dist",
    },
  };
}
