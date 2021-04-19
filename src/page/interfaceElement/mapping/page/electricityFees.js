export default {
    icon: 'icon-dianfeimingan',// 图标
    tpName: '电费模板',// 模板名称
    pages: [// 模板页面集   
        {   
            uiName: '电费缴费',// 页面名称               
            elements: [// 元素集        
                {
                    elementType: "102",// 元素类型
                    elementName: "userNumber",// 元素标识
                    elementLabel: "用户号",// 元素名称
                    inputTip: '请输入8-16位用户号', // 输入提示信息
                    default: '',
                    fixed: 0,// 固定值
                    format: '无',// 输入格式
                    options: [// 选项集
                        {
                            optionLabel: '备选一',
                            optionValue: '1',
                        },
                        {
                            optionLabel: '备选二',
                            optionValue: '2',
                        }
                    ],
                    require: true,// 是否必选
                    validateConditon: `/^([a-zA-Z0-9]{8,16})$/`,// 验证条件-正则表达式
                }
            ]
        }
    ],
}