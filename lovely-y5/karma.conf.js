module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      './specs/**/*.spec.tsx',
      './specs/**/*.spec.ts',
      './specs/**/*.spec.js',
    ],
    exclude: [],
    preprocessors: {
      './specs/**/*.spec.tsx': ['webpack'],
      './specs/**/*.spec.ts': ['webpack'],
      './specs/**/*.spec.js': ['webpack'],
    },
    webpack: {
      mode: 'development',
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
      module: {
        rules: [
          {
            test: /\.(ts|tsx|js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
              },
            },
          },
        ],
      },
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity
  });
};
