
/**
 * [split description]
 * @param  {[type]} size [description]
 * @return {[type]}      [description]
 */
export function split(size) {
  size = size.split('x');
  return { width: Number(size[0]), height: Number(size[1]) };
}

/**
 * [format description]
 * @param  {[type]} datetime [description]
 * @return {[type]}          [description]
 */
export function format(datetime) {
  const date = new Date(datetime);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/**
 * [aspectRatio description]
 * @param  {[type]} w [description]
 * @param  {[type]} h [description]
 * @return {[type]}   [description]
 */
export function aspectRatio(w, h) {
  const ratio = w / h;
  const rh = 16 / 9;
  // 竖幅
  if (h > w) return '竖幅';
  // 极小矩形
  if (w <= 200) return '极小矩形';
  // 矩形
  if (ratio >= 1 && ratio < rh) return '矩形';
  // 横幅
  if (ratio > rh && ratio < 7) return '横幅';
  // 长横幅
  if (ratio > 7) return '长横幅';
}

