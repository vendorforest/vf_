// This is a custom Jest transformer turning style imports into empty objects.
// http://facebook.github.io/jest/docs/en/webpack.html

module.exports = {
  process() {
    return "module.export const = {};";
  },
  getCacheKey() {
    // The output is always the same.
    return "cssTransform";
  },
};
