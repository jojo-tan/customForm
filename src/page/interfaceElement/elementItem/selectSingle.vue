<template>
    <div class="select_single item_box">
        <el-form 
        :model="ruleForm" 
        :rules="rules" 
        ref="ruleForm" 
        label-width="120px" 
        :validate-on-rule-change="false" 
        status-icon  
        class="demo_ruleForm">
            <el-form-item :label="elementItem.elementLabel+'：'" prop="value">                
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                        v-for="(item, index) in ruleForm.value"
                        :key="index"
                        :label="item.optionLabel"
                        :value="item.optionValue"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props: {
        elementItem: {type: Object},// 表单信息
        elementIndex: {}, // 自身索引
        elActiveIndex: {}, // 选中索引
    },
    data() {
        // 自定义校验规则
        var validatePass = (rule, value, callback) => {
            // console.log(this.value);
            if(!this.value) {
                callback(new Error(this.elementItem.inputTip?this.elementItem.inputTip:'请选择至少一个选项'));               
                return;
            };
            var bur = false;// 验证通过开关
            var len = value.length;
            for(var i=0;i<len;i++) {
                if(this.value == value[i].optionValue){
                    bur = true;
                    break;
                };
            };
            // 是否是按钮触发验证
            if(this.buttonBoolean){
                this.buttonBoolean = false;
                if (bur) {
                    callback();
                } else {
                    callback(new Error(this.elementItem.inputTip?this.elementItem.inputTip:'请选择至少一个选项'));
                };
            };
        };
        return {
            // 自定义按钮验证开关
            buttonBoolean: false,
            // 值
            value: "",
            // 表单数据
            ruleForm: {               
                value: '',
            },
            // 校验方式
            rules: {
                value: [
                    { validator: validatePass, trigger: 'bur' }
                ],
            }
        };
    },
    computed: {
        // 修改默认值时动态赋值
        setDefaultvalue() {
            return this.elementItem.default;
        },
        // 修改选项值时动态赋值
        valueClone() {
            return this.elementItem.options
        },
        // 监听输入提示修改
        valueInputTip() {
            return this.elementItem.inputTip;
        },
    },
    watch: {     
        // 修改默认值时动态赋值
        setDefaultvalue() {
           this.value = this.setDefaultvalue;
        },
        // 修改输入值时动态赋值
        value() {
            this.setFormValue();               
            if(this.elActiveIndex == this.elementIndex) {
                this.submitForm();
            }else{               
                this.clearValidate();
            };
        },
        // 修改选项值时动态赋值
        valueClone() {
            this.$set(this.ruleForm, 'value', this.valueClone);
        },
        // 选中索引修改时
        elActiveIndex() {
            // console.log('选中位置发生了变化~', this.elActiveIndex, 'selectSingle');           
            if(this.elActiveIndex == this.elementIndex) {
                // console.log('this.submitForm', 'selectSingle');
                this.submitForm();
            }else{               
                // console.log('this.submitForm', 'selectSingle');
                this.clearValidate();
            };
        },
        // 输入提示修改时
        valueInputTip() {
            if(this.elActiveIndex == this.elementIndex) {
                this.submitForm();
            };
        },
    },
    created() {
        // 初始化控件
        this.elementInit();
    },
    mounted() {
        // this.submitForm();
    },
    methods: {
        // 提交
        submitForm() {
            // 打开按钮验证开关
            this.buttonBoolean = true;
            // 验证表单
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    console.log('提交成功!');
                } else {
                    console.log('提交错误!!');
                    return false;
                }
            });
        },
        // 重置
        resetFields() {
            this.value = this.elementItem.default;
            this.$set(this.ruleForm, 'value', this.elementItem.options);
            this.clearValidate();
        },
        // 移除校验结果
        clearValidate() {
            this.$refs['ruleForm'].clearValidate();
        },
        // 修改表单填写值
        setFormValue() {
            this.$parent.$parent.$parent.setFormValue(this.elementIndex, this.value);
        },
        // 拖拽时更新输入值
        toUpdate(value) {
            // 输入值
            this.value = value.defaultFillIn;
            // 选项值
            this.$set(this.ruleForm, 'value', value.options);
        },
        // 初始化控件
        elementInit() {
            // 初始赋值一次
            this.$set(this.ruleForm, 'value', this.elementItem.options);
            this.value = this.elementItem.default;
            // this.$nextTick(() => {
            //     this.value = this.elementItem.default;
            // });
        }
    }
};
</script>

<style lang="scss" scoped>
</style>