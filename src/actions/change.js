/**
 * 更新创建项目弹窗显示状态
 * @param  {[type]} visible [description]
 * @return {[type]}         [description]
 */
export function changeCreateDialogVisible(visible) {
  return {
    type: 'CHANGE_CREATE_DIALOG_VISIBLE',
    visible,
  };
}


/**
 * 更新复制模板数据
 * @param  {[type]} data [description]
 * @return {[type]}         [description]
 */
export function changeCloneTemplateData(data) {
  return {
    type: 'CHANGE_CLONE_TEMPLATE_DATA',
    data,
  };
}


/**
 * 更新本地语言
 * @param  {[type]} locale [description]
 * @return {[type]}        [description]
 */
export function changeLocale(locale) {
  console.log("changeLocale______action_____", locale );
  return {
    type: 'CHANGE_LOCALE',
    locale,
  };
}
