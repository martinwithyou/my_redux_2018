import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions';
import Editor from '../../components/editor';

class EditorContainer extends React.Component {
  static childContextTypes = {
    actions: PropTypes.object,
  };
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  getChildContext() {
    const boundActionCreators = bindActionCreators(actionCreators.default, this.props.dispatch);
    return {
      actions: boundActionCreators,
    };
  }

  render() {
    return <Editor {...this.props} />;
  }
}

const mapStateToProps = state => ({
  i18n: state.changeLocale,
  template: state.fetchTemplateDetail,
});
export default connect(mapStateToProps)(EditorContainer);
