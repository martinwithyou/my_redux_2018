import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from '@alife/next';
import WaterFall from '../../containers/common/waterfall';
import AddCard from '../common/addCard';

const { Group: RadioGroup } = Radio;
export default class ProjectList extends React.Component {
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

    this.state = { selected: 'owner' };

    this.handleChange = value => this.setState({ selected: value });
  }

  get i18n() {
    return this.props.i18n;
  }

  /**
   * 当前登陆用户的工号
   * @return {[type]} [description]
   */
  get myWorkId() {
    return window.user.workid;
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
    const options = { columnWidth: 285 };
    const params = { [selected]: this.empId };
    const handle = this.context.actions.fetchProjectList;
    const isOthers = this.empId !== this.myWorkId;
    const otherCard = <AddCard key='addCard' type='project' i18n={this.i18n} />;
    return (
      <div className='project-list'>
        {
          !isOthers && <div className='group-actions'>
                        <RadioGroup shape='button' size='large' value={selected} onChange={this.handleChange}>
                          <Radio value='owner'>我创建的</Radio>
                          <Radio value='member'>我参与的</Radio>
                        </RadioGroup>
                       </div>
        }
        <WaterFall
          handle={handle}
          params={params}
          masonry={options}
          otherCard={isOthers ? null : otherCard}
        />
      </div>
    );
  }
}
