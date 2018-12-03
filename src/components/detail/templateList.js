import React from 'react';
import PropTypes from 'prop-types';
import WaterFall from '../../containers/common/waterfall';

export default class TemplateList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    actions: PropTypes.object,
  };
  static propTypes = {
    i18n: PropTypes.object,
    empId: PropTypes.string,
  };

  get i18n() {
    return this.props.i18n;
  }

  /**
   * 当前查询的用户工号
   * @return {[type]} [description]
   */
  get empId() {
    return this.props.empId;
  }

  render() {
    const options = { columnWidth: 400 };
    const params = { creator: this.empId };
    const handle = this.context.actions.fetchTemplateList;
    return (
      <WaterFall
        handle={handle}
        params={params}
        masonry={options}
      />
    );
  }
}
