import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field, Input, Select, Dialog, Button } from '@alife/next';
import '../../css/common/createDialog';

const DES = '哎哟~ 这个项目不错哦！！';
const FormItem = Form.Item;
const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };

export default class CreateDialog extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    actions: PropTypes.object,
  };
  static propTypes = {
    i18n: PropTypes.object,
    bizLines: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = { loading: false };

    this.field = new Field(this);

    this.handleSubmit = e => {
      e.preventDefault();
      this.field.validate((errors, values) => {
        if (errors) return;
        this.setState({ loading: true });
        values.bizLineId = Number(values.bizLineId);
        values.description = values.description ? values.description : DES;
        this.context.actions.saveProject(values).then(res => {
          // 创建项目后，重新获取当前登录用户的项目列表
          this.context.actions.fetchLoggedUserProjectList({ owner: this.myWorkId, pageNumber: 1 });
          this.setState({ loading: false });
          this.context.actions.changeCreateDialogVisible(false);
          this.context.router.push({ pathname: '/detail/project', query: { id: res } });
        }, () => {
          // 创建项目失败
          this.setState({ loading: false });
        });
      });
    };

    this.handleCancel = () => this.context.actions.changeCreateDialogVisible(false);
  }

  get i18n() {
    return this.props.i18n;
  }

  get bizLines() {
    return this.props.bizLines;
  }

  get footer() {
    return (
      <div className='action-wrapper'>
        <Button type='primary' loading={this.state.loading} onClick={this.handleSubmit}>创建一个新项目</Button>
        <Button type='secondary' text disabled={this.state.loading} onClick={this.handleCancel}>取消</Button>
      </div>
    );
  }

  render() {
    const { init } = this.field;
    return (
      <Dialog visible title='创建项目' footerAlign='center' className='create-dialog' footer={this.footer} closeable={false}>
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
            <Input.TextArea multiple placeholder={DES} name='description' maxLength={200} hasLimitHint
              {...init('description')}
            />
          </FormItem>
          <FormItem {...formItemLayout} label='选择业务线'>
            <Select
              placeholder='选择业务线'
              name='bizLineId'
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
}
