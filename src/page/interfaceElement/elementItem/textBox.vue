<template>
    <div class="text_box item_box">
        <el-form 
        :model="ruleForm" 
        :rules="rules" 
        ref="ruleForm" 
        label-width="120px" 
        :validate-on-rule-change="false" 
        status-icon  
        class="demo_ruleForm">
            <el-form-item :label="elementItem.elementLabel+'：'" prop="value">
                <el-input  
                v-model="ruleForm.value" 
                :placeholder="elementItem.inputTip?elementItem.inputTip:'请输入内容~'" 
                autocomplete="off"
                @focus="submitForm()"
                @blur="clearValidate()"
                ></el-input>
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
        // console.log(rule, value, callback);
        var validatePass = (rule, value, callback) => {
            // 是否是按钮触发验证
            if(this.buttonBoolean){
                this.buttonBoolean = false;                
                if(this.ruleForm.value){// 是否有值
                    // console.log('有值');
                    if(this.elementItem.validateConditon) {// 有值时是否有正则
                        // console.log(this.elementItem.validateConditon, '有正则');
                        if(!eval(this.elementItem.validateConditon).test) return;
                        // console.log(this.elementItem.validateConditon, this.ruleForm.value, '有正则且正则正确');
                        if(eval(this.elementItem.validateConditon).test(this.ruleForm.value)){// 正则是否匹配成功
                            // console.log(this.elementItem.validateConditon, '正则匹配成功');
                            callback();
                        }else {
                            callback(new Error(this.elementItem.inputTip?this.elementItem.inputTip:'输入有误！'));
                        };
                    }else{
                        callback();
                    };
                };             
            };
        };
        return {
            // 自定义按钮验证开关
            buttonBoolean: false,
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
    computed: {},
    watch: {
        // 修改默认值时动态赋值
        'elementItem.default': {
            handler(val, oldVal) {
                this.$set(this.ruleForm, 'value', val);
            },
            deep:true
        },
        // 输入值改变时
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
        // 正则修改时
        'elementItem.validateConditon': {
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
    },
    created() {
        // 初始化控件
        this.elementInit();
    },
    mounted() {
    },
    methods: {
        // 提交
        submitForm() {
            // 打开按钮验证开关
            this.buttonBoolean = true;
            // 验证表单
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    // console.log('提交成功!');
                    
                } else {
                    // console.log('提交错误!!');
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
            this.$parent.$parent.$parent.setFormValue(this.elementIndex, this.ruleForm.value);
        },
        // 拖拽时更新输入值
        toUpdate(value) {
            // console.log(value.defaultFillIn);
            this.$set(this.ruleForm, 'value', value.defaultFillIn);
        },
        // 初始化控件
        elementInit() {
            this.$set(this.ruleForm, 'value', this.elementItem.default);
            // console.log(this.elementItem.default);
        }
    }
};
</script>

<style lang="scss" scoped>
</style>