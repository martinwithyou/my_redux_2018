import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import $ from 'jquery';
import { Link } from 'react-router';
import { Button } from '@alife/next';
import { format, aspectRatio, split } from '../../lib/utils';
import '../../css/detail/templateDetail';


export default class TemplateDetail extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    actions: PropTypes.object,
  };
  static propTypes = {
    i18n: PropTypes.object,
    location: PropTypes.object,
    detail: PropTypes.object,
  };

  constructor(props, context) {
    super(props);

    this.state = { user: {}, fav: false, thumbs: {}, selected: null };

    this.handleClick = aType => {
      switch (aType) {
        case 'edit': {
          this.context.router.push({ pathname: '/editor', query: { id: this.id } });
          break;
        }
        case 'copytocreate': {
          this.context.actions.changeCloneTemplateData({ visible: true, cloneID: this.id });
          break;
        }
        case 'collecting': {
          if (this.state.fav) {
            // 取消收藏
            this.context.actions.deleteFavorites({ ids: this.id, dataType: 'TEMPLATE' }).then(res => {
              if (res) this.setState({ fav: false });
            });
          } else {
            // 收藏
            this.context.actions.addFavorites({ ids: this.id, dataType: 'TEMPLATE' }).then(res => {
              if (res) this.setState({ fav: true });
            });
          }
          break;
        }
        default:
          break;
      }
    };

    this.handleChangeSizes = (category, id) => {
      const target = id ? $(`#${id}`) : $(`#${category}`);
      const pos = target.offset().top;
      $('.thumbs').animate({ scrollTop: ($('.thumbs').scrollTop() + pos - 100) }, 1000);
      this.setState({ selected: category });
    };
    context.actions.fetchTemplateDetail(this.id);
  }


  componentWillReceiveProps(nextProps) {
    const detail = nextProps.detail;
    const { creator, favFlag } = detail;
    const newThumbs = this.state.thumbs;

    let asize = split(detail.size);
    let aspect = aspectRatio(asize.width, asize.height);
    newThumbs[aspect] = [{ id: detail.id, imageUrl: detail.imageUrl, size: detail.size, width: asize.width }];
    for (const banner of detail.banners) {
      asize = split(banner.size);
      aspect = aspectRatio(asize.width, asize.height);
      newThumbs[aspect] = newThumbs[aspect] ? newThumbs[aspect] : [];
      newThumbs[aspect].push({ id: banner.id, imageUrl: banner.imageUrl, size: banner.size, width: asize.width });
    }
    /**
     * 模板详情需要显示用户头像
     * 检测当前登录用户是否是模板创建者，如果是则不需要调用buc获取用户信息
     */
    if (this.myWorkId !== creator) {
      this.context.actions.getUserByEmpId(creator)
                          .then(res => this.setState({ user: Object.assign({}, res) }));
                          // .catch(e => console.log(e));
    } else {
      this.setState({ user: Object.assign({}, window.user) });
    }
    this.setState({ fav: favFlag, thumbs: newThumbs, selected: Object.keys(newThumbs)[0] });
  }

  // componentWillUnmount() {
  //   $('.thumbs').off('scroll');
  // }

  get i18n() {
    return this.props.i18n;
  }

  get detail() {
    return this.props.detail;
  }

  /**
   * 当前登陆用户的工号
   * @return {[type]} [description]
   */
  get myWorkId() {
    return window.user.workid;
  }

  /**
   * 模板id
   * @return {[type]} [description]
   */
  get id() {
    return this.props.location.query.id;
  }

  get sizesChildren() {
    const { thumbs, selected } = this.state;
    const elements = Object.keys(thumbs).map(key => {
      return (
        <div className={classnames({ wrapper: true, selected: key === selected })} key={Math.random()}>
          <p className='title' onClick={() => this.handleChangeSizes(key)}>{key}</p>
          <ul>
            {
              thumbs[key].map(item => {
                return (
                  <li className='item' key={item.id} onClick={() => this.handleChangeSizes(key, item.id)}>
                    {item.size}
                  </li>
                );
              })
            }
          </ul>
        </div>
      );
    });
    return <div className='detail-sizes'>{elements}</div>;
  }

  get thumbsChildren() {
    const thumbs = this.state.thumbs;
    const elements = Object.keys(thumbs).map(key => {
      const children = thumbs[key].map(item => {
        return (
          <li className='item' id={item.id} key={item.id}>
            <div className='photo' style={{ width: item.width, maxWidth: '100%' }}>
              <img src={item.imageUrl} />
            </div>
            <p className='tag'>
              <span>{item.size}</span>
              <span>{`模板ID：${item.id}`}</span>
            </p>
          </li>
        );
      });
      return (
        <div className='wrapper' id={key} key={Math.random()}>
          <p className='title'>{key}</p>
          <ul>{children}</ul>
        </div>
      );
    });
    return <div className='thumbs'>{elements}</div>;
  }

  get infoChildren() {
    const { name, gmtCreate, projectName, projectId } = this.detail;
    return (
      <div className='info'>
        <p className='title striking' title={name}>{name}</p>
        <p className='time'>{`${this.i18n['label.createtime']}：${format(gmtCreate)}`}</p>
        <p className='place striking'>{this.i18n['label.fromproject']}</p>
        <Link className='link'
              to={{ pathname: '/detail/project', query: { id: projectId } }}
              title={projectName}>{projectName}</Link>
      </div>
    );
  }

  get actionChildren() {
    const { editFlag } = this.detail;
    const { fav } = this.state;
    return (
      <div className='action'>
        {
          editFlag ?
          <Button type='primary' onClick={() => this.handleClick('edit')}>
            <i className='iconfont'>&#xe74b;</i>{this.i18n['action.edit']}
          </Button> :
          <Button type='primary' onClick={() => this.handleClick('copytocreate')}>
            <i className='iconfont'>&#xe737;</i>{this.i18n['action.copytocreate']}
          </Button>
        }
        {
          editFlag ?
          <Button type='secondary' component='a' href={`${window.fetchURL}/template/download?ids=${this.id}`}>
            <i className='iconfont'>&#xe73b;</i>{this.i18n['action.download']}
          </Button> :
          <Button type='secondary' onClick={() => this.handleClick('collecting')}>
            {fav ? <i className='iconfont'>&#xe74d;</i> : <i className='iconfont'>&#xe74c;</i>}
            {this.i18n[fav ? 'action.hascollecting' : 'action.collecting']}
          </Button>
        }
      </div>
    );
  }

  render() {
    const { user } = this.state;
    return (
      <div className='template-detail'>
        {this.sizesChildren}
        <div className='detail-content'>
          <div className='about'>
            <div className='items'>
              <div className='avatar'>
                <Link to={{ pathname: '/detail', query: { empId: user.empId } }}>
                  <img src={user.avatar_url} />
                </Link>
                <p>{user.name}</p>
              </div>
            </div>
            <div className='items other'>{this.detail && this.infoChildren}</div>
            <div className='items'>{this.detail && this.actionChildren}</div>
            <div className='items label' />
          </div>
          {this.thumbsChildren}
        </div>
      </div>
    );
  }
}
