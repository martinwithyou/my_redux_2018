import React from 'react';
import PropTypes from 'prop-types';
import { Nav } from '@alife/next';
import { Link } from 'react-router';
import ProjectList from '../../containers/detail/projectList';
import TemplateList from '../../containers/detail/templateList';
import FavoritesList from '../../containers/detail/favoritesList';
import '../../css/detail';

const { Item } = Nav;
export default class Detail extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    actions: PropTypes.object,
  };
  static propTypes = {
    i18n: PropTypes.object,
    location: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = { user: {}, selectedKeys: [ '1' ] };

    this.handleSelect = selected => this.setState({ selectedKeys: selected });
  }

  componentWillMount() {
    if (this.myWorkId !== this.empId) {
      this.context.actions.getUserByEmpId(this.empId)
                          .then(res => this.setState({ user: Object.assign({}, res) }));
                        // .catch(e => console.log(e));
    } else {
      this.setState({ user: Object.assign({}, window.user) });
    }
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
    return this.props.location.query.empId;
  }

  render() {
    const { user, selectedKeys } = this.state;
    const isOthers = this.empId !== this.myWorkId;
    const selected = Number(selectedKeys[0]);
    return (
      <div className='ubanner-detail'>
        <div className='detail-header'>
          <div className='header-about'>
            <div className='avatar'>
              <Link to={{ pathname: '/detail', query: { empId: user.empId } }}>
                <img src={user.avatar_url} />
              </Link>
            </div>
            <div className='info'>
              <p className='name'>{user.name}</p>
              <p className='dep'>{user.depDesc}</p>
            </div>
          </div>
          <div className='header-nav'>
            <Nav type='primary' direction='hoz' selectedKeys={selectedKeys} onSelect={this.handleSelect}>
              <Item key='1'>{this.i18n[isOthers ? 'tab.taproject' : 'tab.myproject']}</Item>
              <Item key='2'>{this.i18n[isOthers ? 'tab.tatemplate' : 'tab.mytemplate']}</Item>
              {isOthers ? null : <Item key='3'>{this.i18n['tab.mycollection']}</Item>}
            </Nav>
          </div>
        </div>
        <div className='detail-content'>
          {selected === 1 && <ProjectList empId={this.empId} />}
          {selected === 2 && <TemplateList empId={this.empId} />}
          {selected === 3 && <FavoritesList empId={this.empId} />}
        </div>
      </div>
    );
  }
}
