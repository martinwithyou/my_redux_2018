import $ from '../lib/fetch';


/**
 * 调用多尺寸
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export function genneratMulti(options) {
  return () => {
    return $.fetchJSON('/api/psd/genneratmulti', {
      method: 'POST',
      body: options,
    }).then(res => Promise.resolve(res));
  };
}

/**
 * 解析psd文件
 * @param  {[type]} file [description]
 * @return {[type]}          [description]
 */
export function parse(file) {
  const formData = new FormData();
  formData.append(file.name, file);
  return () => {
    return $.fetchJSON('/api/psd/parse', {
      method: 'POST',
      multipart: true,
      body: formData,
    }).then(res => Promise.resolve(res));
  };
}

/**
 * 上传本地图片返回CDN链接
 * @param  {[type]} base64 [description]
 * @return {[type]}        [description]
 */
export function uploadImage(base64) {
  return () => {
    return $.fetchJSON('/api/psd/uploadImage', {
      method: 'POST',
      body: { data: base64 },
    });
  };
}

/**
 * 模板合图
 * @param  {[type]} templateData [description]
 * @return {[type]}              [description]
 */
export function imageCompose(templateData) {
  return () => {
    return $.fetchJSON('/api/psd/imageCompose', {
      method: 'POST',
      body: templateData,
    });
  };
}


/**
 * 根据工号查询用户信息
 * @param  {[type]} empId [description]
 * @return {[type]}        [description]
 */
export function getUserByEmpId(empId) {
  return () => {
    return $.fetchJSON(`/api/buc/getUserById?empId=${empId}`, {
      method: 'GET',
    }).then(res => Promise.resolve(res));
  };
}

/**
 * 根据工号查询用户信息
 * @param  {[type]} empIds [description]
 * @return {[type]}        [description]
 */
export function findUsersByIds(empIds) {
  return () => {
    return $.fetchJSON(`/api/buc/findUsersByIds?empIds=${empIds}`, {
      method: 'GET',
    }).then(res => Promise.resolve(res));
  };
}


/**
 * 根据工号查询用户信息
 * @param  {[type]} keyValue [description]
 * @return {[type]}        [description]
 */
export function searchByKeyWord(keyValue) {
  return () => {
    return $.fetchJSON(`/api/buc/searchByKeyWord?keyWord=${keyValue}`, {
      method: 'GET',
    }).then(res => Promise.resolve(res));
  };
}
