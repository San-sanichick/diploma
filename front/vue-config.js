module.exports = {
    devServer: {
        proxy: 'http://localhost:8080'
    },
    configureWebpack: {
        devtool: 'source-map',
    },
}