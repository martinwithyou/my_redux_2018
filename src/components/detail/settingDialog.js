import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field, Input, Dialog, Button } from '@alife/next';
import '../../css/detail/settingDialog';

const DES = '哎哟~ 这个项目不错哦！！';
const FormItem = Form.Item;
const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };

export default class SettingDialog extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    actions: PropTypes.object,
  };
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    bizLineId: PropTypes.number,
    i18n: PropTypes.object,
    handle: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = { dataSource: [], isDisabled: true };

    this.field = new Field(this);

    /**
     * 更新删除文案
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    this.handleChangeDelete = value => {
      this.setState({ isDisabled: value !== this.name });
    };

    /**
     * 点击删除按钮
     * @return {[type]} [description]
     */
    this.handleClickDelete = () => {
      this.context.actions.deleteProject(this.id).then(res => {
        if (res) {
          this.context.router.push({ pathname: '/detail', query: { empId: this.myWorkId } });
        }
      });
    };


    /**
     * 提交项目详情修改
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    this.handleSubmit = e => {
      e.preventDefault();
      this.field.validate((errors, values) => {
        if (errors) return;
        values.id = this.id;
        values.bizLineId = this.bizLineId;
        values.description = values.description ? values.description : DES;
        this.context.actions.saveProject(values).then(() => this.handle());
      });
    };

    /**
     * 关闭设置弹窗
     * @return {[type]} [description]
     */
    this.handleCancel = () => this.handle();
  }

  componentWillMount() {
    this.field.setValue('name', this.name);
    this.field.setValue('description', this.description);
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get bizLineId() {
    return this.props.bizLineId;
  }

  get i18n() {
    return this.props.i18n;
  }

  get handle() {
    return this.props.handle;
  }

  /**
   * 当前登陆用户的工号
   * @return {[type]} [description]
   */
  get myWorkId() {
    return window.user.workid;
  }

  get footer() {
    return (
      <div className='action-wrapper'>
        <Button type='primary' onClick={this.handleSubmit}>完成</Button>
        <Button type='secondary' onClick={this.handleCancel}>取消</Button>
      </div>
    );
  }

  render() {
    const { init } = this.field;
    return (
      <Dialog visible title='设置' footerAlign='center' className='setting-dialog' footer={this.footer} closeable={false}>
        <Form labelAlign='top' field={this.field} >
          <FormItem {...formItemLayout} label='项目名称'>
            <Input name='name'
            {...init('name', {
              rules: [
                { required: true, whitespace: true, message: '请填写项目名称' },
              ],
            })}
          />
          </FormItem>
          <FormItem {...formItemLayout} label='详情描述'>
            <Input.TextArea multiple name='description' maxLength={200} hasLimitHint
              {...init('description')}
            />
          </FormItem>
          <FormItem {...formItemLayout} label='删除项目'>
            <Input name='delete' placeholder='请输入这个项目的名称' onChange={this.handleChangeDelete} />
            <Button type='primary' warning size='large' disabled={this.state.isDisabled} onClick={this.handleClickDelete}>
              <i className='iconfont'>&#xe72d;</i>{this.i18n['action.delete']}
            </Button>
            <p className='warning-label'>警告，你正在删除这个项目</p>
          </FormItem>
        </Form>
      </Dialog>
    );
  }
}
