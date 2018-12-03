/**
 * 分页查询收藏列表
 */
function fetchFavoritesList(data = [], action) {
  switch (action.type) {
    case 'FETCH_FAVORITES_LIST':
      return [].concat(action.data);
    default:
      return data;
  }
}

export default { fetchFavoritesList };
