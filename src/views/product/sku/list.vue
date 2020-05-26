<template>
  <el-card>
    <el-table stripe border :data="skuList" v-loading="loading">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称"></el-table-column>
      <el-table-column prop="skuDesc" label="描述"></el-table-column>
      <el-table-column label="默认图片" width="150" align="center">
        <template slot-scope="{row}">
          <div class="info">
            <div class="pic">
              <img :src="row.skuDefaultImg" alt="商品图片" style="width:80px">
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)"></el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80"></el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="{row}">
          <HintButton title="上架" v-if="row.isSale==0"
          type="success" size="mini" icon="el-icon-top"
          @click="onSale(row.id)"/>
          <HintButton title="下架" v-if="row.isSale==1"
          type="warning" size="mini" icon="el-icon-bottom"
          @click="cancelSale(row.id)"/>
          <HintButton title="修改" type="info" size="mini" icon="el-icon-edit"/>
          <HintButton title="查看详情" type="primary" size="mini" icon="el-icon-info" @click="showSkuInfo(row.id)"/>
          <el-popconfirm :title="`确定删除${row.skuName}吗`" @onConfirm="deleteSku(row.id)">
            <HintButton slot="reference" title="删除" type="danger" size="mini" icon="el-icon-delete"/>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5,10,20,30,40,50]"
      style="padding: 30px 0; text-align: center;"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getSkuList"
      @size-change="changeSize"
    >

    </el-pagination>

    <el-drawer
      :visible.sync="isShowSkuInfo"
      direction="rtl"
      :withHeader="false"
      size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="18">
          <el-tag type="success" style="margin-right: 5px" v-for="value in skuInfo.skuAttrValueList" :key="value.id">
              {{value.attrId + '-' + value.valueId}}
          </el-tag>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">销售属性</el-col>
        <el-col :span="18">
          <el-tag type="success" style="margin-right: 5px" v-for="value in skuInfo.skuSaleAttrValueList" :key="value.id">
              {{value.id + '-' + value.saleAttrValueId}}
          </el-tag>
        </el-col>
      </el-row>

      <el-row >
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
           <el-carousel class="img-carousel" trigger="click" height="400px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script>
export default {
  name: 'SkuList',
  data(){
    return{
      skuList:[],
      loading:false,
      total:0,
      page:1,
      limit:10,
      skuInfo:{},
      isShowSkuInfo:false
    }
  },
  mounted(){
    this.getSkuList()
  },
  methods:{
    // 对指定的SKU进行上架的请求
    onSale(skuId){
      this.$API.sku.onSale(skuId).then(result =>{
        this.$message({
          type:'success',
          message:'上架成功!'
        })
        this.getSkuList(this.page)
      })
    },
    cancelSale(skuId){
      this.$API.sku.cancelSale(skuId).then(result =>{
        this.$message({
          type:'success',
          message:'下架成功'
        })
        this.getSkuList(this.page)
      })
    },
    // 获取指定页码的sku列表
    async getSkuList(page = 1){
      this.page = page
      this.loading = true
      const result = await this.$API.sku.getList(this.page,this.limit)
      this.skuList = result.data.records
      this.total = result.data.total
      this.loading = false
    },
    // 当页码发生改变时自动调用
    changeSize(size){
      this.limit = size
      this.getSkuList(1)
    },
    //查看sku详情
    async showSkuInfo(id){
      this.isShowSkuInfo = true
      const result = await this.$API.sku.get(id)
      this.skuInfo = result.data
    },
    // 删除sku
    async deleteSku(skuId){
      const result = await this.$API.sku.remove(skuId)
      if(result.code===200){
        this.$message({
          message:'删除SKU成功',
          type:'success'
        })
        this.getSkuList(1)
      }else{
        this.$message({
          message:'删除SKU失败',
          type:'error'
        })
      }

    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row {
    margin: 10px 5px;
    .el-col-5 {
      font-size: 16px;
      font-weight: bold;
      text-align: right;
      padding-right: 10px;
    }
  }

  /* 深度选择器 */
  /deep/ .el-carousel__container {
    height: 400px;
  }

  /deep/ .el-carousel__indicator.is-active {
    button {
      background-color: green;
    }
  }
  .img-carousel {
      width: 400px;
      border: 1px solid #ccc;
      img {
        width: 100%;
        height: 100%;
      }

      /deep/ .el-carousel__indicator {
        button {
          background-color: hotpink;
        }

        &.is-active {
          button {
            background-color: green;
          }
        }
      }
    }
</style>
