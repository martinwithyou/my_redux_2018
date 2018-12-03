import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import '../../css/common/loading';

export default class Loading extends Component {

  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
  };

  get visible() {
    return this.props.visible;
  }

  get title() {
    return this.props.title;
  }

  get children() {
    return (
      <div className='cssload-container'>
        <div className='square'></div>
        <div className='square'></div>
        <div className='square last'></div>
        <div className='square clear'></div>
        <div className='square'></div>
        <div className='square last'></div>
        <div className='square clear'></div>
        <div className='square'></div>
        <div className='square last'></div>
        <p className='cssload-label'>{this.title}</p>
      </div>
    );
  }

  render() {
    return (
      <div className={classnames({ 'ubanner-cssload': true, visible: this.visible })}>
        {this.visible ? this.children : null}
      </div>
    );
  }
}
