import '@alife/dpl-U-Banner2/index.css';
import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import { Router, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducer from './reducers';
import Header from './containers/common/header';
import './css/base';

const store = createStore(reducer, applyMiddleware(thunk, logger));
const errorLoading = error => { throw new Error(`Dynamic page loading failed: ${error}`); };
const loadRoute = callback => module => callback(null, module.default);

const app = ({ children }) => [ <Header key='header' />, <div className='page-main' key='children'>{children}</div> ];
app.propTypes = { children: PropTypes.object.isRequired };

const Routes = {
  path: '/',
  component: app,
  indexRoute: {
    getComponent(location, cb) {
        import('./containers/home')
            .then(loadRoute(cb))
            .catch(errorLoading);
    },
  },
  childRoutes: [
    {
      path: 'detail',
      getComponent(location, cb) {
        import('./containers/detail')
              .then(loadRoute(cb))
              .catch(errorLoading);
      },
    },
    {
      path: 'detail/project',
      getComponent(location, cb) {
        import('./containers/detail/projectDetail')
              .then(loadRoute(cb))
              .catch(errorLoading);
      },
    },
    {
      path: 'detail/template',
      getComponent(location, cb) {
        import('./containers/detail/templateDetail')
              .then(loadRoute(cb))
              .catch(errorLoading);
      },
    },
    {
      path: 'editor',
      getComponent(location, cb) {
        import('./containers/editor')
              .then(loadRoute(cb))
              .catch(errorLoading);
      },
    },
  ],
};

ReactDom.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={Routes} />
  </Provider>,
  document.getElementById('app'),
);
