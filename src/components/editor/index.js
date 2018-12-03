import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Dialog } from '@alife/next';
import UEditor from '@ali/next-ubanner-editor';
import '@ali/next-ubanner-editor/dist/index.css';
import MultiSizeDialog from '../../containers/editor/dialog';
import Loading from '../common/loading';
import '../../css/editor';

export default class Editor extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    actions: PropTypes.object,
  };
  static propTypes = {
    i18n: PropTypes.object,
    location: PropTypes.object,
    template: PropTypes.object,
  };

  constructor(props, context) {
    super(props);

    this.state = { 
      template: null, 
      loadingVisible: false, 
      multisizeVisible: false, 
    };

    /**
     * 打开多尺寸配置面板
     * @return {[type]} [description]
     */
    this.handleOpenMultisizePanel = () => {
      const template = this.ueditor.template;
      if (template._deleteIds && template._deleteIds.length) {
        // 支持批量删除
        this.context.actions.deleteBanner({ id: template.id, bannerIds: template._deleteIds.join(',') });
        delete template._deleteIds;
      }
      this.setState({ multisizeVisible: true, template: Object.assign({}, template) });
    }

    /**
     * 多尺寸
     * @param  {[type]} selectSizes [description]
     * @return {[type]}             [description]
     */
    this.handleMultiSize = sizes => {
      const { template } = this.state;

      this.setState({ multisizeVisible: false });

      if (sizes && sizes.length) {
        this.setState({ loadingVisible: true });
        this.context.actions.genneratMulti({ template: template.meta, sizes }).then(res => {
          template.banners = template.banners || [];
          for (const s of sizes) {
            template.banners.push({
              meta: JSON.parse(res[s].template),
              template_id: this.id,
              size: s,
            });
          }
          // 模板合图
          this.context.actions.imageCompose(template).then(newTemplate => {
            // 保存模板数据
            this.context.actions.saveTemplate(newTemplate).then(() => {
              this.setState({ loadingVisible: false });
              this.context.actions.fetchTemplateDetail(this.id);
            });
          });
        });
      }

    };

    /**
     * 完成制作
     * @return {[type]} [description]
     */
    this.handleComplete = () => {
      this.setState({ loadingVisible: true });
      const template = this.ueditor.template;
      if (template._deleteIds && template._deleteIds.length) {
        this.context.actions.deleteBanner({ id: template.id, bannerIds: template._deleteIds.join(',') });
        delete template._deleteIds;
      }
      // 模板合图
      this.context.actions.imageCompose(template).then(newTemplate => {
        // 保存模板数据
        this.context.actions.saveTemplate(newTemplate).then(() => {
          this.setState({ loadingVisible: false });
          this.context.router.push({ pathname: '/detail/template', query: { id: this.id } });
        });
      });
    };

    context.actions.fetchTemplateDetail(this.id);
  }

  componentWillReceiveProps(nextProps) {
    const { template } = nextProps;
    template.meta = JSON.parse(template.meta);
    for (const banner of template.banners) {
      banner.meta = JSON.parse(banner.meta);
    }
    this.setState({ template });
  }

  get i18n() {
    return this.props.i18n;
  }

  /**
   * 模板id
   * @return {[type]} [description]
   */
  get id() {
    return this.props.location.query.id;
  }



          // <li className='item undo'>
          //   <p className='mark'>
          //     <i className='iconfont'>&#xe742;</i>
          //   </p>
          //   <p className='label'>撤销</p>
          // </li>
          // <li className='item restore'>
          //   <p className='mark'>
          //     <i className='iconfont'>&#xe749;</i>
          //   </p>
          //   <p className='label'>还原</p>
          // </li>
  get header() {
    return (
      <div className='editor-header'>
        <ul className='controls'>
          <li className='item' onClick={this.handleOpenMultisizePanel}>
            <p className='mark other'>
              <i className='iconfont'>&#xe748;</i>
            </p>
            <p className='label'>添加尺寸</p>
          </li>
          <li className='item action'>
            <Button ghost='dark' onClick={this.handleComplete}>完成制作</Button>
          </li>
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div className='ubanner-editor'>
        {this.header}
        <div className='editor-content'>
          {this.state.template && <UEditor 
            ref={node => this.ueditor = node} 
            template={this.state.template} 
            upload={this.context.actions.uploadImage} 
            hasSizeNav />}
        </div>
        <Loading visible={this.state.loadingVisible} title='数据保存中...' />
        {this.state.multisizeVisible && <MultiSizeDialog i18n={this.i18n} handle={this.handleMultiSize} />}
      </div>
    );
  }
}
