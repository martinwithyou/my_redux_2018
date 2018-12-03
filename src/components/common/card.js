import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import { Dialog } from '@alife/next';
import { split, format } from '../../lib/utils';
import '../../css/common/card';

const DEFAULT = require('../../imgs/default.png');

export default class Card extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    actions: PropTypes.object,
  };
  static propTypes = {
    i18n: PropTypes.object,
    data: PropTypes.object,
    width: PropTypes.number,
    removeItem: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = { user: {}, fav: false };

    this.handleClick = aType => {
      switch (aType) {
        case 'preview': {
          // 模板预览
          this.context.router.push({ pathname: '/detail/template', query: { id: this.data.id } });
          break;
        }
        case 'edit': {
          this.context.router.push({ pathname: '/editor', query: { id: this.data.id } });
          break;
        }
        case 'delete': {
          Dialog.alert({
            title: '删除模板',
            content: '请确认是否要删除模板？',
            onOk: () => {
              this.context.actions.deleteTemplate({ ids: this.data.id }).then(res => {
                if (res) this.removeItem(this.data.id);
              });
            },
          });
          break;
        }
        case 'collecting': {
          if (this.state.fav) {
            // 取消收藏
            this.context.actions.deleteFavorites({ ids: this.data.id, dataType: 'TEMPLATE' }).then(res => {
              if (res) this.setState({ fav: false });
            });
          } else {
            // 收藏
            this.context.actions.addFavorites({ ids: this.data.id, dataType: 'TEMPLATE' }).then(res => {
              if (res) this.setState({ fav: true });
            });
          }
          break;
        }
        case 'copytocreate': {
          this.context.actions.changeCloneTemplateData({ visible: true, cloneID: this.data.id });
          break;
        }
        default:
          // 项目展示模型没有细化交互，点击缩略图直接跳转到项目详情
          if (!this.templateMode) this.context.router.push({ pathname: '/detail/project', query: { id: this.data.id } });
          break;
      }
    };
  }

  componentWillMount() {
    /**
     * (备注) 数据同构组件，这里setState忽略不会重新渲染的缺陷
     * 只有在模板展示模型下需要需要显示用户头像
     * 检测当前登录用户是否是(模板)创建者，如果是则不需要调用buc获取用户信息
     */
    if (this.templateMode) {
      const { creator, favFlag } = this.data;
      if (this.myWorkId !== creator) {
        this.context.actions.getUserByEmpId(creator)
                            .then(res => this.setState({ user: Object.assign({}, res) }));
                            // .catch(e => console.log(e));
      } else {
        this.setState({ user: Object.assign({}, window.user) });
      }
      this.setState({ fav: favFlag });
    }
  }

  get i18n() {
    return this.props.i18n;
  }

  get width() {
    return this.props.width;
  }

  get data() {
    return this.props.data;
  }

  get removeItem() {
    return this.props.removeItem;
  }

  /**
   * 当前登陆用户的工号
   * @return {[type]} [description]
   */
  get myWorkId() {
    return window.user.workid;
  }

  /**
   * 基于卡片宽度检测卡片展示模型：模板卡片宽度最大400，项目卡片宽度最大285
   * @return {Boolean} [description]
   */
  get templateMode() {
    return this.width >= 400;
  }

  /**
   * 只有在模板展示模式下有交互行为
   * @return {[type]} [description]
   */
  get templateAction() {
    const elements = [
      <div key='preview'
           className='preview icon-wrapper'
           data-tips={this.i18n['action.preview']}
           onClick={() => this.handleClick('preview')}>
        <i className='iconfont'>&#xe747;</i>
      </div>,
    ];
    if (this.data.editFlag) {
      // 模板创建者或项目成员，可以删除或编辑模板
      elements.push(
        <div key='edit'
             className='edit icon-wrapper'
             data-tips={this.i18n['action.edit']}
             onClick={() => this.handleClick('edit')}>
          <i className='iconfont'>&#xe74b;</i>
        </div>,
        <div key='delete'
             className='delete icon-wrapper'
             data-tips={this.i18n['action.delete']}
             onClick={() => this.handleClick('delete')}>
          <i className='iconfont'>&#xe72d;</i>
        </div>
      );
    } else {
      // 非模板创建者或项目成员，只可以收藏或复制创建
      elements.push(
        <div key='collecting'
             className='collecting icon-wrapper'
             data-tips={this.state.fav ? this.i18n['action.hascollecting'] : this.i18n['action.collecting']}
             onClick={() => this.handleClick('collecting')}>
            {this.state.fav ? <i className='iconfont'>&#xe74d;</i> : <i className='iconfont'>&#xe74c;</i>}
        </div>,
        <div key='copytocreate'
             className='copytocreate icon-wrapper'
             data-tips={this.i18n['action.copytocreate']}
             onClick={() => this.handleClick('copytocreate')}>
            <i className='iconfont'>&#xe737;</i>
        </div>
      );
    }
    return (
      <div className='wrapper'>
        <div className='actions'>{elements}</div>
      </div>
    );
  }

  /**
   * 模板卡片模型
   * @return {[type]} [description]
   */
  get templateCard() {
    const { user } = this.state;
    if (this.data) {
      const { size, id, gmtCreate } = this.data;
      const reform = split(size);
      return (
        <ul className='detail'>
          <li className='avatar'>
            <Link to={{ pathname: '/detail', query: { empId: user.empId } }}>
              <img src={user.avatar_url} />
            </Link>
          </li>
          <li className='size'>{`${reform.width}*${reform.height}`}</li>
          <li className='tag' title={`${this.i18n['label.templateID']}:${id}`}>{`${this.i18n['label.templateID']}:${id}`}</li>
          <li className='time'>{format(gmtCreate)}</li>
        </ul>
      );
    }
  }

  /**
   * 项目卡片模型
   * @return {[type]} [description]
   */
  get projectCard() {
    const { id, gmtCreate, templatesCount } = this.data;
    return (
      <p className='detail'>
        <span className='tag' title={`${this.i18n['label.projectID']}:${id}`}>{`${this.i18n['label.projectID']}:${id}`}</span>
        <span className='time'>{format(gmtCreate)}</span>
        <span className='count'>{templatesCount}</span>
      </p>
    );
  }

  render() {
    const { name, imageUrl } = this.data;
    const mode = this.templateMode;
    return (
      <div className={classnames({ 'ubanner-card': true, template: mode, project: !mode, delete: this.state.isDelete })}>
        <div className='card-photo' onClick={() => this.handleClick()}>
          <img alt='thumb' src={imageUrl ? imageUrl : DEFAULT} />
          {mode && this.templateAction}
        </div>
        <div className='card-info'>
          <p className='title' title={name}>{name}</p>
          {mode && this.templateCard}
          {!mode && this.projectCard}
        </div>
      </div>
    );
  }
}
