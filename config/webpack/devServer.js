const path = require('path');


let services = {}
services['peaimage'] = ('http://www.peaimage.com')
services['148'] = ('http://192.168.0.148:9999')
services['143'] = ('http://192.168.0.143:10004')

let service = services['148']

module.exports = {
    contentBase: 'src/www',
    devtool: 'eval',
    hot: true,
    inline: true,
    host: '0.0.0.0',
    port: 3000,
    disableHostCheck: true,
    proxy: {
        '/service/*': {
            // target: 'https://beta.peami.com',
            // target: 'http://192.168.0.241:8080/',
            // target: 'http://192.168.0.143:8080',
            target: 'https://192.168.0.171',
            // target: 'http://192.168.0.241:8080',
            // target: 'https://117.34.72.134:13891',
            // pathRewrite: {
            //     '^/service': ''
            // },
            secure: false,
            changeOrigin: true
        },
        '/image-service/*': {
            // target: 'http://192.168.0.143:9120',
            // target: 'http://192.168.0.114:9120',
            target: 'https://192.168.0.171',
            // pathRewrite: {
            //     '^/image-service': '/'
            // },
            secure: false,
            changeOrigin: true
        },
        '/dicom-service/*': {
            // target: 'http://192.168.0.143:9110',
            // target: 'http://192.168.0.114:9110',
            target: 'https://192.168.0.171',
            // pathRewrite: {
            //     '^/dicom-service': '/'
            // },
            secure: false,
            changeOrigin: true
        },
        '/dicom-upload/*': {
            // target: 'http://192.168.0.143:8082',
            // target: 'http://192.168.0.114:8082',
            target: 'https://192.168.0.171',
            // pathRewrite: {
            //     '^/dicom-upload': '/'
            // },
            secure: false,
            changeOrigin: true
        },
        '/upload/*': {
            // target: 'http://192.168.0.138:8080/',
            // target: 'http://localhost:10001/',
            // target: 'http://192.168.0.143:8082/',
            // target: 'https://117.34.72.134:13891',
            // target: 'http://192.168.0.114:8082/',
            target: 'https://192.168.0.171',
            // pathRewrite: {
            //     '^/upload': ''
            // },
            secure: false,
            changeOrigin: true

        },
        '/document-service/*': {
            // target: 'http://192.168.0.138:8080/',
            // target: 'http://localhost:10001/',
            // target: 'http://192.168.0.143:8093/',
            target: 'https://192.168.0.171',
            pathRewrite: {
                '^/document-service': ''
            },
            secure: false,
            changeOrigin: true

        },
        '/medical/': {
            // target: 'http://192.168.0.143:8089',
            target: 'https://192.168.0.171',
            secure: false,
            changeOrigin: true
        },
        '/cateyes/*': {
            // target: 'http://www.peaimage.com',
            // target: 'http://192.168.0.148:9999/',
            target: 'https://192.168.0.171',
            secure: false,
            changeOrigin: true
        },
        '/ws/*': {
            // target: 'http://192.168.0.148:9999/',
            // target: 'http://192.168.0.148:8080/',
            // target: 'http://192.168.0.148:10004/',
            target: 'http://192.168.0.241:8080',
            ws: true,
            secure: false,
            changeOrigin: true

        },
        '/sw-service/*': {
            // target: 'https://beta.peami.com',
            // target: 'http://192.168.0.241:8086',
            // target: 'http://192.168.0.143:8080',
            target: 'https://192.168.0.171',
            // target: 'http://192.168.0.241:8080',
            // pathRewrite: {
            //      '^/sw-service': '/'
            // },
            secure: false,
            changeOrigin: true
        }
    },
    outputPath: path.resolve(__dirname, './build'),
};