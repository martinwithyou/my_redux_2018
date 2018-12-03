import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import _ from 'underscore';
import Masonry from 'react-masonry-component';
import Card from '../../containers/common/card';

export default class WaterFall extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    actions: PropTypes.object,
  };
  static propTypes = {
    list: PropTypes.array,        // 列表数据
    params: PropTypes.object,     // 接口参数
    handle: PropTypes.func,       // 获取数据接口
    masonry: PropTypes.object,    // 瀑布流配置项
    otherCard: PropTypes.object,  // 特殊的卡片
  };

  constructor(props) {
    super(props);

    this.state = { pageNumber: 1, hasMore: false, data: new Map() };

    this.handleScroll = () => {
      if (this.state.hasMore) {
        const threshold = 250;
        const dis = $(document).height() - ($(window).scrollTop() + $(window).height());
        if (dis < threshold) {
          this.setState({ hasMore: false, pageNumber: this.state.pageNumber + 1 });
          this.loadMoreTemplateData();
        }
      }
    };

    /**
     * 子元素删除更新布局
     * @return {[type]} [description]
     */
    this.handleRemoveItem = id => {
      const newData = this.state.data;
      newData.delete(`${id}`);
      this.setState({ data: newData });
    };

    this.loadMoreTemplateData();
  }

  componentDidMount() {
    this.attachScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { list, params } = nextProps;
    if (list && list.length) {
      const { data } = this.state;
      /**
       * 由于Map的遍历顺序是按照对象的插入顺序返回的
       * 但是为项目创建模板时，新创建的模板数据是后插入的，因此会显示在列表的最后
       * 所以这里判断模板的创建时间确认是否重置Map，保证新创建的模板展示在列表最前面
       */
      const newData = data.size > 0 && data.get(this.lastId).gmtCreate < list[0].gmtCreate ? new Map() : data;
      for (const item of list) {
        newData.set(`${item.id}`, item);
        this.lastId = `${item.id}`;
      }
      this.attachScrollListener();
      this.setState({ data: newData, hasMore: true });
    } else {
      this.detachScrollListener();
      this.setState({ hasMore: false });
    }
    // 检测请求接口参数是否发生更新
    if (!_.isEqual(params, this.params)) {
      this.setState({ pageNumber: 1, data: new Map() });
      // setState异步的原因，这里直接传入参数触发请求
      this.loadMoreTemplateData(Object.assign({ pageNumber: 1 }, params));
    }
  }

  componentWillUnmount() {
    this.setState({ pageNumber: 1, data: new Map() });
    this.detachScrollListener();
  }

  loadMoreTemplateData(params) {
    this.detachScrollListener();
    this.handle(params ? params : Object.assign({ pageNumber: this.state.pageNumber }, this.params));
  }

  attachScrollListener() {
    $(window).on('scroll', this.handleScroll);
  }

  detachScrollListener() {
    $(window).off('scroll', this.handleScroll);
  }

  get params() {
    return this.props.params;
  }

  get handle() {
    return this.props.handle;
  }

  get options() {
    return Object.assign(this.props.masonry, { gutter: 28, fitWidth: true });
  }

  get otherCard() {
    return this.props.otherCard;
  }

  get children() {
    const { data } = this.state;
    const elements = [];
    data.forEach(value => {
      elements.push(<Card key={value.id} width={this.options.columnWidth} removeItem={this.handleRemoveItem} data={value} />);
    });
    if (this.otherCard) elements.unshift(this.otherCard);
    return elements;
  }

  render() {
    return (
      <Masonry className='gallery' options={this.options}>
        {this.children}
      </Masonry>
    );
  }
}
