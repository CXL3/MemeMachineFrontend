module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./app'],
          alias: {
            '@contexts': './app/contexts'
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
        }
      ]
    ]
  };
  