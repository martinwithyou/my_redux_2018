import fetch from 'isomorphic-fetch';
import { Message } from '@alife/next';
import jquery from 'jquery';

const $ = {};

function status(response) {
  if (!response.ok) {
    const error = new Error(response.statusText || response.status);
    error.response = response;
    errorms({ code: response.status });
    throw error;
  }
  return response;
}

function json(response) {
  return response.json();
}

function text(response) {
  return response.text();
}

function errorms(response) {
  let msg;
  switch (response.code) {
    case 655:
      msg = '项目名称已经存在';
      break;
    case 413:
      msg = '上传的图片大小超出5MB限制';
      break;
    default:
      msg = response.errmsg || '系统异常';
      break;
  }
  Message.error({ duration: 2000, content: msg, hasMask: true });
}

function formatOptions(options) {
  options = options || {};
  options.headers = options.headers || {};
  options.credentials = options.credentials ? options.credentials : 'same-origin';
  return options;
}

function getCookie(key) {
  const cookies = document.cookie.split(/ *; */);
  for (const cookie of cookies) {
    const parts = cookie.split('=');
    if (key === parts[0]) {
      return parts[1];
    }
  }
  return '';
}

$.fetch = function(url, options) {
  options = formatOptions(options);
  if (options.mode === 'cors') url = `${window.fetchURL}${url}`;
  return fetch(url, options).then(status);
};

$.fetchText = function(url, options) {
  options = formatOptions(options);
  return fetch(url, options).then(status).then(text);
};

$.fetchJSON = function(url, options) {
  options = formatOptions(options);
  options.headers.Accept = 'application/json';

  if (options.mode === 'cors') {
    url = `${window.fetchURL}${url}`;
  } else {
    // 自动注入ctoken
    // 内置了安全插件 egg-security，提供了一些默认的安全实践
    options.headers['x-csrf-token'] = getCookie('ctoken');
  }

  if (options.body) {
    if (typeof options.body === 'object') {
      if (options.multipart !== true) {
        // 针对POST请求处理参数, cors跨域模式不支持application/json
        if (options.mode === 'cors' && options.method === 'POST') {
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.body = jquery.param(options.body);
        } else {
          options.headers['Content-Type'] = 'application/json';
          options.body = JSON.stringify(options.body);
        }
      }
    }
  }

  return fetch(url, options)
    .then(status)
    .then(json)
    .then(result => {
      if (!result.success) {
        errorms(result);
        throw new Error(result.errmsg);
      }
      return result.data;
    });
};

export default $;
