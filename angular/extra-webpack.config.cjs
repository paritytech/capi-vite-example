module.exports = {
  experiments: {
    topLevelAwait: true,
  },
  externals: {
    "node:net": {},
    "node:stream": {},
    "node:fs": {},
    bufferutil: {},
    "utf-8-validate": {},
  },
};
