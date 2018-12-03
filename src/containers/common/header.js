import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions';
import Header from '../../components/common/header';

class HeaderContainer extends React.Component {
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
    return <Header {...this.props} />;
  }
}

const mapStateToProps = state => ({
  i18n: state.changeLocale,
  createDialogVisible: state.changeCreateDialogVisible,
  cloneTemplateData: state.changeCloneTemplateData,
  bizLineList: state.fetchBizLineList,
  projects: state.fetchLoggedUserProjectList,
});
export default connect(mapStateToProps)(HeaderContainer);
