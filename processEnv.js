const Moment = require('moment')//导入日期处理插件
const timeVersion = Moment().format('YY.MM.DD');//计算时间版本

const NODE_ENV = process.env.NODE_ENV;

const config = {
    development: {
        apiConfig: "development",
        timeVersion: JSON.stringify(timeVersion)
    },
    production: {
        apiConfig: "production",
        timeVersion: JSON.stringify(timeVersion)
    },
    staging: {
        apiConfig: "staging",
        timeVersion: JSON.stringify(timeVersion)
    }
};

module.exports = config[NODE_ENV];