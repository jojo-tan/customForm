<template>
    <div class="pure_text item_box">
        <div class="from_title">{{elementItem.elementLabel}}：</div>
        <div class="from_item">{{value?value:'纯文本信息'}}</div>
    </div>
</template>

<script>
export default {
    props: {
        elementItem: {type: Object},
        elementIndex: {},
    },
    data() {
        return {
            value: "",
        };
    },
    computed: {
        // 修改默认值时动态赋值
        valueCopy() {
            return this.elementItem.default;
        },
    },
    watch: {
        // 移除校验结果监听和输入值保存-输入框值改变时
        valueCopy() {
            this.value = this.valueCopy;
            this.setFormValue();
        },
    },
    created() {
        // 初始化控件
        this.elementInit();
    },
    mounted() {
    },
    methods: {
        // 提交
        submitForm() {},       
        // 重置
        resetFields() {   
            this.this = this.elementItem.default;     
        },
        // 移除校验结果
        clearValidate() {
        },
        // 修改表单输入值
        setFormValue() {
            this.$parent.$parent.$parent.setFormValue(this.elementIndex, this.value);
        },
        // 拖拽时更新输入值
        toUpdate(value) {
            this.value = value.default;
        },
        // 初始化控件
        elementInit() {
            this.value = this.elementItem.default;
            this.setFormValue();
        }
    }
};
</script>

<style lang="scss" scoped>
.from_item {
    line-height: 40px;
    color: #909299;
    font-size: 14px;
}
</style>