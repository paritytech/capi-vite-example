module.exports = {
  experiments: {
    topLevelAwait: true,
  },
  externals: {
    "node:net": {},
    "node:stream": {},
    "node:fs/promises": {},
    bufferutil: {},
    "utf-8-validate": {},
  },
};
