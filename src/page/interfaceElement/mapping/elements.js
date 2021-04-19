// 通用属性
const org = {
    id:'',// 控件id后台使用
    options: [// 选项集
        {
            optionLabel: '备选一',// 选项标签
            optionValue: '1',// 选项值
        },
        {
            optionLabel: '备选二',
            optionValue: '2',
        }
    ],
    inputTip: '',// 输入提示信息
    require: 0,// 是否必填，1：必填；0：选填
    validateConditon: '',// 验证条件-正则表达式
    require: true,// 是否必选
    fixed: 0,// 固定值
};
// 属性修改-开关   
const isAttribute = {
    elementName: true,// 元素标识
    elementLabel: true,// 元素名称
    inputTip: false,// 输入提示
    default: false,// 默认值
    format: false,// 输入格式
    options: false,// 选项
    validateConditon: false,// 正则表达式
    require: false,// 是否必选
};
// 属性开关处理
function setIsAttribute(org) {
    let obj = JSON.parse(JSON.stringify(isAttribute));
    for(var i=0;i<org.length;i++) {
        obj[org[i]] = true;
    };
    return obj;
};
// 纯文本
const pureText = {
    type: 'pureText',
    icon: 'icon-text7wenben',
    elementType: '101',
    elementName: 'pureText',
    elementLabel: '纯文本',
    format: null,
    default: '',
    defaultFormat: '请输入默认值~',// 默认值格式
    defaultFillIn: '',// 输入值
    ...org,
    isAttribute: setIsAttribute(['default'])
};
// 输入框
const textBox = {
    type: 'textBox',
    icon: 'icon-21shuru',
    elementType: '102',
    elementName: 'textBox',
    elementLabel: '输入框',
    format: null,
    ...org,
    default: '',
    defaultFormat: '请输入默认值~',
    defaultFillIn: '',
    isAttribute: setIsAttribute(['inputTip', 'default', 'require', 'validateConditon'])
};
// 单选按钮组
const radioSingle = {
    type: 'radioSingle',
    icon: 'icon-danxuan1',
    elementType: '103',
    elementName: 'radioSingle',
    elementLabel: '单选按钮组',
    format: null,
    ...org,
    default: '1',
    defaultFormat: '输入单个选项值',
    defaultFillIn: '1',
    isAttribute: setIsAttribute(['inputTip', 'default', 'require', 'options'])
};
// 复选按钮组
const checkBox = {
    type: 'checkBox',
    icon: 'icon-duoxuanxuanzhong2',
    elementType: '104',
    elementName: 'checkBox',
    elementLabel: '复选按钮组',
    format: null,
    ...org,
    default: '1',
    defaultFormat: '输入选项值，多个用","隔开~',
    defaultFillIn: '1',
    isAttribute: setIsAttribute(['inputTip', 'default', 'require', 'options'])
};
// 下拉列表
const selectSingle = {
    type: 'selectSingle',
    icon: 'icon-xialaliebiaokuang',
    elementType: '105',
    elementName: 'selectSingle',
    elementLabel: '下拉列表',
    format: null,
    ...org,
    default: '1',
    defaultFormat: '',
    defaultFillIn: '1',
    isAttribute: setIsAttribute(['inputTip', 'default', 'require', 'options'])
};
// 日期选择
const datePicker = {
    type: 'datePicker',
    icon: 'icon-riqi1',
    elementType: '106',
    elementName: 'datePicker',
    elementLabel: '日期选择',
    format: {
        value: '1',// 默认值
        options: [
            {
                type: 'month',// 选择器-月
                optionLabel: 'yyyy-MM',// 选项标签
                optionValue: '1',// 选项值
            },
            {
                type: 'date',// 选择器-日
                optionLabel: 'yyyy-MM-dd',
                optionValue: '2',
            }
        ],
    },
    ...org,
    default: '',
    defaultFormat: '',
    defaultFillIn: '',
    isAttribute: setIsAttribute(['inputTip', 'require', 'format'])
};
// 扫一扫
const scanCode = {
    type: 'scanCode',
    icon: 'icon-saoyisao1',
    elementType: '107',
    elementName: 'scanCode',
    elementLabel: '扫一扫',
    format: null,
    ...org,
    default: '',
    defaultFormat: '请输入默认值~',
    defaultFillIn: '',
    isAttribute: setIsAttribute(['inputTip', 'default', 'require', 'validateConditon'])
};
// 保存界面元素提交格式
export const formOrg = {
    uiFlag: '',// 界面标识
    uiName: '',// 界面名称
    elements: [// 元素集
        {
            elementName: '',// 元素名称
            elementType: '',// 元素类型
            elementLabel: '',// 元素标识
            format: '',// 输入格式
            options: [// 选项集
                {
                    optionLabel: '',// 选项标签
                    optionValue: '',// 选项值
                }
            ],
            inputTip: '',// 输入提示信息
            require: 0,// 是否必填，1：必填；0：选填
            validateConditon: '',// 验证条件-正则表达式
            default: '',// 默认值
            fixed: 0,// 固定值
        }
    ],
};
// 导出界面元素Type映射关系
export const elementMapping = {
    '101': 'pureText',
    '102': 'textBox',
    '103': 'radioSingle',
    '104': 'checkBox',
    '105': 'selectSingle',
    '106': 'datePicker',
    '107': 'scanCode'
}
// 导出控件信息
export default {
    pureText,
    textBox,
    radioSingle,
    checkBox,
    selectSingle,
    datePicker,
    scanCode
}