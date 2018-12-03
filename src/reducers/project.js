
/**
 * 根据工号分页查询用户(创建|参与)的项目列表
 */
function fetchProjectList(data = [], action) {
  switch (action.type) {
    case 'FETCH_PROJECT_LIST':
      return [].concat(action.data);
    default:
      return data;
  }
}

/**
 * 根据项目ID查询项目详情
 */
export function fetchProjectDetail(data = null, action) {
  switch (action.type) {
    case 'FETCH_PROJECT_DETAIL':
      return Object.assign({}, action.data);
    default:
      return data;
  }
}


export function fetchLoggedUserProjectList(data = [], action) {
  switch (action.type) {
    case 'FETCH_LOGGED_USER_PROJECT_LIST':
      return [].concat(action.data);
    default:
      return data;
  }
}

export default { fetchProjectList, fetchProjectDetail, fetchLoggedUserProjectList };

