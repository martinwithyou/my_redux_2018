import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { Nav, Button } from '@alife/next';
import CreateDialog from './createDialog';
import CloneDialog from './cloneDialog';
import '../../css/common/header';

const { Item } = Nav;
const LOGO = require('../../imgs/logo.png');

export default class Header extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    actions: PropTypes.object,
  };
  static propTypes = {
    i18n: PropTypes.object,
    createDialogVisible: PropTypes.bool,
    cloneTemplateData: PropTypes.object,
    bizLineList: PropTypes.array,
    projects: PropTypes.array,
  };

  constructor(props, context) {
    super(props);

    this.state = { isEnglish: false, selectedKeys: '1' };

    /**
     * 检测路由地址
     * @param  {[type]} pathname [description]
     * @return {[type]}          [description]
     */
    this.checkRouterPath = pathname => {
      if (/detail/.test(pathname) || (/editor/.test(pathname))) {
        this.setState({ selectedKeys: '2' });
      } else if (/help/.test(pathname)) {
        this.setState({ selectedKeys: '3' });
      } else {
        this.setState({ selectedKeys: '1' });
      }
    };

    /**
     * 切换语言
     * @return {[type]} [description]
     */
    this.handleChangeLanguage = () => {
      const isEnglish = this.state.isEnglish;
      console.log("changeLocale____", isEnglish);
      this.context.actions.changeLocale(isEnglish ? 'zh-cn' : 'en-us');
      this.setState({ isEnglish: !isEnglish });
    };

    /**
     * 路由监听
     * @param  {[type]} location [description]
     * @return {[type]}          [description]
     */
    browserHistory.listen(location => this.checkRouterPath(location.pathname));

    /**
     * 打开创建项目弹窗
     * @return {[type]} [description]
     */
    this.handleCreateProject = () => this.context.actions.changeCreateDialogVisible(true);

    /**
     * 获取全量业务线列表
     */
    context.actions.fetchBizLineList();
   
    /**
     * 获取当前登录用户创建的项目列表
     */
    context.actions.fetchLoggedUserProjectList({ owner: this.myWorkId, pageNumber: 1 });
  }

  componentDidMount() {
    // browserHistory.listen 无法监听在地址栏中直接键入网址
    this.checkRouterPath(this.context.router.location.pathname);
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

  get createDialogVisible() {
    return this.props.createDialogVisible;
  }

  get cloneTemplateData() {
    return this.props.cloneTemplateData;
  }

  get bizLineList() {
    return this.props.bizLineList;
  }

  get projects() {
    return this.props.projects;
  }

  get language() {
    return this.state.isEnglish ? <em className='iconfont'>&#xe734;</em> : <em className='iconfont'>&#xe735;</em>;
  }

  render() {
    // <span className='search'><em className='iconfont'>&#xe744;</em></span>
    const { workid, avatar_url } = window.user;
    return (
      <header>
        <div className='ubanner-header'>
          <Link to='/' className='header-logo'>
            <img alt='logo-thumb' className='logo-thumb' src={LOGO} />
            <span className='logo-title'>U-BANNER</span>
          </Link>
          <div className='header-content'>
            <div className='content-other'>
              <Button type='primary' className='create spacing' onClick={this.handleCreateProject}>{this.i18n['action.create']}</Button>
              <span className='avatar'><img src={avatar_url} /></span>
              <span className='language spacing' onClick={this.handleChangeLanguage}>{this.language}</span>
              <span className='category'><em className='iconfont'>&#xe74a;</em></span>
            </div>
            <div className='content-nav'>
              <Nav type='primary' direction='hoz' defaultSelectedKeys={[ '1' ]} selectedKeys={this.state.selectedKeys}>
                <Item key='1'><Link to='/'>{this.i18n['tab.home']}</Link></Item>
                <Item key='2'><Link to={{ pathname: '/detail', query: { empId: workid } }}>{this.i18n['tab.detail']}</Link></Item>
                <Item key='3'><Link to='/'>{this.i18n['tab.help']}</Link></Item>
              </Nav>
            </div>
          </div>
        </div>
        {this.createDialogVisible && <CreateDialog i18n={this.i18n} bizLines={this.bizLineList} />}
        {this.cloneTemplateData && this.cloneTemplateData.visible && <CloneDialog i18n={this.i18n} bizLines={this.bizLineList} cloneID={this.cloneTemplateData.cloneID} projects={this.projects} />}
      </header>
    );
  }
}
