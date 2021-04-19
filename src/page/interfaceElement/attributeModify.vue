<template>
    <div class="attribute_modify">
        <!-- 元素标识 -->
        <div class="modify_item modify_item_1" v-if="modifyItem.isAttribute.elementName">
            <div class="from_title">元素标识：</div>
            <div class="from_item">
                <el-input v-model="elementName" placeholder="元素标识" maxlength="32" show-word-limit></el-input>
            </div>
            <div class="from_tips" v-show="repeatElementName">
                <el-tooltip class="item" effect="dark" content="元素标识已重复，请检查" placement="top-start">
                    <i class="el-icon-warning"></i>
                </el-tooltip>
            </div>
        </div>
        <!-- 元素名称 -->
        <div class="modify_item modify_item_1" v-if="modifyItem.isAttribute.elementLabel">
            <div class="from_title">元素名称：</div>
            <div class="from_item">
                <el-input v-model="elementLabel" placeholder="元素名称" maxlength="7" show-word-limit></el-input>
            </div>
        </div>
        <!-- 输入提示 -->     
        <div class="modify_item modify_item_1" v-if="modifyItem.isAttribute.inputTip">
            <div class="from_title">输入提示：</div>
            <div class="from_item">
                <el-input v-model="inputTip" placeholder="请输入提示~" maxlength="32" show-word-limit></el-input>
            </div>
        </div>
        <!-- 默认值 -->       
        <div class="modify_item modify_item_1" v-if="modifyItem.isAttribute.default">
            <div class="from_title">默认值：</div>
            <div class="from_item">
                <el-input v-model="defaultValue" :placeholder="defaultFormat" maxlength="32" show-word-limit></el-input>
            </div>
        </div>
        <!-- 输入格式 -->       
        <div class="modify_item modify_item_1" v-if="modifyItem.isAttribute.format">
            <div class="from_title">默认格式：</div>
            <div class="from_item">
                <el-radio-group v-model="format.value">
                    <el-radio
                    v-for="(item, index) in format.options"
                    :key="index"
                    :label="item.optionValue">
                    {{item.optionLabel}}</el-radio>
                </el-radio-group>
                <!-- <el-input v-model="format" maxlength="32" show-word-limit :disabled="true"></el-input> -->
            </div>
        </div>
        <!-- 是否必选 -->
        <div class="modify_item modify_item_1" v-if="modifyItem.isAttribute.require">
            <div class="from_title">是否必选：</div>
            <div class="from_item">
                <el-switch
                v-model="requireValue"
                active-color="#409EFF"
                inactive-color="#dcdfe6">
                </el-switch>
            </div>    
        </div>
        <!-- 选项 -->
        <div class="modify_item modify_item_2" v-if="modifyItem.isAttribute.options">
            <div class="title">
                <div class="title_item"><span>选项</span></div>
            </div>
            <div class="option">
                <div 
                v-for="(item, index) in options"
                :key="index"
                class="option_item"
                >
                    <div class="select_line_icon"><i class="el-icon-s-operation"></i></div>
                    <el-input v-model="item.optionLabel" placeholder="选项名" maxlength="8" show-word-limit size="small"></el-input>
                    <el-input v-model="item.optionValue" placeholder="选项值" maxlength="10" show-word-limit size="small"></el-input>
                    <div class="close_btn" @click="removeOption(index)"><i class="el-icon-remove-outline"></i></div>                    
                    <div class="from_tips" v-show="repeatOptionsValue[index]">
                        <el-tooltip class="item" effect="dark" content="选项值已重复，请检查" placement="top-start">
                            <i class="el-icon-warning"></i>
                        </el-tooltip>
                    </div>
                </div>
                <div class="option_add">                   
                    <el-button type="text" size="medium" @click="addOption">
                        <i class="el-icon-circle-plus-outline"></i>
                        <span>新增选项</span>
                    </el-button>
                </div>
            </div>
        </div>
        <!-- 正则表达式 -->
        <div class="modify_item modify_item_3" v-if="modifyItem.isAttribute.validateConditon">            
            <div class="title">
                <div class="title_item">校验方式（正则校验）</div>
            </div>
            <div class="regular">
                 <el-input type="textarea" placeholder="请仔细填写校验正则~"  rows="5" maxlength="256" show-word-limit v-model="validateConditon"></el-input>
            </div>
        </div>
    </div>
</template>

<script>
import {isExistence} from "./js/method.js";// 检测信息是否存在数组中
export default {
    name: 'attribute_modify',
    props: {
        modifyItem: {type: Object},
        elementNameList: {type: Array}
    },
    components: {},
    data() {
        return {
            // 元素标识
            elementName: '',
            // 元素标识-是否重复
            repeatElementName: false,
            // 元素名称
            elementLabel: '',
            // 输入提示信息
            inputTip: '',
            // 默认值
            defaultValue: '',
            // 默认值格式
            defaultFormat: '',
            // 输入格式
            format: null,
            // 是否必选
            requireValue: true,
            // 选项
            options: [],
            // 选项-是否重复
            repeatOptionsValue: [],
            // 正则表达式
            validateConditon: '',
        };
    },
    computed: {
    },
    watch: {
        // 切换时刷新
        modifyItem() {
            // console.log('刷新modifyItem~');
            this.refreshData();
        },       
        // 元素标识监听改变回传
        elementName() {
            // 回传修改属性
            this.modifyCallback('elementName', this.elementName);
            // 检验元素标识是否重复
            this.inspectElementName();
        },
        // 元素名称监听改变回传
        elementLabel() {
            this.modifyCallback('elementLabel', this.elementLabel);
        },
        // 输入提示信息监听改变回传
        inputTip() {
            this.modifyCallback('inputTip', this.inputTip);
        },
        // 默认值监听改变回传
        defaultValue() {
            this.modifyCallback('default', this.defaultValue);
        },
        // 是否必选监听改变回传
        requireValue() {
            this.modifyCallback('require', this.requireValue);
        },
        // 选项监听改变回传
        options: {
            handler(val, oldVal){
                // 回传修改属性
                this.modifyCallback('options', this.options);
                // 检验选项值是否重复
                this.inspectOptionsValue();
            },
            deep:true
        },
        // 格式监听回传
        'format.value': {
            handler(val, oldVal){
                // 回传修改属性
                this.modifyCallback('format', this.format);
            },
            deep:true
        },
        // 选项值列表变化检测是否重复
        optionsValueList() {
            // 检验选项值是否重复
            this.inspectOptionsValue();
        },
        // 正则表达式监听改变回传
        validateConditon() {
            // console.log('正则表达式监听改变回传');
            this.modifyCallback('validateConditon', this.validateConditon);
        },
    },
    created() {
        this.refreshData();
    },
    mounted() {},
    methods: {
        // 刷新信息
        refreshData() {
            // 赋值
            this.elementName = this.modifyItem.elementName;
            this.elementLabel = this.modifyItem.elementLabel;
            this.defaultValue = this.modifyItem.default;
            this.defaultFormat = this.modifyItem.defaultFormat;
            this.format = this.modifyItem.format;
            this.inputTip = this.modifyItem.inputTip;
            this.requireValue = this.modifyItem.require;
            this.options = this.modifyItem.options;
            this.validateConditon = this.modifyItem.validateConditon;
            // 检验元素标识是否重复
            this.inspectElementName();
            // 检验选项值是否重复
            this.inspectOptionsValue();

        },
        // 修改赋值
        modifyCallback(name, org) {
            this.$emit('modify-callback', name, org);
        },
        // 检验元素标识是否重复
        inspectElementName() {
            this.$nextTick(() => {
                this.repeatElementName = isExistence(this.elementName, this.elementNameList).isExistence;
                // console.log(this.repeatElementName, 'this.repeatElementName');
            });           
        },
        // 检验选项值是否重复
        inspectOptionsValue() {
            // 无需选项值操作
            if(!this.modifyItem.isAttribute.options) return;
            this.$nextTick(() => {
                // 获取数据                
                let org_s = [];
                let len_s = this.options.length;
                for(let i=0;i<len_s;i++) {
                    org_s.push(
                        this.options[i].optionValue?
                        this.options[i].optionValue:
                        ""
                    );
                };
                // 数组排重
                let arry = [];
                let org = JSON.parse(JSON.stringify(org_s));
                let len = org.length;
                for(let i=0;i<len;i++) {
                    arry.push(isExistence(org[i], org_s).isExistence);
                };
                this.repeatOptionsValue = arry;
                // console.log(arry, '检验选项值是否重复');
            });
        },
        // 新增选项
        addOption() {
            // 设置新增临界值
            if(this.options.length >= 5) {
                this.$alert(`选项配置数上限为5个`, "提示", {
                    confirmButtonText: "确定",
                    type: "warning",
                });
                return;
            };
            // 小于临界值继续添加
            this.options.push({
                optionLabel: '',// 选项标签
                optionValue: '',// 选项值
            });
        },
        // 删除选项
        removeOption(index) {
            this.options.splice(index, 1);
        }
    }
}
</script>

<style lang="scss" scoped>
.attribute_modify{
    .modify_item{
        position: relative;        
        .from_tips{
            position: absolute;
            left: 92px;
            top: -10px;
            i{
                cursor: pointer;
                color: #F56C6C;
            }
        }
    }
    .modify_item_1{
        display: flex;
        margin: 0 0 15px 0;
        padding: 0 10px 0;
        .from_title{
            width: 90px;
            line-height: 40px;
            font-size: 14px;
            padding: 0 8px 0 0;
            color: #606222;
            text-align: right;
        }
        .from_item{
            flex: 1;
            text-align: left;
        }
        .el-radio,.el-checkbox,.el-switch{
            line-height: 40px;
            height: 40px;
        }
    }
    .modify_item_2{
        padding: 0 10px;
        .title{
            position: relative;
            background-color: #dcdfe6;
            height: 1px;
            margin: 24px 0;
            .title_item{
                position: absolute;
                background-color: #fff;
                padding: 0 20px;
                font-weight: 500;
                color: #303133;
                font-size: 14px;
                left: 50%;
                text-align: center;
                width: 70px;
                transform: translateX(-50%) translateY(-50%);
                -webkit-transform: translateX(-50%) translateY(-50%);
                span{
                    font-weight: bold;
                }
            }
        }

        .option_item{
            padding: 0 5px;
            display: flex;
            margin-bottom: 10px;
            position: relative;
            .select_line_icon, .close_btn{
                font-size: 22px;
            }
            .select_line_icon{
                margin-right: 8px;
                color: #707277;
                cursor: move;
            }
            .close_btn{
                color: #F56C6C;
                cursor: pointer;
            }
            /deep/ .el-input{
                margin-right: 8px;
            }
            .from_tips{
                position: absolute;
                left: 162px;
                top: -10px;
                i{
                    cursor: pointer;
                    color: #F56C6C;
                }
            }
        }
        .option_add{
            padding: 0 20px;
        }
    }
    .modify_item_3{        
        padding: 0 10px;
        .title{
            position: relative;
            background-color: #dcdfe6;
            height: 1px;
            margin: 24px 0;
            .title_item{
                position: absolute;
                background-color: #fff;
                padding: 0 10px;
                font-weight: 500;
                color: #303133;
                font-size: 14px;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
                -webkit-transform: translateX(-50%) translateY(-50%);
            }
        }
        .regular{
            padding: 0 5px;
            margin: 0 0 20px 0;
            /deep/ textarea{
                font-family: 'Microsoft YaHei';
            }
        }
    }
}    
</style>