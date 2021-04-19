<template>
    <div id="interfaceElement">
        <!-- 上 -->
        <div class="container_top">
            <!-- 界面元素页Tab -->
            <in-el-tab 
            :tab-list="tabList"
            :current-index="currentIndex"
            :page-change="pageChange"
            @tab-click="clickPage"
            @tab-close="closePage"
            >
            </in-el-tab>
            <!-- 功能按钮 -->
            <div class="newly_added">
                <!-- 新增按钮 -->
                <el-button
                icon="el-icon-circle-plus-outline"
                type="primary"
                size="small"
                @click="addPage"
                >新增界面</el-button>
                <!-- 保存界面 -->
                <el-button
                icon="el-icon-folder-checked"
                type="primary"
                size="small"
                @click="preservation"
                >保存界面</el-button>
                <!-- 清除缓存 -->
                <el-button
                icon="el-icon-refresh"
                type="primary"
                size="small"
                @click="localStorageClear"
                >清除界面</el-button>
                <!-- 数据验证 -->
                <el-button
                icon="el-icon-finished"
                type="primary"
                size="small"
                @click="dataValidationBtn=true"
                >数据验证</el-button>
            </div>
        </div>
        <!-- 下 -->
        <div class="container_bottom" v-loading="loadSwitch">
            <div            
            v-for="(item, index) in elementList"           
            :key="index"
            >
                <!-- 界面元素页 -->
                <in-el-page
                ref="inElPage"
                v-if="item.switch"
                v-show="item.Aindex==currentIndex"
                :element-index="index"
                :element-item="item"
                :ui-flag-list="uiFlagList"
                ></in-el-page>
            </div>
        </div>
        <!-- 保存成功弹窗提示 -->
        <el-dialog
        title="保存成功，数据如下~"
        :visible.sync="dialogVisible"
        width="60%">
            <div>
                <el-input
                type="textarea"
                :rows="8"
                :readonly="true"
                v-model="dialogVisibleData">
                </el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 数据验证 -->
        <el-dialog
        title="把修改好的JSON数据粘贴确定，该操作会重新刷新所有界面~"
        :visible.sync="dataValidationBtn"
        width="60%">
            <div>
                <el-input
                type="textarea"
                :rows="8"
                v-model="dataValidationData">
                </el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dataValidationBtn = false">取 消</el-button>
                <el-button type="primary" @click="dataValidation()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import inElTab from "./inElTab.vue";// Tab切换组件
import inElPage from "./inElPage.vue";// 界面元素页组件
import elementsOrg from "./mapping/elements.js";// 控件元素集
import {formOrg, elementMapping} from "./mapping/elements.js";// 控件元素集与Type映射关系
import {getTimeStamp, isExistence} from "./js/method.js";// 检测信息是否存在数组中

const digitalMapping = ['一','二','三','四','五','六','七','八','九','十'];

export default {
    name: "interfaceElement",
    components: { 
        inElTab, // Tab切换组件
        inElPage,
    },
    data() {
        return {
            // 最大界面数
            maxPageNumber: 3,
            // Tab列表信息
            tabList: [],
            // 界面元素数据
            elementList: [],
            // 当前页面索引
            currentIndex: 0,
            // 界面标识列表
            uiFlagList: [],
            // 加载开关
            loadSwitch: false,
            // 页面是否变更
            pageChange: [],
            // 随机时间
            randomTime: () => Math.ceil(Math.random()*200) + 200,
            // 保存成功弹窗开关
            dialogVisible: false,
            // 保存成功信息
            dialogVisibleData: '',
            // 数据验证弹窗开关
            dataValidationBtn: false,
            // 数据验证数据
            dataValidationData: '',

        };
    },
    computed: {
    },
    watch: {
        // 监听元素列表修改
        elementList() {
            // 处理界面标识是否唯一
            var org = JSON.parse(JSON.stringify(this.elementList));
            org.map((item, index) => {
                this.$set(this.uiFlagList, index, item.uiFlag);
            });
            // console.log(this.uiFlagList, 'this.uiFlagList');
        }
    },
    created() {
        // 界面初始化
        this.pageInit();
    },
    mounted() {},
    methods: {
        // 界面初始化
        pageInit() {
            // 开启加载动画
            this.loadSwitch = true;
            setTimeout(() => {    
                // 本地获取界面元素信息
                var org = window.localStorage.getItem('element_data');
                // console.log(JSON.parse(org));
                // 处理本地获取的信息
                if(org) {
                    // 处理本地获取的信息
                    org = this.informationProcessing(org);
                    // 信息添加动态组件信息
                    for(var i=0;i<this.maxPageNumber;i++) {
                        org[i] = {
                            ...org[i],// 本地处理之后源数据
                            Aindex: i,// 组件索引-控制是否显示
                            switch: org[i] ? true : false,// 组件开关-控制重新渲染
                        };
                    };
                }else{
                    org = [];
                    // 信息添加动态组件信息
                    for(var i=0;i<this.maxPageNumber;i++) {
                        var obj = false;
                        if(i==0) {
                            obj = {
                                uiFlag: '',
                                uiName: '界面名称',
                                uiId: `${getTimeStamp()}`,
                                elements: [],
                            };
                        };
                        org.push({
                            ...obj,// 本地处理之后源数据
                            Aindex: i,// 组件索引-控制是否显示
                            switch: obj ? true : false,// 组件开关-控制重新渲染
                        });
                    };
                };
                // Tab选项初始化
                for(var i=0;i<this.maxPageNumber;i++) {
                    if(org[i].switch) {                
                        this.tabList.push(org[i]);
                    };
                };
                // console.log(org, 'org');
                // 界面元素数赋值
                this.elementList = org;
                // console.log(this.elementList);
                // 关闭加载动画
                this.loadSwitch = false;
            }, this.randomTime());
        },
        // 新增页面
        addPage(org) {// 无org时为默认新增，org为模板新增
            // 判断是否有上一次请求发出
            if(this.loadSwitch) return;
            // 页面数量是否超标
            if (this.tabList.length >= this.maxPageNumber) {
                this.$alert(`界面配置数上限为${this.maxPageNumber}个`, "提示", {
                    confirmButtonText: "确定",
                    type: "warning",
                });
                return;
            };
            // 没有超标新增
            // 开启加载动画
            this.loadSwitch = true;
            setTimeout(() => {
                if(org.tpName) {
                    // 模板增加
                    org = JSON.parse(JSON.stringify(org));
                    let len = org.pages.length;
                    let indexList = [];
                    let num = 0;
                    for(var i=0;i<this.maxPageNumber;i++) {
                        if(!this.elementList[i].switch) {
                            num++;
                            indexList.push(i);
                        };
                        if(num==len) break;
                    };
                    for(var i=0;i<org.pages.length;i++) {
                        let org_c = JSON.parse(JSON.stringify(org.pages[i]));
                        org_c.uiFlag = `${getTimeStamp()+i}`;
                        org_c.uiId = `${getTimeStamp()+i}`;   
                        org_c = this.elementModify(org_c);
                        this.$set(this.elementList[indexList[i]], 'uiName', org_c.uiName);
                        this.$set(this.elementList[indexList[i]], 'uiFlag', org_c.uiFlag);
                        this.$set(this.elementList[indexList[i]], 'uiId', org_c.uiId);
                        this.$set(this.elementList[indexList[i]], 'elements', org_c.elements);
                        this.$set(this.elementList[indexList[i]], 'switch', true);
                        this.tabList.push(this.elementList[indexList[i]]);
                        // console.log(org_c, this.elementList[indexList[i]], 'org_c');
                    };
                    // 重新聚焦
                    this.$nextTick(() => {
                        this.reFocus(indexList[indexList.length-1]);
                        // 关闭加载动画
                        this.loadSwitch = false;
                    });
                }else {     
                    // 默认增加                             
                    // 获取最近可占据的动态组件索引
                    var index = false;            
                    for(var i=0;i<this.maxPageNumber;i++) {
                        if(!this.elementList[i].switch) {
                            index = i;
                            break
                        };
                    };
                    this.$set(this.elementList[index], 'switch', true);
                    this.$set(this.elementList[index], 'uiName', `界面元素`);
                    this.$set(this.elementList[index], 'uiId', `${getTimeStamp()}`);
                    this.tabList.push(this.elementList[index]);
                    console.log(this.elementList[index]);
                    // 重新聚焦
                    this.$nextTick(() => {
                        this.reFocus(index);
                        // 关闭加载动画
                        this.loadSwitch = false;
                    });
                };
            }, this.randomTime());   
        },
        // 删除
        closePage(Tindex) {
            // 判断是否有上一次请求发出
            if(this.loadSwitch) return;
            // Bindex元素位置，Tindex按钮位置       
            var Bindex = this.tabList[Tindex].Aindex; 
            // console.log(Bindex, Tindex);                 
            // 判断页面是否会小于0个
            if(this.tabList.length === 1){
                this.$alert(`界面配置数最小为1个`, "提示", {
                    confirmButtonText: "确定",
                    type: "warning",
                });
                return;
            };                 
            // 确认是否删除
            this.$confirm(`是否删除${this.tabList[Tindex].uiName}`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                // 开启加载动画
                this.loadSwitch = true;  
                setTimeout(() => {
                    // 暂存uiId标识-用于对应删除界面
                    let uiId = this.elementList[Bindex].uiId;                  
                    // 如果改页面已经保存过-删除本地缓存-后期只要有uiId就是缓存过的
                    let org_hc = window.localStorage.getItem('element_data');
                    if(org_hc) {
                        org_hc = JSON.parse(org_hc);
                        for(let i=0;i<org_hc.length;i++) {
                            if(uiId == org_hc[i].uiId) {
                                console.log(uiId, org_hc[i].uiId, 'uiId');  
                                org_hc.splice(i, 1);
                                window.localStorage.setItem('element_data', JSON.stringify(org_hc));
                                console.log(org_hc);
                                break;
                            };
                        };
                    };
                    // 删除标签元素
                    this.tabList.splice(Tindex, 1);
                    // 关闭对应页面-保证重新开启页面时刷新页面
                    this.$set(this.elementList, Bindex, {
                        Aindex: Bindex,
                        switch: false
                    });
                    // console.log(this.elementList[Bindex]);
                    // 寻找最靠前能显示的页面
                    for(var i=0;i<this.maxPageNumber;i++){
                        if(this.elementList[i].switch) {  
                            // console.log(i, 'index');                        
                            this.$nextTick(() => {
                                // 重新聚焦   
                                this.reFocus(i);
                                // 每个界面都检测界面标识数据是否重复              
                                for(var k=0;k<this.$refs.inElPage.length;k++){                                   
                                    this.$refs.inElPage[k].uiFlagTesting();
                                }; 
                            });            
                            break;
                        };           
                    };                   
                    // 关闭加载动画
                    this.loadSwitch = false;
                    // 删除走完
                    this.checkMessageBox(`删除成功~`, 'success');
                }, this.randomTime());
            }).catch(() => {});
        },
        // 点击切换界面
        clickPage(index) {
            this.reFocus(index);
        },
        // 重新聚焦
        reFocus(index) {
            // console.log(index, 'index');
            this.currentIndex = index;
        },
        // 保存界面
        preservation() {
            // 判断是否有上一次请求发出
            if(this.loadSwitch) return;
            // 获取信息            
            var len = this.$refs.inElPage.length;
            var org = [];
            for(var i=0;i<len;i++){
                // 过滤保存信息
                let obj = this.elementFilter(this.$refs.inElPage[i].preservation());
                org.push(obj);
            };
            // 校验信息
            let bur = this.preservationCheck(org);
            if(!bur) return;// 校验不成功
            // 开启加载动画
            this.loadSwitch = true;
            setTimeout(() => {
                // 信息重排顺序-前端映射转数据排序-暂时因为清除重新刷新保存界面用不到
                // this.informationRearrangement(org);
                // 本地保存数据
                window.localStorage.setItem('element_data', JSON.stringify(org));
                // 关闭加载动画
                this.loadSwitch = false;
                // 提示保存成功
                this.dialogVisibleData = JSON.stringify(org);
                this.dialogVisible = true;
            }, this.randomTime());
        },
        // 保存信息过滤
        elementFilter(org) {
            var obj = {};
            obj.uiFlag = org.uiFlag;
            obj.uiName = org.uiName;
            obj.uiId = org.uiId?org.uiId:'';
            obj.elements = [];
            var len = org.elements.length;
            for(var i=0;i<len;i++) {
                let temStorage = {};         
                for(var key in formOrg.elements[0]) {
                    temStorage[key] = org.elements[i][key];
                };
                obj.elements.push(temStorage);
            };
            return obj;
        },
        // 修改tab标题信息与标识
        setTabTitle(index, key, value) {
            // console.log(index, key, value);
            // 修改元素列表信息
            this.$set(this.elementList[index], key, value);
            // 界面标识列表信息
            if(key == 'uiFlag') {
                this.$set(this.uiFlagList, index, value);
                this.$nextTick(() => {                   
                    for(var i=0;i<this.$refs.inElPage.length;i++){
                        // 每个界面都检测界面标识数据是否重复
                        this.$refs.inElPage[i].uiFlagTesting();
                    };    
                });
            };
        },
        // 本地界面元素信息处理
        informationProcessing(org) {
            org = JSON.parse(org);                      
            var len = org.length;
            var obj = [];
            // 过滤保存信息
            for(var i=0;i<len;i++){
                let objs = this.elementModify(org[i]);
                // console.log(org[i],'org[i]');
                obj.push(objs);
            };
            return obj;
        },
        // 本地获取信息修改后赋值
        elementModify(org) {
            var obj = {};
            obj.uiFlag = org.uiFlag;
            obj.uiName = org.uiName;
            obj.uiId = org.uiId?org.uiId:``;
            obj.elements = [];
            var len = org.elements.length;           
            for(var i=0;i<len;i++) {
                // 找到tpye类型对应的前端控件对象
                let temStorage = JSON.parse(JSON.stringify(elementsOrg[elementMapping[org.elements[i].elementType]]));
                for(var key in org.elements[i]) {
                    temStorage[key] = org.elements[i][key];
                };
                obj.elements.push(temStorage);
                // console.log(temStorage, org.elements[i],'temStorage');
            };
            return obj;
        },
        // 清除本地缓存-无后台接口时使用
        localStorageClear() {
            // 判断是否有上一次请求发出
            if(this.loadSwitch) return;
            // 确认是否删除
            this.$confirm(`此操作不可撤销，是否删除所有界面信息~`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {           
                // 开启加载动画
                this.loadSwitch = true;
                setTimeout(() => { 
                    // 本地保存数据
                    window.localStorage.setItem('element_data', '');
                    // 关闭加载动画
                    this.loadSwitch = false;
                    // 刷新页面
                    location.reload();
                }, this.randomTime());
            }).catch(() => {});
        },
        // 保存信息校验
        preservationCheck(org) {
            console.log(org, '保存信息~');
            org = JSON.parse(JSON.stringify(org));
            let len = org.length;
            let bur = true;// 校验结果暂存
            for(let i=0;i<len;i++) { 
                // 界面名称校验
                bur = this.uiNameCheck(org); 
                if(!bur) return false;// 校验失败              
                // 界面标识校验
                bur = this.uiFlagCheck(org);
                if(!bur) return false;// 校验失败
                // 元素标识校验
                bur = this.elementNameCheck(org[i]);
                if(!bur) return false;// 校验失败
                // 选项校验
                bur = this.optionsValueCheck(org[i]);
                if(!bur) return false;// 校验失败
            };
            return true;// 校验通过
        },
        // 界面名称校验
        uiNameCheck(org) {
            let len = org.length;// 信息数组长度
            // 空值检测
            for(let i=0;i<len;i++) {
                if(!org[i].uiName) {
                    this.checkMessageBox('界面名称值不能为空，请检查！');
                    return false;// 校验失败
                };
            };
            return true;// 校验通过
        },
        // 界面标识校验
        uiFlagCheck(org) {
            // console.log(org, '保存信息~');  
            let len = org.length;// 信息数组长度
            let org_s = [];// 界面标识暂存数组
            // 空值检测
            for(let i=0;i<len;i++) {
                if(!org[i].uiFlag) {
                    this.checkMessageBox('界面标识值不能为空，请检查！');
                    return false;// 校验失败
                };
                org_s.push(org[i].uiFlag);
            };
            // 重复值检测
            let org_c = JSON.parse(JSON.stringify(org_s));            
            for(let i=0;i<len;i++) {
                if(isExistence(org_c[i], org_s).isExistence) {                    
                    this.checkMessageBox('界面标识值重复，请检查！');
                    return false;// 校验失败
                };
            };
            return true;// 校验通过
        },
        // 元素标识校验
        elementNameCheck(org) {
            let len = org.elements.length;
            let org_el_s = [];
            // 空值检测
            for(let i=0;i<len;i++) {
                if(!org.elements[i].elementName) {
                    this.checkMessageBox('元素标识值不能为空，请检查！');
                    return false;// 校验失败
                };
                org_el_s.push(org.elements[i].elementName);
            };
            // 重复值检测            
            let org_el_c = JSON.parse(JSON.stringify(org_el_s));            
            for(let i=0;i<len;i++) {
                if(isExistence(org_el_c[i], org_el_s).isExistence) {                    
                    this.checkMessageBox('元素标识值重复，请检查！');
                    return false;// 校验失败
                };
            };
            return true;// 校验通过
        },
        // 选项校验
        optionsValueCheck(org) {
            let org_s = JSON.parse(JSON.stringify(org.elements));
            let len = org_s.length;
            for(let i=0;i<len;i++) {
                // 检测该元素是否存在选项值使用
                let bur = elementsOrg[elementMapping[org_s[i].elementType]].isAttribute.options?true:false;
                if(!bur) continue; 
                // 选项信息获取 
                let org_c = JSON.parse(JSON.stringify(org_s[i].options)); 
                let len_c = org_c.length;
                let arryValue = [];// 选项值暂存
                // 空值检测-检测名和值
                for(let k=0;k<len_c;k++) {
                    if(!org_c[k].optionLabel||!org_c[k].optionValue) {
                        this.checkMessageBox('选项名或值不能为空，请检查！');
                        return false;// 校验失败
                    };
                    arryValue.push(org_c[k].optionValue);
                };
                // 重复值检测-检测值 
                let arryValue_c = JSON.parse(JSON.stringify(arryValue));
                for(let k=0;k<len_c;k++) {
                    if(isExistence(arryValue_c[k], arryValue).isExistence) {                    
                        this.checkMessageBox('选项值重复，请检查！');
                        return false;// 校验失败
                    };
                };
            };
            return true;// 校验通过
        },
        // 保存信息重新排序
        informationRearrangement(org) {
            console.log(org, this.tabList, '排序信息~');
            let org_c = [];
            let org_s = {};
            let len = this.tabList.length;
            for(let i=0;i<len;i++) {
                org_s[org[i].uiFlag] = JSON.parse(JSON.stringify(org[i]));
            };
            console.log(org_s, 'org_s~');
            for(let i=0;i<len;i++) {
                org_c.push(JSON.parse(JSON.stringify(org_s[this.tabList[i]['uiFlag']])));
            };
            console.log(org_c, 'org_c~');
            return org_c;
        },
        // 弹框提示
        checkMessageBox(msg, type = 'warning') {
            this.$alert(msg, "提示", {
                confirmButtonText: "确定",
                type: type,
            }).then(() => {}).catch(() => {});
        },
        // 生成模板
        templateGeneration(org) {
            // 判断是否还有剩余数量页面可以生成
            if((this.maxPageNumber - this.tabList.length) < org.pages.length){
                this.checkMessageBox(
                    `
                    本次操作需要构建界面数为${org.pages.length}，
                    剩余构建数为${this.maxPageNumber - this.tabList.length}，
                    如需构建请先删除无用的界面或联系管理员~
                    `
                );
                return;
            };
            // 如有则新增指定数量页面
            this.addPage(org);
            // console.log(org);
        },
        // 数据验证
        dataValidation() {
            this.dataValidationBtn = false;
            window.localStorage.setItem('element_data', this.dataValidationData);
            location.reload();
        }
    },
};
</script>

<style lang="scss" scoped>
.container_top {
    display: flex;
    border-bottom: 1px solid #f1e8e8;
    padding: 10px 10px;
    /deep/ #inElTab {
        flex: 1;
    }
    .newly_added {
        text-align: right;
        flex: 1;
    }
}
.container_bottom{
    min-height: calc(100vh - 53px);
}
/deep/ .el-textarea__inner{   
    font-family: 'Microsoft YaHei';
}
</style>