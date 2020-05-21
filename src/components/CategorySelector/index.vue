<template>
  <el-form :inline="true" :model="cList" class="demo-form-inline">
    <el-form-item label="一级分类">
      <el-select v-model="cList.category1Id" placeholder="选择一级分类"  @change="handelcategory1List">
        <el-option :label="c.name" :value="c.id" v-for="c in category1List" :key="c.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select v-model="cList.category2Id" placeholder="选择二级分类" @change="handelcategory2List">
        <el-option :label="c.name" :value="c.id" v-for="c in category2List" :key="c.id" ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select v-model="cList.category3Id" placeholder="选择三级分类" @change="handelcategory3List">
         <el-option :label="c.name" :value="c.id" v-for="c in category3List" :key="c.id" ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'CategorySelector',
    data() {
      return {
        cList: {
          category1Id: '',
          category2Id: '',
          category3Id: '',
        },
        category1List:[],
        category2List:[],
        category3List:[]
      }
    },
    mounted(){
      this.getcategory1List()
    },
    methods:{
      async getcategory1List(){
        const result = await this.$API.category. getCategorys1()
        this.category1List = result.data
      },
      async handelcategory1List(category1Id){
        this.cList.category2Id =''
        this.category2List = []
        this.cList.category3Id = ''
        this.category3List = []

        this.$emit('categoryChange',{categoryId:category1Id,level:1})

        const result = await this.$API.category.getCategorys2(category1Id)
        this.category2List = result.data
      },
      async handelcategory2List(category2Id){
        this.cList.category3Id = ''
        this.category3List = []

        this.$emit('categoryChange',{categoryId:category2Id,level:2})

        const result = await this.$API.category.getCategorys3(category2Id)
        this.category3List = result.data
      },
      async handelcategory3List(category3Id){
        this.$emit('categoryChange',{categoryId:category3Id,level:3})
      }
    }
  }

</script>

<style>

</style>
