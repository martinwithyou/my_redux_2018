import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { Select, Dialog, Button, Icon } from '@alife/next';
import '../../css/editor/dialog';

export default class MultiSizeDialog extends React.Component {
  static contextTypes = {
    actions: PropTypes.object,
  };
  static propTypes = {
    i18n: PropTypes.object,
    handle: PropTypes.func,
    bizLines: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = { loading: false, bizConfigs: [], selectConfig: null, disabled: true, selectedSize: [] };

    /**
     * 切换业务线
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    this.handleChangeBizLine = value => {
      this.context.actions.fetchBizConfigList(value).then(res => {
        if (res && res.length) {
          const newBizConfigs = res.map(item => {
            const config = JSON.parse(item.config);
            config.sizeList = this.reform(config.sizeList);
            return { label: item.name, value: item.id, sizeList: config.sizeList };
          });
          this.setState({ bizConfigs: newBizConfigs, selectConfig: newBizConfigs[0].value, disabled: false, selectedSize: [] });
        } else {
          this.setState({ bizConfigs: [], selectConfig: null, disabled: true, selectedSize: [] });
        }
      });
    };

    /**
     * 交互定位列表中的尺寸
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    this.handleChangeBizConfig = value => {
      const target = $(`#${value}`);
      const pos = target.offset().top;
      $('.before-list').animate({ scrollTop: ($('.before-list').scrollTop() + pos) - 320 }, 1000);
      this.setState({ selectConfig: value });
    };


    /**
     * 选择尺寸
     * @param  {[type]} select [description]
     * @return {[type]}       [description]
     */
    this.handleClickSelectSize = select => {
      const { bizConfigs, selectedSize } = this.state;
      for (const biz of bizConfigs) {
        if (select.label === biz.label) {
          for (const size of biz.sizeList) {
            if (select.value === size.value) {
              size.selected = true;
              selectedSize.push(size.value);
            }
          }
          break;
        }
      }
      this.setState({ bizConfigs, selectedSize });
    };


    this.handleClickCancelSelectSize = cancel => {
      const { bizConfigs, selectedSize } = this.state;
      for (const biz of bizConfigs) {
        if (cancel.label === biz.label) {
          for (const size of biz.sizeList) {
            if (cancel.value === size.value) {
              size.selected = false;
              selectedSize.forEach((value, index) => {
                if (value === cancel.value) {
                  selectedSize.splice(index, 1);
                }
              });
            }
          }
          break;
        }
      }
      this.setState({ bizConfigs, selectedSize });
    };

    this.handleConfirm = () => {
      this.handle(this.state.selectedSize);
    };

    this.handleCancel = () => this.handle();
  }

  reform(arr) {
    // 升序
    arr.sort((a, b) => Number(a.split('x')[0]) - Number(b.split('x')[0]));
    return arr.map(item => {
      return { selected: false, value: item };
    });
  }

  get i18n() {
    return this.props.i18n;
  }

  get handle() {
    return this.props.handle;
  }

  get bizLines() {
    return this.props.bizLines;
  }

  get beforeChildren() {
    const elements = [];
    const { bizConfigs } = this.state;
    if (bizConfigs.length) {
      for (const biz of bizConfigs) {
        const children = [];
        for (const size of biz.sizeList) {
          if (!size.selected) {
            children.push(
              <li key={size.value} onClick={() => this.handleClickSelectSize({ label: biz.label, value: size.value })}>{size.value}<Icon type='arrow-right' size='xxs' /></li>
            );
          }
        }
        if (children.length) {
          elements.push(
            <div className='biz-wrap' key={biz.value} id={biz.value}>
              <label className='biz-label'>{biz.label}</label>
              <ul>{children}</ul>
            </div>
          );
        }
      }
    }
    return <div className='before-list'>{elements}</div>;
  }


  get afterChildren() {
    const elements = [];
    const { bizConfigs } = this.state;
    if (bizConfigs.length) {
      for (const biz of bizConfigs) {
        const children = [];
        for (const size of biz.sizeList) {
          if (size.selected) {
            children.push(
              <li key={size.value} onClick={() => this.handleClickCancelSelectSize({ label: biz.label, value: size.value })}>{size.value}<Icon type='close' size='xxs' /></li>
            );
          }
        }
        if (children.length) {
          elements.push(
            <div className='biz-wrap' key={biz.value} id={biz.value}>
              <label className='biz-label'>{biz.label}</label>
              <ul>{children}</ul>
            </div>
          );
        }
      }
    }
    return <div className='after-list'>{elements}</div>;
  }

  get footer() {
    return (
      <div className='action-wrapper'>
        <Button type='primary' onClick={this.handleConfirm}>确定</Button>
        <Button type='secondary' onClick={this.handleCancel}>取消</Button>
      </div>
    );
  }

  render() {
    const { bizConfigs, selectConfig, disabled, selectedSize } = this.state;
    return (
      <Dialog visible title='尺寸选择' footerAlign='center' className='multisize-dialog' footer={this.footer} closeable={false}>
        <div className='before-choose'>
          <p className='title'>请选择</p>
          <div className='options'>
            <Select
              placeholder='业务线'
              dataSource={this.bizLines}
              onChange={this.handleChangeBizLine}
            />
            <Select
              placeholder='尺寸配置项'
              value={selectConfig}
              disabled={disabled}
              dataSource={bizConfigs}
              onChange={this.handleChangeBizConfig}
            />
          </div>
          <p className='title other'>尺寸列表</p>
          {this.beforeChildren}
        </div>
        <div className='after-choice'>
          <p className='title'>{`已选择${selectedSize.length}个`}</p>
          {this.afterChildren}
        </div>
      </Dialog>
    );
  }
}
