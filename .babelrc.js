module.exports = api => {
  api.cache(true);

  const presets = [
    ['@babel/preset-env'],
    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
  ];

  const plugins = [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ];

  if (process.env.NODE_ENV === 'test') {
    plugins.push(`@babel/plugin-transform-runtime`);
  }

  return {
    presets,
    plugins,
  };
};
