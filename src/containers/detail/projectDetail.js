import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions';
import ProjectDetail from '../../components/detail/projectDetail';

class ProjectDetailContainer extends React.Component {
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
    return <ProjectDetail {...this.props} />;
  }
}

const mapStateToProps = state => ({
  i18n: state.changeLocale,
  detail: state.fetchProjectDetail,
});
export default connect(mapStateToProps)(ProjectDetailContainer);
