import React from 'react';
import PropTypes from 'prop-types';
import { Select } from '@alife/next';
import WaterFall from '../../containers/common/waterfall';
import '../../css/home';

export default class Home extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    actions: PropTypes.object,
  };
  static propTypes = {
    bizLines: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = { bizLineId: '' };

    this.handleChangeBizLine = value => this.setState({ bizLineId: value });
  }

  get bizLines() {
    const newBizLines = [].concat(this.props.bizLines);
    newBizLines.unshift({ label: '所有业务线', value: '' });
    return newBizLines;
  }

  render() {
    const options = { columnWidth: 400 };
    const params = { bizLineId: this.state.bizLineId };
    const handle = this.context.actions.fetchTemplateList;

    return (
      <div className='ubanner-home'>
        <div className='search-bar'>
          <Select
            placeholder='所有业务线'
            hasBorder={false}
            dataSource={this.bizLines}
            onChange={this.handleChangeBizLine}
          />
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
