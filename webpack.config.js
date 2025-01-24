const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development', // or 'production'
  entry: './src/main.js', // Your main entry file
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },
  plugins: [
    new Dotenv(), // Load variables from .env
    new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
  ],
};
