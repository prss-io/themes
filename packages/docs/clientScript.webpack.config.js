const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/_common/lib/clientScript.ts",
  // Maps make local builds debuggable, but they embed the original source, so
  // the publish build (scripts/build-all.js) turns them off.
  devtool: process.env.PRSS_NO_SOURCE_MAPS ? false : "source-map",
  output: {
    filename: "client.js",
    path: path.resolve(__dirname, "build"),
    iife: true
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.m?js(x?)|ts(x?)$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: "babel-loader" }
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: { "@": path.resolve(__dirname, "src/_common") }
  },
  performance: { hints: false },
  externals: {
    prss: "PRSS",
    react: "React",
    "react-dom": "ReactDOM"
  }
};
