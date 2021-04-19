<template>
    <div 
    class="element_item"
    :class="{element_item_active:isOperationBotton}"
    @mousedown="mouseDown"
    @mouseenter="moveSeenter"
    @mouseleave="mouseLeave"
    >
        <!-- 修改删除按钮 -->
        <div 
        class="operation_botton" 
        v-show="isOperationBotton"
        @mousedown.stop
        >
            <!-- 修改 -->
            <!-- <i class="el-icon-edit" @click="elementModify()"></i> -->
            <!-- 删除 -->
            <i class="el-icon-delete" @click="elementDelete()"></i>
        </div>
        <!-- 纯文本 -->
        <pure-text
        v-if="elementItem.elementType === elementsOrg.pureText.elementType"
        :element-item="elementItem"
        :element-index="elementIndex"
        :el-active-index="elActiveIndex"
        :ref="elementItem.elementType"
        ></pure-text>
        <!-- 文本框 -->
        <text-box
        v-if="elementItem.elementType === elementsOrg.textBox.elementType"
        :element-item="elementItem"
        :element-index="elementIndex"
        :el-active-index="elActiveIndex"
        :ref="elementItem.elementType"
        ></text-box>
        <!-- 单选按钮组 -->
        <radio-single
        v-if="elementItem.elementType === elementsOrg.radioSingle.elementType"
        :element-item="elementItem"
        :element-index="elementIndex"
        :el-active-index="elActiveIndex"
        :ref="elementItem.elementType"
        ></radio-single>
        <!-- 复选按钮组 -->
        <check-box
        v-if="elementItem.elementType === elementsOrg.checkBox.elementType"
        :element-item="elementItem"
        :element-index="elementIndex"
        :el-active-index="elActiveIndex"
        :ref="elementItem.elementType"
        ></check-box>
        <!-- 下拉列表选项框 -->
        <select-single
        v-if="elementItem.elementType === elementsOrg.selectSingle.elementType"
        :element-item="elementItem"
        :element-index="elementIndex"
        :el-active-index="elActiveIndex"
        :ref="elementItem.elementType"
        ></select-single>
        <!-- 日期选择 -->
        <date-picker
        v-if="elementItem.elementType === elementsOrg.datePicker.elementType"
        :element-item="elementItem"
        :element-index="elementIndex"
        :el-active-index="elActiveIndex"
        :ref="elementItem.elementType"
        ></date-picker>
        <!-- 扫一扫 -->
        <scan-code
        v-if="elementItem.elementType === elementsOrg.scanCode.elementType"
        :element-item="elementItem"
        :element-index="elementIndex"
        :el-active-index="elActiveIndex"
        :ref="elementItem.elementType"
        ></scan-code>
    </div>
</template>

<script>
import pureText from "./elementItem/pureText.vue";// 纯文本
import textBox from "./elementItem/textBox.vue";// 文本框
import radioSingle from "./elementItem/radioSingle.vue";// 单选按钮组
import checkBox from "./elementItem/checkBox.vue";// 复选按钮组
import selectSingle from "./elementItem/selectSingle.vue";// 下拉列表选项框
import datePicker from "./elementItem/datePicker.vue";// 日期选择
import scanCode from "./elementItem/scanCode.vue";// 扫一扫
export default {
    props: {
        elementIndex: {type: Number},// 自身索引
        elActiveIndex: {},// 选中索引
        elMoveIndex: {},// 移入索引
        elementItem: {type: Object},// 控件元素
        elementsOrg: {type: Object},// 控件元素集
    },
    components: {
        pureText,
        textBox,
        radioSingle,
        checkBox,
        selectSingle,
        datePicker,
        scanCode
    },
    data() {
        return {};
    },
    computed: {
        // 是否显示功能按钮
        isOperationBotton() {
            if(this.elementIndex == this.elActiveIndex || this.elementIndex == this.elMoveIndex){
                return true;
            };
            return false;
        },
    },
    watch: {
    },
    created() {
    },
    mounted() {
    },
    methods: {
        // 修改
        elementModify() {   
            console.log(this.elementIndex);
        },
        // 删除
        elementDelete() {
            this.$emit('element-delete', this.elementIndex);
        },
        // 按下
        mouseDown() {
            this.$emit('mouse-down');
        },
        // 抬起
        mouseUp() {},
        // 移入
        moveSeenter() {          
            this.$emit('move-seenter');
        },
        // 离开
        mouseLeave() {
            this.$emit('move-leave');
        },
        // 更新输入值
        setsetFormValue(value) {
            // console.log(value.defaultFillIn, 'value');
            this.$refs[this.elementItem.elementType].toUpdate(value);
        },       
        // 表单校验
        formCheck() {           
            this.$refs[this.elementItem.elementType].submitForm();
        },
        // 清除校验
        formReset() {
            this.$refs[this.elementItem.elementType].resetFields();
        },
    }
};
</script>

<style lang="scss" scoped>
.element_item{
    cursor: move;
    position: relative;
    width: 90%;
    margin: 0 auto 15px;
    padding: 10px 15px;
    border-radius: 4px;
    &.element_item_active{
        background: #f6f7ff;
    }
    .operation_botton{
        position: absolute;
        top: -13px;
        right: 20px;
        z-index: 999;
        i{
            cursor: pointer;
            width: 24px;
            height: 24px;
            line-height: 24px;
            font-size: 16px;
            border-radius: 12px;
        }
        .el-icon-edit{
            margin-right: 10px;
            color: #409EFF;
            border: 1px solid #409EFF;
            &:hover{
                color: #ffffff;
                border: 1px solid #409EFF;
                background: #409EFF;
            }
        }
        .el-icon-delete{
            color: #F56C6C;
            border: 1px solid #F56C6C;
            &:hover{
                color: #ffffff;
                border: 1px solid #F56C6C;
                background: #F56C6C;
            }
        }
    }
    /deep/ .item_box{
        display: flex;
        .from_title{
            width: 120px;
            line-height: 40px;
            font-size: 14px;
            font-weight: bold;
            padding: 0 12px 0 0;
            color: #606222;
            text-align: right;
        }
        .from_item{
            flex: 1;
            text-align: left;
        }
        .el-radio,.el-checkbox{
            line-height: 40px;
        }
        .demo_ruleForm{
            width: 100%;
        }
        .el-form-item{
            margin-bottom: 0px;
        }
        .el-form-item__label{
            font-weight: bold;
        }
        .el-form-item__content{
            text-align: left    ;
        }
    }
}
</style>