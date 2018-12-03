import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions';
import FavoritesList from '../../components/detail/favoritesList';

class FavoritesListContainer extends React.Component {
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
    return <FavoritesList {...this.props} />;
  }
}

const mapStateToProps = state => ({
  i18n: state.changeLocale,
});
export default connect(mapStateToProps)(FavoritesListContainer);
