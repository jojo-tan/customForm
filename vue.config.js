const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')// 引入插件-打包static静态资源

const Moment = require('moment')//导入日期处理插件
const TT = (new Date()).getTime();// 时间戳


const processEnv = require("./processEnv");// 环境变量

module.exports = {
    publicPath: '',
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "@/assets/css/public/init.scss";`
            },
        }
    },
    // configureWebpack: {
    //     plugins: [
    //         new CopyWebpackPlugin({
    //             // 动态添加版本号-年-月-日
    //             patterns: [{
    //                 from: "./public/static",
    //                 to: `static@${Moment(TT).format('YY-MM-DD')}`
    //             }]
    //         })
    //     ]
    // },
    // chainWebpack: config => {
    //     config.plugin('define').tap(args => {
    //         let org = args[0]['process.env'];
    //         // 添加全局变量时间戳
    //         org.TT = TT;
    //         // 添加全局变量路径
    //         org.HREF = process.env.NODE_ENV=='development' ? JSON.stringify("production") : 321;
    //         // JSON.stringify(processEnv)
    //         org.processEnv = JSON.stringify(processEnv)
    //         return args
    //     })
    // },
}