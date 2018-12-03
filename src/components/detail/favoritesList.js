import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from '@alife/next';
import WaterFall from '../../containers/common/waterfall';


const { Group: RadioGroup } = Radio;

export default class FavoritesList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    actions: PropTypes.object,
  };
  static propTypes = {
    i18n: PropTypes.object,
    empId: PropTypes.string,
  };


  constructor(props) {
    super(props);

    this.state = { selected: 'PROJECT' };

    this.handleChange = value => this.setState({ selected: value });
  }

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
    const { selected } = this.state;
    const options = { columnWidth: selected === 'PROJECT' ? 285 : 400 };
    const params = { user: this.empId, dataType: selected };
    const handle = this.context.actions.fetchFavoritesList;
    return (
      <div className='favorites-list'>
        <div className='group-actions'>
          <RadioGroup shape='button' size='large' value={selected} onChange={this.handleChange}>
            <Radio value='PROJECT'>项目</Radio>
            <Radio value='TEMPLATE'>模板</Radio>
          </RadioGroup>
        </div>
        <WaterFall
          handle={handle}
          params={params}
          masonry={options}
        />
      </div>
    );
  }
}
