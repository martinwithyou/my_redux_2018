/**
 * 根据模板ID查询模板详情
 */
function fetchTemplateDetail(data = null, action) {
  switch (action.type) {
    case 'FETCH_TEMPLATE_DETAIL':
      return Object.assign({}, action.data);
    default:
      return data;
  }
}


/**
 * 根据条件分页查询模板列表
 */
function fetchTemplateList(data = [], action) {
  switch (action.type) {
    case 'FETCH_TEMPLATE_LIST':
      return [].concat(action.data);
    default:
      return data;
  }
}

export default { fetchTemplateDetail, fetchTemplateList };
