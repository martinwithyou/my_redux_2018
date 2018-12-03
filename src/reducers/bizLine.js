/**
 * 获取所有业务线列表
 */

function fetchBizLineList(data = [], action) {
  switch (action.type) {
    case 'FETCH_BIZLINE_LIST': {
      return action.data.map(item => {
        return { label: item.name, value: String(item.id) };
      });
    }
    default:
      return data;
  }
}

export default { fetchBizLineList };
