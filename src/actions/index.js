import * as bizConfig from './bizConfig';
import * as bizLine from './bizLine';
import * as internal from './internal';
import * as change from './change';
import * as favorites from './favorites';
import * as project from './project';
import * as template from './template';

export default {
  ...bizConfig,
  ...bizLine,
  ...internal,
  ...change,
  ...favorites,
  ...project,
  ...template,
};
