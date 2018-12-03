import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions';
import TemplateList from '../../components/detail/templateList';

class TemplateListContainer extends React.Component {
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
    return <TemplateList {...this.props} />;
  }
}

const mapStateToProps = state => ({
  i18n: state.changeLocale,
});
export default connect(mapStateToProps)(TemplateListContainer);
