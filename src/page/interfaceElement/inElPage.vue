<template>
    <div class="inElPage">
        <!-- 左-控件列表 -->
        <div class="container_left">
            <div class="title">
                元素控件-拖拽
            </div>
            <div class="content" substitution="true">
                <draggable
                :value="controlList"
                v-bind="{group:{name: 'componentsGroup',pull:'clone'},sort: true}"
                :clone="cloneelement"
                :move="dragmove"
                @end="dragend"
                >
                    <div
                    v-for="(item, index) in controlList"
                    :key="index"
                    class="control_item"
                    :class="{control_item_odd:(index+1)%2===1}"
                    >
                        <i class="iconfont" :class="item.icon"></i>
                        <span>{{item.elementLabel}}</span>
                    </div>
                </draggable>
            </div>
            <div class="title title1">
                快速构建模板-点击
            </div>
            <div class="content">
                <div>                    
                    <div
                    v-for="(item, index) in pageElement"
                    :key="index"
                    class="control_item"
                    :class="{control_item_odd:(index+1)%2===1}"
                    @click="templateGeneration(index)"
                    >
                        <i class="iconfont" :class="item.icon"></i>
                        <span>{{item.tpName}}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 中-元素列表 -->
        <div class="container_center" substitution="false">
            <div class="center_function">
                <div class="title">{{uiName?uiName:''}}</div>
                <div class="inputText">
                    <div class="content_item">
                        <div class="from_title">界面名称：</div>
                        <div class="from_item">
                            <el-input v-model="uiName" placeholder="请输入界面名称" size="small" maxlength="8" show-word-limit></el-input>
                        </div>
                    </div>
                    <div class="content_item">
                        <div class="from_title">界面标识：</div>
                        <div class="from_item">
                            <el-input v-model="uiFlag" placeholder="请输入唯一界面标识" size="small" maxlength="10" show-word-limit></el-input>
                        </div>
                        <div class="from_tips" v-show="isUiFlag">
                            <el-tooltip class="item" effect="dark" content="界面标识已重复，请检查" placement="top-start">
                                <i class="el-icon-warning"></i>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <draggable
            ref="draggableParent"
            :value="elementList"
            animation="340"
            group="componentsGroup"
            :move="dragmoves"
            @end="dragends"
            >
                <!-- 表单元素 -->
                <element-item
                ref="elementItem"
                v-for="(item, index) in elementList"                
                :key="index"
                :element-index="index"
                :el-active-index="elActiveIndex"
                :el-move-index="elMoveIndex"
                :element-item="item"
                :elements-org="elementsOrg"
                @mouse-down="elActiveIndex=index;elMoveBoolean=false"
                @move-seenter="elMoveIndex=elMoveBoolean?index:-1"
                @move-leave="elMoveIndex=-1"
                @element-delete="elementDelete"
                ></element-item>
            </draggable>
            <div class="center_check">
                <!-- <el-button type="primary" @click="formCheck">模拟校验</el-button> -->
                <el-button v-show="elementList.length>0" type="primary" @click="formReset" plain>重置表单</el-button>
            </div>
        </div>
        <!-- 右-属性修改 -->
        <div class="container_right">
            <div class="right_bottom">
                <div class="title">
                    <span>{{changeTitle}}</span>
                    — 属性：
                </div>
                <attribute-modify
                v-if="elementList[elActiveIndex]"
                :modify-item="elementList[elActiveIndex]"
                :element-name-list="elementNameList"
                @modify-callback="modifyCallback"
                ></attribute-modify>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";// 拖拽插件
import elementItem from "./elementItem.vue";// 元素列表项
import elementsOrg from "./mapping/elements.js";// 控件元素集
import attributeModify from "./attributeModify.vue";// 属性修改页
import {getTimeStamp, isExistence} from "./js/method.js";// 检测信息是否存在数组中
import pageElement from "./mapping/page/index.js"// 模板页面数据

export default {
    name: "inElPage",
    components: {draggable, elementItem, attributeModify},
    props: {
        elementItem: {type: Object},
        elementIndex: {},
        elementName: {},
        uiFlagList: {},
    },
    data() {
        return {
            // 界面标识
            uiFlag: '',
            // 界面标识是否已经存在
            isUiFlag: false,
            // 界面名称
            uiName: '',
            // 控件列表内容
            controlList: [],
            // 控件元素集
            elementsOrg,
            // 元素列表内容
            elementList: [],
            // 当前拖拽第几个元素
            elDragIndex: -1,
            // 当前选中第几个元素
            elActiveIndex: '0',
            // 当前移入第几个元素
            elMoveIndex: -1,
            // 是否可以移入
            elMoveBoolean: true,
            // 克隆暂存
            cloneOrg: null,
            // 模板页面数据
            pageElement
        };
    },
    computed: {
        // 表单属性标题
        rightOrg() {
            var org = this.elementList[this.elActiveIndex]?this.elementList[this.elActiveIndex]:'请选择表单元素';
            return org;
        },       
        // 属性修改页标题
        changeTitle() {
            var str = '控件';
            if(this.elementList.length < 1) {
                return str;
            };
            if(this.elementList[this.elActiveIndex].elementLabel) {
                str = this.elementList[this.elActiveIndex].elementLabel;
            }else{
                str = this.elementsOrg[this.elementList[this.elActiveIndex].type].elementLabel;
            };
            return str;
        },       
        // 元素标识数组
        elementNameList() {            
            let org = [];
            let len = this.elementList.length;
            for(let i=0;i<len;i++) {
                org.push(
                    this.elementList[i].elementName?
                    this.elementList[i].elementName:
                    ""
                );
            };
            return org;
        }
    },
    watch: {
        // 监听界面标识
        uiFlag() {
            if(!this.$parent.setTabTitle) return;
            this.$parent.setTabTitle(this.elementIndex, 'uiFlag', this.uiFlag);
        },
        // 监听界面名称
        uiName() {
            if(!this.$parent.setTabTitle) return;
            // console.log(this.elementList);
            this.$parent.setTabTitle(this.elementIndex, 'uiName', this.uiName);
        },
    },
    created() {
        // 页面初始化
        this.pageInit();
    },
    mounted() {
        // console.log(this.pageElement);
    },
    methods: {
        // 页面初始化
        pageInit() {           
            // console.log('刷新了~', this.elementIndex+'S');           
            // 添加控件列表内容
            for (var key in elementsOrg) {
                var org = elementsOrg[key];
                this.controlList.push(org);
            };
            // 初始值赋予
            this.uiFlag = this.elementItem.uiFlag;
            this.uiName = this.elementItem.uiName;
            this.uiId = this.elementItem.uiId;
            this.elementList = this.elementItem.elements?this.jsonString(this.elementItem.elements):[];
        },
        // 检测界面标识是否重复
        uiFlagTesting() {
            this.isUiFlag = isExistence(this.uiFlag, this.uiFlagList).isExistence;
        },
        // Json字符串转化防对象型数据拷贝会共享
        jsonString(org) {
            return JSON.parse(JSON.stringify(org));
        },
        // 克隆拖拽控件
        cloneelement(ev) {
            // 控件对象信息Json对象和Json字符串转化一次，解决克隆数据之后数据同源共享状态
            // console.log(ev);
            this.cloneOrg = this.jsonString(ev);
            this.cloneOrg.elementName += '_'+getTimeStamp();
            // return JSON.parse(org);// return 为插件自动克隆有数据共享问题，所以自定义添加元素
        },
        // 拖拽控件移动
        dragmove(ev) {
            ev = ev.to.parentNode;
            var bur = ev.getAttribute('substitution');
            // 控件列表内不允许互换位置
            if (bur=='true') return false;
            return true;
        },
        // 拖拽排序移动
        dragmoves(ev) {          
            ev = ev.to.parentNode;
            var bur = ev.getAttribute('substitution');
            // 控件列表内不允许互换位置
            if (bur=='true') return false;
            return true;
        },
        // 拖拽控件结束
        dragend(ev) {
            // 鼠标是否在元素列表页释放，否不进行拷贝
            var bur = ev.to.parentNode.getAttribute('substitution');
            if (bur=='true') return;
            // 添加控件
            this.elementList.splice(ev.newIndex, 0, this.cloneOrg);
            // 元素更新（处理元素数组变化时产生数据不对应问题）
            this.elementUpdata();
            this.$nextTick(() => {
                // 重新聚焦选中索引
                this.elActiveIndex = ev.newIndex;
                // console.log(this.elActiveIndex, 'this.elActiveIndex');
                // 重新开启移入聚焦
                this.elMoveBoolean = true;
            });
        },
        // 拖拽排序结束
        dragends(ev) {
            // 控件排序
            if (ev.newIndex == ev.oldIndex) return;
            var org = this.jsonString(this.elementList[ev.oldIndex]);
            this.elementList.splice(ev.oldIndex, 1);
            this.elementList.splice(ev.newIndex, 0, org);
            // 元素更新（处理元素数组变化时产生数据不对应问题）
            this.elementUpdata();
            this.$nextTick(() => {
                // 重新聚焦选中索引
                this.elActiveIndex = ev.newIndex;
                // 重新开启移入聚焦
                this.elMoveBoolean = true;
            });
        },
        // 删除元素
        elementDelete(index) {
            index = Number(index);
            // 删除对应元素
            this.elementList.splice(index, 1);           
            // 元素更新（处理元素数组变化时产生数据不对应问题）
            this.elementUpdata();
            // 重新聚焦选中索引
            if(index <= this.elActiveIndex){
                this.elActiveIndex = index<this.elActiveIndex ? index : index-1;
                this.elActiveIndex = this.elActiveIndex<0 ? 0 : this.elActiveIndex;
            };
        },
        // 元素更新（处理元素数组变化时产生数据不对应问题）
        elementUpdata() {
            // 存值-否则拖拽插件会丢失数据         
            var allOrg = [];
            this.elementList.map(item => {
                allOrg.push(this.jsonString(item));
            });
            // 刷新控件-处理输入值丢失问题
            this.$nextTick(() => {
                var len = this.$refs.elementItem.length;
                for(var i=0;i<len;i++){
                    // console.log(i, allOrg[i].defaultFillIn, 'allOrg[i]');
                    this.$refs.elementItem[i].setsetFormValue(allOrg[i]);
                };
            });
        },
        // 修改页回调信息
        modifyCallback(name, org) {
            // console.log(name, org, this.elActiveIndex);
            this.$set(this.elementList[this.elActiveIndex], name, org);
        },
        // 修改表单填写值
        setFormValue(index, org) {
            // console.log(index, org, this.elementList[index]);
            this.$set(this.elementList[index], 'defaultFillIn', org);
        },
        // 表单校验
        formCheck() {
            var len = this.$refs.elementItem.length;
            for(var i=0;i<len;i++){
                this.$refs.elementItem[i].formCheck();
            };
        },
        // 表单重置
        formReset() {
            var len = this.$refs.elementItem.length;
            for(var i=0;i<len;i++){
                this.$refs.elementItem[i].formReset();
            };
        },
        // 表单保存
        preservation() {
            // console.log(this.elementItem, 'this.elementItem');
            return {
                uiFlag: this.uiFlag,
                uiName: this.uiName,
                uiId: this.elementItem.uiId,
                elements: this.elementList
            };
        },
        // 生成模板
        templateGeneration(index) {
            this.$parent.templateGeneration(this.pageElement[index]);
        }
    },
};
</script>

<style lang="scss" scoped>
.inElPage{
    height: calc( 100vh - 53px );
    display: flex;
    .container_left,
    .container_center,
    .container_right{
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .container_left{
        width: 260px;
        border-right: 1px solid #f1e8e8;
        padding: 15px;
        &>.title{
            font-size: 14px;
            color: #404244;
            font-weight: bold;
            &.title1{
                margin-top: 20px;
            }
        }
        &>.content{
            padding: 15px 0 0 0;
            &>div{
                width: 100%;
                display: flex;
                flex-wrap: wrap;         
            }
            .control_item{
                width: 110px;
                margin: 0 0 10px 0;
                padding: 4px 12px;
                font-size: 12px;
                line-height: 32px;
                color: #303233;
                text-align: center;
                border-radius: 4px;
                background: #f6f7ff;
                border: 1px dashed #f6f7ff;
                display: flex;
                cursor: move;
                &:hover{
                    color: #7F8CEF;
                    border: 1px dashed #7F8CEF;
                }
                &.control_item_odd{
                    margin-right: 9px;
                }
                i{
                    width: 14px;
                    text-align: right;
                    margin: 0 8px 0 0;
                    font-size: 14px;
                    transform: translate(0, 0px);
                }
                span{
                    padding: 0 0 0 0;
                }
            }
        }
    }
    .container_center{
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #409EFF;
        .center_function{
            height: 51px;
            padding: 5px 0 5px 0;
            border-bottom: 1px solid #f1e8e8;
            display: flex;
            .title{
                width: 150px;
                line-height: 40px;
                text-align: left;
                font-weight: 600;
                padding: 0 0 0 15px;
                color: #409EFF;
            }
            .inputText{
                display: flex;
                padding: 4px 0;
                margin-left: 15px;
                .content_item{
                    display: flex;
                    padding: 0 10px 0;
                    margin: 0 0 15px 0;
                    position: relative;
                }
                .from_title{
                    width: 85px;
                    line-height: 32px;
                    font-size: 14px;
                    padding: 0 8px 0 0;
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
                .from_tips{
                    position: absolute;
                    left: 90px;
                    top: -8px;
                    i{
                        cursor: pointer;
                        color: #F56C6C;
                    }
                }
            }
            .content{
                flex: 1;
                text-align: right;
                /deep/ button{
                    margin-right: 15px;
                    &.el-button--text{
                        color: #409EFF;
                    }
                    &:hover{
                        color: #409EFF;
                    }
                    i{
                        font-size: 18px;
                        transform: translate(0, 2px);
                    }
                }
            }
        }
        &>div:nth-of-type(2){           
            min-height: calc(100% - 151px);
            overflow-y: auto;
            padding: 15px 0 0 0;
        }
        /deep/ .control_item{
            height: 80px;
            width: 90%;
            margin: 0 auto 15px;
            border-radius: 4px;
            border-top: 3px solid #F56C6C;
            background: #f6f7ff;
            color: #f6f7ff;
        }
        .center_check{
            height: 100px;
            text-align: left;
            padding: 20px 8% 0;
        }
    }
    .container_right{
        width: 350px;
        border-left: 1px solid #f1e8e8;
        .title{
            line-height: 50px;
            color: #404244;
            font-size: 14px;
            font-weight: bold;
            padding: 0 15px;
            border-bottom: 1px solid #f1e8e8;
            margin-bottom: 20px;
            span{
                color: #409EFF;
            }
        }
    }
}
/deep/ .form_dialog{
    .el-dialog__header{
        border-bottom: 1px solid #f1e8e8;
        padding: 15px 20px;
    }
    .el-dialog__body{
        padding: 0;
    }
} 
</style>