import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Form, Field, Input, Select, Dialog, Button } from '@alife/next';
import '../../css/common/cloneDialog';


const DES = '哎哟~ 这个项目不错哦！！';
const FormItem = Form.Item;
const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };

export default class CloneDialog extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    actions: PropTypes.object,
  };
  static propTypes = {
    i18n: PropTypes.object,
    projects: PropTypes.array,
    cloneID: PropTypes.number,
    bizLines: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.field = new Field(this);

    this.state = { pageNumber: 1, selected: null, loading: false };

    this.handleCreate = e => {
      e.preventDefault();
      this.field.validate((errors, values) => {
        if (errors) return;
        this.setState({ loading: true });
        values.bizLineId = Number(values.bizLineId);
        values.description = values.description ? values.description : DES;
        this.context.actions.saveProject(values).then(newID => {
          // 新创建项目后，重新获取当前登录用户的项目列表
          this.context.actions.fetchLoggedUserProjectList({ owner: this.myWorkId, pageNumber: 1 });
       
          this.context.actions.cloneTemplate({ srcTemplateId: this.cloneID, destProjectId: newID }).then(() => {
            this.setState({ loading: false });
            this.context.actions.changeCloneTemplateData({ visible: false });
            this.context.router.push({ pathname: '/detail/project', query: { id: newID } });
          });
        });
      });
    };

    this.handleClone = () => {
      this.setState({ loading: true });
      this.context.actions.cloneTemplate({ srcTemplateId: this.cloneID, destProjectId: this.state.selected }).then(() => {
        this.setState({ loading: false });
        this.context.actions.changeCloneTemplateData({ visible: false });
        this.context.router.push({ pathname: '/detail/project', query: { id: this.state.selected } });
      });
    };

    this.handleSelect = id => this.setState({ selected: id });

    this.handleCancel = () => this.context.actions.changeCloneTemplateData({ visible: false });
  }

  /**
   * 当前登陆用户的工号
   * @return {[type]} [description]
   */
  get myWorkId() {
    return window.user.workid;
  }

  get i18n() {
    return this.props.i18n;
  }

  get bizLines() {
    return this.props.bizLines;
  }

  get cloneID() {
    return this.props.cloneID;
  }

  get projects() {
    return this.props.projects;
  }

  get cloneDialog() {
    const footer = (
      <div className='action-wrapper'>
        <Button type='primary' disabled={this.state.selected === null} loading={this.state.loading} onClick={this.handleClone}>复制创建</Button>
        <Button type='secondary' text disabled={this.state.loading} onClick={this.handleCancel}>取消</Button>
      </div>
    );
    return (
      <Dialog visible title='复制并创建' footerAlign='center' className='clone-dialog' footer={footer} closeable={false}>
        <Form labelAlign='top' field={this.field} >
          <FormItem {...formItemLayout} label='添加到现有的项目'>
            <ul className='project-list'>
              {
                this.projects.map(item => {
                  return <li className={classnames({ item: true, selected: this.state.selected === item.id })} key={item.id} onClick={() => this.handleSelect(item.id)}>{item.name}</li>;
                })
              }
            </ul>
          </FormItem>
        </Form>
      </Dialog>
    );
  }

  get createDialog() {
    const { init } = this.field;
    const footer = (
      <div className='action-wrapper'>
        <Button type='primary' loading={this.state.loading} onClick={this.handleCreate}>创建一个新项目</Button>
        <Button type='secondary' text disabled={this.state.loading} onClick={this.handleCancel}>取消</Button>
      </div>
    );

    return (
      <Dialog visible title='复制并创建' footerAlign='center' className='create-dialog' footer={footer} closeable={false}>
        <p className='tips'>未发现您创建的项目，请先创建项目</p>
        <Form labelAlign='top' field={this.field} >
          <FormItem {...formItemLayout} hasFeedback label='项目名称'>
            <Input placeholder='请输入项目的名称' name='name'
              {...init('name', {
                rules: [
                  { required: true, whitespace: true, message: '请填写项目名称' },
                ],
              })}
            />
          </FormItem>
          <FormItem {...formItemLayout} label='详情描述'>
            <Input multiple placeholder={DES} name='description' maxLength={200} hasLimitHint
              {...init('description')}
            />
          </FormItem>
          <FormItem {...formItemLayout} label='选择业务线'>
            <Select
              placeholder='选择业务线'
              name='biz'
              dataSource={this.bizLines}
              {...init('bizLineId', {
                rules: [
                  { required: true, message: '请选择业务线' },
                ],
              })}
            />
          </FormItem>
        </Form>
      </Dialog>
    );
  }

  render() {
    return this.projects.length ? this.cloneDialog : this.createDialog;
  }
}
