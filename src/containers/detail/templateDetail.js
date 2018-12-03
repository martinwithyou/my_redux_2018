import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions';
import TemplateDetail from '../../components/detail/templateDetail';

class TemplateDetailContainer extends React.Component {
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
    return <TemplateDetail {...this.props} />;
  }
}

const mapStateToProps = state => ({
  i18n: state.changeLocale,
  detail: state.fetchTemplateDetail,
});
export default connect(mapStateToProps)(TemplateDetailContainer);
