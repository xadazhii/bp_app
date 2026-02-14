const CircularDependencyPlugin = require('circular-dependency-plugin');
const { addWebpackPlugin } = require('customize-cra');

module.exports = addWebpackPlugin(
    new CircularDependencyPlugin({
        exclude: /a\.js|node_modules/,
        include: /src/,
        failOnError: false,
        allowAsyncCycles: false,
        cwd: process.cwd(),
    })
);