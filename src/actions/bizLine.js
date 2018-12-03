import $ from '../lib/fetch';

/**
 * 删除业务线信息
 * @type {String}
 */
export function deleteBizLine(id) {
  return () => {
    return $.fetchJSON(`/bizline/delete?id=${id}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then(res => Promise.resolve(res));
  };
}


/**
 * 获取业务线详情
 */
export function fetchBizLineDetail(id) {
  return () => {
    return $.fetchJSON(`/bizline/get?id=${id}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then(res => Promise.resolve(res));
  };
}

/**
 * 获取所有业务线列表
 */
export function fetchBizLineList() {
  return dispatch => {
    return $.fetchJSON('/bizline/list?pageSize=0', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then(res => dispatch({ type: 'FETCH_BIZLINE_LIST', data: res.data }));
  };
}

/**
 * 保存业务线信息
 * @param  {[type]} options [description]
 */
export function saveBizLine(options) {
  return () => {
    return $.fetchJSON('bizline/save', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: options,
    }).then(res => Promise.resolve(res));
  };
}
