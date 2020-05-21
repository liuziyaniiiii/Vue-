import requset from '@/utils/request'

//GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export default{
  getList(category1Id,category2Id,category3Id){
    return requset(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },

  //删除属性 DELETE /admin/product/deleteAttr/{attrId}
  removeList(id){
    return requset.delete(`/admin/product/deleteAttr/${id}`)
  },
  // GET /admin/product/getAttrValueList/{attrId}
  getValueList(attrId){
    return requset(`/admin/product/getAttrValueList/${attrId}`)
  },

  /*
  添加/更新属性
  POST /admin/product/saveAttrInfo
  attrInfo如果有id那就是更新, 如果没有id那就是添加
  */
  addOrUpdate (attrInfo) {
    return request.post('/admin/product/saveAttrInfo', attrInfo)
  }
}

