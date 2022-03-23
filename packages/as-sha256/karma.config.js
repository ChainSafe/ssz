module.exports = function (config) {
    config.set({
        frameworks: ['mocha', 'chai'],
        files: [
            'test/unit/index.test.ts'
        ],
        preprocessors: {
            'test/unit/index.test.ts': ['webpack']
        },
        webpack: {
            mode: "production",
            module: {
                rules: [
                    {
                        test: /\.ts?$/,
                        exclude: /node_modules/,
                        loader: 'ts-loader',
                    },
                ]
            },
            resolve: {
                extensions: ['.ts', '.js']
            }
        },
        reporters: ['progress'],
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless', 'Firefox', 'FirefoxDeveloper', 'FirefoxNightly'],
        autoWatch: false,
        concurrency: Infinity,
        customLaunchers: {
            FirefoxHeadless: {
                base: 'Firefox',
                flags: ['-headless'],
            },
        },
        plugins: [
            require("karma-webpack"),
            require("karma-chrome-launcher"),
            require("karma-firefox-launcher"),
            require("karma-mocha"),
            require("karma-chai"),
        ]
    })
};