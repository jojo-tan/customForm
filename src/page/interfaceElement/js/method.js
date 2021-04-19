import Moment from 'moment'// 导入日期处理插件

// 获取时间戳版本信息
export function getTimeStamp() {
    return Moment().unix();
};

// 检测信息是否存在数组中
export function isExistence(item, arry) {
    // console.log(item, arry);
    if(!item) {
        return {isExistence: false}
    };
    var frequency = 1;
    for(var i=0;i<arry.length;i++){
        if(!arry[i]) continue;
        if(item == arry[i]) {
            frequency++;
        };
    };
    if(frequency > 2) {
        return {isExistence: true};
    }else {
        return {isExistence: false};
    };
};