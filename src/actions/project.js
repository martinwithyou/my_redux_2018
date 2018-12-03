import $ from '../lib/fetch';

/**
 * 删除项目
 * @param  {[type]} projectId [description]
 * @return {[type]}           [description]
 */
export function deleteProject(projectId) {
  return () => {
    return $.fetchJSON('/project/delete', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: { id: projectId },
    }).then(res => Promise.resolve(res));
  };
}

/**
 * 下载项目
 * @param  {[type]} projectId [description]
 * @param  {[type]} fileName [description]
 * @return {[type]}           [description]
 */
// export function downloadProject(projectId, fileName) {
//   let downloadURL = `/project/download?id=${projectId}`;
//   if (fileName) downloadURL += `&fileName=${fileName}`;
//   return () => {
//     return $.fetchJSON(downloadURL, {
//       method: 'GET',
//       mode: 'cors',
//       credentials: 'include',
//     }).then(res => Promise.resolve(res));
//   };
// }


/**
 * 根据项目ID查询项目详情
 * @param  {[type]} projectId [description]
 * @return {[type]}           [description]
 */
export function fetchProjectDetail(projectId) {
  return dispatch => {
    return $.fetchJSON(`/project/getById?id=${projectId}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then(res => dispatch({ type: 'FETCH_PROJECT_DETAIL', data: res }));
  };
}


/**
 * 根据工号分页查询用户(创建|参与)的项目列表
 * @param  {[type]} empId [description]
 * @return {[type]}        [description]
 */
export function fetchProjectList(options) {

  console.log("fetchProjectList______", options );
  
  let queryURL = '/project/';
  // 参与的
  if (options.member) queryURL += `getByMember?member=${options.member}`;
  // 创建的
  if (options.owner) queryURL += `getByOwner?owner=${options.owner}`;
  return dispatch => {
    return $.fetchJSON(`${queryURL}&pageNumber=${options.pageNumber}&pageSize=30`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then(projects => dispatch({ type: 'FETCH_PROJECT_LIST', data: projects.data }));
  };
}


/**
 * 查询当前登录用户创建的项目列表
 * @param  {[type]} empId [description]
 * @return {[type]}        [description]
 */
export function fetchLoggedUserProjectList(options) {
  const queryURL = `/project/getByOwner?owner=${options.owner}`;
  return dispatch => {
    return $.fetchJSON(`${queryURL}&pageNumber=${options.pageNumber}&pageSize=30`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then(projects => dispatch({ type: 'FETCH_LOGGED_USER_PROJECT_LIST', data: projects.data }));
  };
}


/**
 * 保存或者创建项目
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export function saveProject(options) {
  return () => {
    return $.fetchJSON('/project/save', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: options,
    }).then(res => Promise.resolve(res));
  };
}


/**
 * 更新项目成员
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export function saveMembers(options) {
  options.members = JSON.stringify(options.members);
  return () => {
    return $.fetchJSON('/project/saveMembers', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: options,
    }).then(res => Promise.resolve(res));
  };
}
