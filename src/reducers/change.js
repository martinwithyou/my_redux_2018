import MCMS from '@alife/mcms_next-ubanner_chumu';

/**
 * 更新创建项目弹窗显示状态
 */
function changeCreateDialogVisible(visible = false, action) {
  switch (action.type) {
    case 'CHANGE_CREATE_DIALOG_VISIBLE':
      return action.visible;
    default:
      return visible;
  }
}


/**
 * 更新复制模板数据
 */
function changeCloneTemplateData(data = null, action) {
  switch (action.type) {
    case 'CHANGE_CLONE_TEMPLATE_DATA':
      return action.data;
    default:
      return data;
  }
}


/**
 * 更新本地语言
 */
function changeLocale(locale = 'zh-cn', action) {
  const toString = Object.prototype.toString;
  // 特殊处理
  switch (action.type) {
    case 'CHANGE_LOCALE':
    console.log("MCMS[action.locale]____reducer_____", MCMS[action.locale] );
      return toString.call(action.locale) === '[object String]' ? MCMS[action.locale] : action.locale;
    default:
      return toString.call(locale) === '[object String]' ? MCMS[locale] : locale;
  }
}

export default { changeCreateDialogVisible, changeCloneTemplateData, changeLocale };
