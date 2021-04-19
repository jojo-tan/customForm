<template>
    <div id="app">
        <!-- 头部 -->
        <header id="header">
            <!-- <el-button type="primary" plain @click="toMenu('/menu/childrenOne')">动态路由一</el-button>
            <el-button type="primary" plain @click="toMenu('/menu/childrenTwo')">动态路由二</el-button> -->
        </header>
        <!-- 路由容器 -->
        <section id="content">
            <router-view />
        </section>
        <!-- 底部 -->
        <footer id="footer"></footer>
    </div>
</template>

<script>
export default {
    name: "App",
    components: {},
    data() {
        return {};
    },
    computed: {},
    mounted() {},
    methods: {
        // 动态路由调转
        toMenu(str) {
            this.$router.push({
                path: str,
                msg: '一些信息',
            });
        },
    },
};
</script>

<style lang="scss">
@import url("~@/assets/css/public/int.css");
#header {
    // margin: 30px 0 0 0;
    // padding: 0 40px;
}
</style>
