<template>
    <div class="date_picker item_box">
        <el-form 
        :model="ruleForm" 
        :rules="rules" 
        ref="ruleForm" 
        label-width="120px" 
        :validate-on-rule-change="false" 
        status-icon  
        class="demo_ruleForm">
            <el-form-item :label="elementItem.elementLabel+'：'" prop="value">
                <el-date-picker
                v-model="ruleForm.value"
                :type="format"
                placeholder="选择日期"
                @focus="submitForm()"
                @change="submitForm()"
                @blur="clearValidate()">
                </el-date-picker>
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
            if(this.buttonBoolean){
                this.buttonBoolean = false;
                if (this.ruleForm.value) {
                    callback();
                } else {
                    callback(new Error(this.elementItem.inputTip));
                };
            };
        };
        return {           
            // 自定义按钮验证开关
            buttonBoolean: false,
            // 值
            ruleForm: {
                value: '',
            },
            // 校验方式
            rules: {
                value: [
                    { validator: validatePass, trigger: 'bur' }
                ],
            },
            // 格式
            format: 'month'
        };
    },
    computed: {
    },
    watch: {
        // 修改默认值时动态赋值
        'elementItem.default': {
            handler(val, oldVal) {               
                this.$set(this.ruleForm, 'value', this.setDefaultvalue);
            },
            deep:true
        },
        // 修改选项值时动态赋值
        'ruleForm.value': {
            handler(val, oldVal) {               
                this.setFormValue();                  
                if(this.elActiveIndex == this.elementIndex) {
                    this.submitForm();
                }else{               
                    this.clearValidate();
                };
            },
            deep:true
        },
        // 输入提示修改时
        'elementItem.inputTip': {
            handler(val, oldVal) {                               
                if(this.elActiveIndex == this.elementIndex) {
                    this.submitForm();
                };
            },
            deep:true
        },
        // 选中索引修改时
        elActiveIndex() {
            // console.log('选中位置发生了变化~', this.elActiveIndex);           
            if(this.elActiveIndex == this.elementIndex) {
                this.submitForm();
            }else{               
                this.clearValidate();
            };
        },        
        // 格式修改时
        'elementItem.format.value': {
            handler(val, oldVal){
                let len = this.elementItem.format.options.length;
                for(let i=0;i<len;i++) {
                    if(val == this.elementItem.format.options[i].optionValue) {
                        this.format = this.elementItem.format.options[i].type;
                        console.log(this.format, 'format');
                        break;
                    };
                };
            },
            deep:true
        }
    },
    created() {
        // 初始化控件
        this.elementInit();
    },
    mounted() {},
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
            this.$set(this.ruleForm, 'value', this.elementItem.default);
            this.clearValidate();
        },
        // 移除校验结果
        clearValidate() {
            this.$refs['ruleForm'].clearValidate();
        },
        // 修改表单填写值
        setFormValue() {
            // console.log(this.ruleForm.value);
            this.$parent.$parent.$parent.setFormValue(this.elementIndex, this.ruleForm.value);
        },
        // 更新输入信息
        toUpdate(value) {
            this.$set(this.ruleForm, 'value', value.defaultFillIn);
        },       
        // 初始化控件
        elementInit() {
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>