import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'debounce';
import { Select, Icon, Balloon } from '@alife/next';
import WaterFall from '../../containers/common/waterfall';
import AddCard from '../common/addCard';
import SettingDialog from './settingDialog';
import { format } from '../../lib/utils';
import '../../css/detail/projectDetail';

export default class ProjectDetail extends React.Component {
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

    this.state = { settingDialogVisible: false, fav: false, members: [], dataSource: [] };

    /**
     * 打开设置项目弹窗
     * @return {[type]} [description]
     */
    this.handleOpenSettingDialog = () => this.setState({ settingDialogVisible: true });
    /**
     * 关闭设置项目弹窗
     * @return {[type]} [description]
     */
    this.handleCloseSettingDialog = () => {
      this.context.actions.fetchProjectDetail(this.id);
      this.setState({ settingDialogVisible: false });
    };

    /**
     * 收藏或取消收藏
     * @return {[type]} [description]
     */
    this.handleCollecting = () => {
      if (this.state.fav) {
        // 取消收藏
        this.context.actions.deleteFavorites({ ids: this.id, dataType: 'PROJECT' }).then(res => {
          if (res) this.setState({ fav: false });
        });
      } else {
        // 收藏
        this.context.actions.addFavorites({ ids: this.id, dataType: 'PROJECT' }).then(res => {
          if (res) this.setState({ fav: true });
        });
      }
    };


    /**
     * 选中模糊搜索的员工
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    this.handleChangeKeyWord = options => {
      let isrepeat = false;
      const arrcall = this.state.members;
      for (const item of arrcall) {
        if (item.empId === options.value) isrepeat = true;
      }
      if (!isrepeat) {
        arrcall.push({ name: options.name, avatar_url: options.avatar_url, empId: options.value });
        this.saveMembers(arrcall);
        this.setState({ members: arrcall });
      }
    };

    /**
     * 延迟模糊查询
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    this.deferQuery = debounce(value => {
      this.context.actions.searchByKeyWord(value)
                          .then(res => {
                            const users = res.users.map(item => {
                              const labelValue = `${item.lastName}(${item.name})-${item.empId}`;
                              return { avatar_url: item.avatar_url, value: item.empId, label: labelValue, name: item.name };
                            });
                            this.setState({ dataSource: users });
                          });
                          // .catch(e => console.log(e));
    }, 200);


    /**
     * 输入更新模糊查询条件
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    this.handleSearch = value => {
      if (value) this.deferQuery(value);
    };

    /**
     * 删除项目成员
     * @param  {[type]} empId [description]
     * @return {[type]}       [description]
     */
    this.handleDeleteMember = empId => {
      const arrcall = this.state.members.filter(item => item.empId !== empId);
      this.saveMembers(arrcall);
      this.setState({ members: arrcall });
    };

    /**
     * 获取项目详情数据
     */
    context.actions.fetchProjectDetail(this.id);
  }

  componentWillReceiveProps(nextProps) {
    const { favFlag, members } = nextProps.detail;
    // 同步请求阻塞初始化流程，暂时使用Promise.all
    if (!favFlag) {
      const promises = members && members.map(item => this.context.actions.getUserByEmpId(item));
      if (promises) {
        Promise.all(promises).then(data => {
          const arrcall = data.map(member => {
            return { name: member.name, avatar_url: member.avatar_url, empId: member.empId };
          });
          this.setState({ members: arrcall });
        });
      }
    }
    this.setState({ fav: favFlag });
  }

  saveMembers(members) {
    const reform = members.map(item => item.empId);
    this.context.actions.saveMembers({ id: this.id, members: reform });
  }

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
   * 项目id
   * @return {[type]} [description]
   */
  get id() {
    return this.props.location.query.id;
  }

  get memberChildren() {
    const { name, avatar_url } = window.user;
    const ownerElement = (<li className='member-item' key={name}>
                            <span className='avatar'><img src={avatar_url} /></span>
                            <span className='label'>{name}</span>
                            <span className='action'>管理员</span>
                          </li>);
    const elements = [ ownerElement ];
    for (const item of this.state.members) {
      elements.push(<li className='member-item' key={item.name}>
                      <span className='avatar'><img src={item.avatar_url} /></span>
                      <span className='label'>{item.name}</span>
                      <span className='action' onClick={() => this.handleDeleteMember(item.empId)}><i className='iconfont'>&#xe72d;</i></span>
                    </li>);
    }
    return <ul className='members-list'>{elements}</ul>;
  }

  get headerChildren() {
    const { name, description, bizLineId, gmtCreate, owner, editFlag } = this.detail;
    const { settingDialogVisible, fav, members } = this.state;
    const visibleTrigger = (<div className='members-control'>
                      <img src={window.user.avatar_url} />
                      {members && members.length ? <span className='count'>{members.length + 1}</span> : null}
                      <Icon type='arrow-down-filling' size='small' />
                    </div>);
    return (
      <div className='detail-header'>
        <p className='name'>{name}</p>
        <p className='description'>{description}</p>
        <div className='info-wrapper'>
          <p>
            <i className='iconfont'>&#xe74f;</i>
            <span>{format(gmtCreate)}</span>
          </p>
          {
            owner === this.myWorkId ?
            <div style={{ display: 'inline-block' }}>
              <p>
                <i className='iconfont'>&#xe750;</i>
                <span>成员：</span>
              </p>
              <Balloon trigger={visibleTrigger} alignment='edge' triggerType='click' closable={false}>
                <div className='balloon-content'>
                  <p className='title'>成员列表</p>
                  <Select
                    placeholder='请输入成员工号、花名'
                    filterLocal={false}
                    showSearch
                    useDetailValue
                    fillProps='label'
                    hasArrow={false}
                    cacheValue={false}
                    onSearch={this.handleSearch}
                    onChange={this.handleChangeKeyWord}
                    dataSource={this.state.dataSource} />
                  {this.memberChildren}
                </div>
              </Balloon>
              <p className='info-item' onClick={this.handleOpenSettingDialog}>
                <i className='iconfont'>&#xe72e;</i>
                <span>设置</span>
              </p>
            </div> : null
          }
          {
            editFlag ?
            <p className='info-item'>
              <i className='iconfont'>&#xe73b;</i>
              <span><a href={`${window.fetchURL}/project/download?id=${this.id}`}>{this.i18n['action.download']}</a></span>
            </p> :
            <p className='info-item' onClick={this.handleCollecting}>
              {fav ? <i className='iconfont'>&#xe74d;</i> : <i className='iconfont'>&#xe74c;</i>}
              <span>{this.i18n[fav ? 'action.hascollecting' : 'action.collecting']}</span>
            </p>
          }
        </div>
        {settingDialogVisible && <SettingDialog id={this.id} name={name} description={description} bizLineId={bizLineId} i18n={this.i18n} handle={this.handleCloseSettingDialog} />}
      </div>
    );
  }

  render() {
    const otherCard = <AddCard key='addCard' type='template' projectId={this.id} i18n={this.i18n} />;
    const params = { projectId: this.id };
    const options = { columnWidth: 400 };
    const handle = this.context.actions.fetchTemplateList;
    const editFlag = this.detail && this.detail.editFlag;
    return (
      <div className='project-detail'>
        {this.detail && this.headerChildren}
        <WaterFall
          handle={handle}
          params={params}
          masonry={options}
          otherCard={editFlag ? otherCard : null}
        />
      </div>
    );
  }
}
