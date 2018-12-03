import $ from '../lib/fetch';


/**
 * 删除Banner
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export function deleteBanner(options) {
  return () => {
    return $.fetchJSON('/template/deleteBanner', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: options,
    }).then(res => Promise.resolve(res));
  };
}


/**
 * 复制模板
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export function cloneTemplate(options) {
  return () => {
    return $.fetchJSON('/template/clone', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: options,
    }).then(res => Promise.resolve(res));
  };
}


/**
 * 删除模板
 * @param  {[type]} options [description]
 * @return {[type]}           [description]
 */
export function deleteTemplate(options) {
  return () => {
    return $.fetchJSON('/template/delete', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: options,
    }).then(res => Promise.resolve(res));
  };
}


/**
 * 下载模板
 * @param  {[type]} templateId [description]
 * @param  {[type]} fileName [description]
 * @return {[type]}           [description]
 */
// export function downloadTemplate(templateId, fileName) {
//   let downloadURL = `/template/download?ids=${templateId}`;
//   if (fileName) downloadURL += `&fileName=${fileName}`;
//   return () => $.fetch(downloadURL, { method: 'GET', mode: 'cors', credentials: 'include' });
// }


/**
 * 根据模板ID查询模板详情
 * @param  {[type]} templateId [description]
 * @return {[type]}            [description]
 */
export function fetchTemplateDetail(templateId) {
  return dispatch => {
    return $.fetchJSON(`/template/fetch?id=${templateId}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then(detail => dispatch({ type: 'FETCH_TEMPLATE_DETAIL', data: detail }));
  };
}


/**
 * 根据条件分页查询模板列表
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export function fetchTemplateList(options) {

  console.log("fetchTemplateList______", options );
  
  let url = `/template/query?pageNumber=${options.pageNumber}&pageSize=30`;
  if (options.creator) url += `&creator=${options.creator}`;
  if (options.bizLineId) url += `&bizLineId=${options.bizLineId}`;
  if (options.projectId) url += `&projectId=${options.projectId}`;
  return dispatch => {
    return $.fetchJSON(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then(res => dispatch({ type: 'FETCH_TEMPLATE_LIST', data: res.data }));
  };
}


/**
 * 保存或者创建模板
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export function saveTemplate(options) {
  options.meta = JSON.stringify(options.meta);
  if (options.banners && options.banners.length) {
    options.banners = JSON.stringify(options.banners);
  }
  return () => {
    return $.fetchJSON('/template/save', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: options,
    }).then(res => Promise.resolve(res));
  };
}

