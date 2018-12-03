import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions';
import WaterFall from '../../components/common/waterfall';

class WaterFallContainer extends React.Component {
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
    return <WaterFall {...this.props} />;
  }
}

const mapStateToProps = state => ({
  list: state.generalListQuery,
});
export default connect(mapStateToProps)(WaterFallContainer);
