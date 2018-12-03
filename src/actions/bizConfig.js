import $ from '../lib/fetch';


/**
 * 删除业务线配置项
 * @type {String}
 */
export function deleteBizConfig(id) {
  return () => {
    return $.fetchJSON(`/bizConfig/delete?id=${id}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then(res => Promise.resolve(res));
  };
}


/**
 * 获取业务线配置项详情
 */
export function fetchBizConfigDetail(id) {
  return () => {
    return $.fetchJSON(`/bizConfig/get?id=${id}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then(res => Promise.resolve(res));
  };
}


/**
 * 获取业务线配置项列表
 */
export function fetchBizConfigList(id) {
  return () => {
    return $.fetchJSON(`/bizConfig/getByBizLineId?bizLineId=${id}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then(res => Promise.resolve(res));
  };
}


/**
 * 保存业务线配置项
 * @param  {[type]} options [description]
 */
export function saveBizConfig(options) {
  return () => {
    return $.fetchJSON('bizConfig/save', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: options,
    }).then(res => Promise.resolve(res));
  };
}
