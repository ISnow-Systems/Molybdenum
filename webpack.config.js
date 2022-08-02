const CopyPlugin = require("copy-webpack-plugin");

module.export = {
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "pages", to: "pages" },
                { from: "errorpages", to: "errorpages" },
                { from: "extensions", to: "extensions" },
            ],
        }),
    ]    
}