import { combineReducers } from 'redux';
import bizLine from './bizLine';
import change from './change';
import favorites from './favorites';
import project from './project';
import template from './template';

function generalListQuery(data = [], action) {
  switch (action.type) {
    case 'FETCH_PROJECT_LIST':
      return [].concat(action.data);
    case 'FETCH_TEMPLATE_LIST':
      return [].concat(action.data);
    case 'FETCH_FAVORITES_LIST':
      return [].concat(action.data);
    default:
      return [];
  }
}

export default combineReducers({
  ...bizLine,
  ...change,
  ...favorites,
  ...project,
  ...template,
  generalListQuery,
});
