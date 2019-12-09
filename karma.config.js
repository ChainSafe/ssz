module.exports = function (config) {
    config.set({
        frameworks: ['mocha', 'chai'],
        files: [
            {pattern: 'build/*.wasm', included: false, served: true, type: 'wasm'},
            'test/index.spec.js'
        ],
        proxies: {
            '/build/': '/base/build/'
        },
        mime: {
            'application/wasm': ['wasm']
        },
        preprocessors: {
            'test/index.spec.js': ['webpack']
        },
        webpack: {
            mode: "production",
            module: {
                rules: [
                    {
                        test: /\.js?$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                    },
                    {
                        test: /\.wasm$/,
                        type: 'javascript/auto',
                        loader: 'file-loader',
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