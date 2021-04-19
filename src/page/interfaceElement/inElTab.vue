<template>
    <div id="inElTab">
        <div 
        class="inElTab_item"
        v-for="(item, index) in tabList"
        :key="index"
        >
            <el-tag
            closable
            effect="plain"
            :type="tabList[index].Aindex==currentIndex?'':'info'"
            :index="index"
            @click="tabClick"
            @close="tabClose"
            >{{item.uiName}}</el-tag>
            <div class="from_tips" v-if="false">        
                <el-tooltip class="item" effect="dark" content="信息已变更，记得保存~" placement="bottom-start">
                    <i class="el-icon-warning"></i>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "inElTab",
    components: {},
    props: {
        tabList: { type: Array },
        currentIndex: { type: Number },
        pageChange: { type: Array },
    },
    data() {
        return {};
    },
    computed: {},
    created() {},
    mounted() {},
    methods: {
        // 点击
        tabClick(ev) {
            var index = ev.target.getAttribute('index');
            index = Number(index);
            // console.log(this.tabList[index].index);
            this.$emit("tab-click", this.tabList[index].Aindex);
        },
        // 删除
        tabClose(ev) {
            var index = ev.target.parentNode.getAttribute('index');
            index = Number(index);
            this.$emit("tab-close", index);
        }
    },
};
</script>

<style lang="scss" scoped>
#inElTab {
    .inElTab_item {
        cursor: pointer;
        display: inline-block;
        margin-right: 10px;
        position: relative;
        .from_tips{
            position: absolute;
            color: #E6A23C;
            top: -8px;
            right: -8px;
        }
    }
}
</style>