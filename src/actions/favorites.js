import $ from '../lib/fetch';

/**
 * 添加收藏
 * @param  {[type]} options [description]
 * @return {[type]}        [description]
 */
export function addFavorites(options) {
  return () => {
    return $.fetchJSON('/favorites/add', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: options,
    }).then(res => Promise.resolve(res));
  };
}


/**
 * 取消收藏
 * @param  {[type]} options [description]
 * @return {[type]}        [description]
 */
export function deleteFavorites(options) {
  return () => {
    return $.fetchJSON('/favorites/delete', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: options,
    }).then(res => Promise.resolve(res));
  };
}


/**
 * 分页查询收藏列表
 * @param  {[type]} options [description]
 * @return {[type]}        [description]
 */
export function fetchFavoritesList(options) {
  return dispatch => {
    return $.fetchJSON(`/favorites/query?pageNumber=${options.pageNumber}&pageSize=30&user=${options.user}&dataType=${options.dataType}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then(res => dispatch({ type: 'FETCH_FAVORITES_LIST', data: res.data }));
  };
}
