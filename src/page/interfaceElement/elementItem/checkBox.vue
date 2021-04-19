<template>
    <div class="check_box item_box">
        <el-form        
        label-width="120px"
        status-icon
        class="demo_ruleForm"
        :validate-on-rule-change="false" 
        :model="ruleForm" 
        :rules="rules" 
        ref="ruleForm"
        >
            <el-form-item :label="elementItem.elementLabel+'：'" prop="value">
                <el-checkbox 
                :indeterminate="isIndeterminate" 
                v-model="checkAll" 
                @change="handleCheckAllChange">
                全选</el-checkbox>
                <el-checkbox-group v-model="ruleForm.checkedValues" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="(item, index) in valueOptions" :label="item" :key="index">
                        {{item}}
                    </el-checkbox>
                </el-checkbox-group>
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
            // console.log(this.ruleForm.checkedValues);
            if(!this.ruleForm.checkedValues) {
                callback(new Error(this.elementItem.inputTip?this.elementItem.inputTip:'请选择至少一个选项'));               
                return;
            };
            if(this.buttonBoolean){
                this.buttonBoolean = false;
                // console.log(this.ruleForm.checkedValues);
                if (this.ruleForm.checkedValues[0]) {
                    callback();
                } else {
                    callback(new Error(this.elementItem.inputTip?this.elementItem.inputTip:'请选择至少一个选项'));
                };
            };
        };
        return {
            // 表单数据
            ruleForm: {
                checkedValues: [],
            },           
            // 校验方式
            rules: {
                value: [
                    { validator: validatePass, trigger: 'bur' }
                ],
            },
            // 全选开关
            checkAll: false,
            // 全选开关的不确定状态-用于半选时
            isIndeterminate: false,
            // 选择值
            checkedValues: false,
            // 所有选项value集合
            valueOptions: [],
            // 打开按钮验证开关
            buttonBoolean: false,
        };
    },
    computed: {
        // 监听选项值是否修改
        values() {
            var org = this.elementItem.options;
            org = org.map(item => {
                return item.optionLabel;
            });
            this.valueOptions = org;
            return this.elementItem.options;
        },
        // 修改默认值时动态赋值
        setDefaultvalue() {
            return this.elementItem.default;
        },
        // 选择值发生变化
        changeCheckedValues() {
            return this.ruleForm.checkedValues;
        },
        // 监听输入提示修改
        valueInputTip() {
            return this.elementItem.inputTip;
        },
    },
    watch: {
        // 选项值修改时的处理
        values() {           
            // 值变化重新选中
            this.handleCheckedCitiesChange(this.ruleForm.checkedValues);
        },
        // 修改默认值时动态赋值
        setDefaultvalue() {      
            this.$set(this.ruleForm, 'checkedValues', this.defaultProcessing(this.setDefaultvalue));
            // 值变化重新选中
            this.handleCheckedCitiesChange(this.ruleForm.checkedValues);
        },
        // 选择值发生变化
        changeCheckedValues() {
            this.setFormValue();                  
            if(this.elActiveIndex == this.elementIndex) {
                this.submitForm();
            }else{             
                this.clearValidate();
            };
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
    },
    methods: {
        // 默认值处理"value,value,value" = [value,value,value]
        defaultProcessing(str) {
            str = str.split(',');
            var org = [];
            this.elementItem.options.map(item => {
                for(var i=0;i<str.length;i++){
                    if(str[i] == item.optionValue) {
                        org.push(item.optionLabel);
                    } ;
                };
            });
            return org;
        },
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
        // 全选按钮点击事件
        handleCheckAllChange(val) {
            // console.log(val, 'val'); 
            this.$set(this.ruleForm, 'checkedValues', val ? this.valueOptions : []);
            this.isIndeterminate = false;
        },
        // 备选按钮点击事件
        handleCheckedCitiesChange(value) {
            // console.log(this.ruleForm.checkedValues, 'value');
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.values.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.values.length;
            // console.log(value, this.values.length, 'value');
        },
        // 重置
        resetFields() { 
            this.$set(this.ruleForm, 'checkedValues', this.defaultProcessing(this.elementItem.default));
            this.handleCheckedCitiesChange(this.ruleForm.checkedValues);
            this.$nextTick(() => {
                this.clearValidate();
            });        
        },
        // 移除校验结果
        clearValidate() {            
            this.$refs['ruleForm'].clearValidate();
        },
        // 修改表单填写值
        setFormValue() {
            // 数组反转字符串
            var str = '';
            for(var i=0;i<this.ruleForm.checkedValues.length;i++) {
                for(var k=0;k<this.values.length;k++) {
                    if(this.ruleForm.checkedValues[i]==this.values[k].optionLabel) {
                        str = str + this.values[k].optionValue + ',';
                    };
                };
            };
            str = str.slice(0, str.length-1);
            // console.log(str, 'this.ruleForm.checkedValues');
            this.$parent.$parent.$parent.setFormValue(this.elementIndex, str);
        },
        // 更新输入信息
        toUpdate(value) { 
            // console.log(value, this.elementIndex, this.defaultProcessing(value.defaultFillIn), 'value.defaultFillIn');
            this.$set(this.ruleForm, 'checkedValues', this.defaultProcessing(value.defaultFillIn));
            this.handleCheckedCitiesChange(this.ruleForm.checkedValues);
            this.setFormValue();   
        },        
        // 初始化控件
        elementInit() {
            // 值变化重新选中
            this.$set(this.ruleForm, 'checkedValues', this.defaultProcessing(this.elementItem.default));
            this.handleCheckedCitiesChange(this.ruleForm.checkedValues);
            this.$nextTick(() => {
                this.setFormValue(); 
            });         
            // this.$nextTick(() => {
            //     // 值变化重新选中
            //     this.$set(this.ruleForm, 'checkedValues', this.defaultProcessing(this.elementItem.default));
            //     this.handleCheckedCitiesChange( this.defaultProcessing(this.elementItem.default));      
            // });
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>