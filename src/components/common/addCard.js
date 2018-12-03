import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Message } from '@alife/next';
import Dropzone from 'react-dropzone';
import Loading from './loading';
import '../../css/common/addCard';

const MAX_SIZE = 100;
const notice = (total, index) => {
  return total > 1 ? `解析中：${total}/${index}，请耐心等待...` : 'PSD解析中...';
};

export default class AddCard extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    actions: PropTypes.object,
  };
  static propTypes = {
    i18n: PropTypes.object,
    type: PropTypes.string,
    projectId: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = { percent: 0, visible: false, title: null };

    this.handleClick = () => this.context.actions.changeCreateDialogVisible(true);

    this.handleDrop = (acceptedFiles, rejectedFiles) => {
      const totalNum = acceptedFiles.length;
      if (totalNum) {
        this.setState({ visible: true, percent: 0, title: notice(totalNum, 0) });
        for (const file of acceptedFiles) {
          const fileSize = (file.size / 1024 / 1024);
          if (fileSize >= MAX_SIZE) {
            // 不做处理
            Message.error({ duration: 3000, content: `上传的psd文件大小超出${MAX_SIZE}MB限制`, hasMask: true });
          } else {
            this.context.actions.parse(file).then(res => {
              const template = JSON.parse(res.template);
              // 解析后保存模板数据
              this.context.actions.saveTemplate({
                name: file.name.split('.psd')[0],
                meta: template,
                size: `${template.width}x${template.height}`,
                imageUrl: res.thumb,
                projectId: this.projectId,
              }).then(() => {
                const num = this.state.percent + 1;
                this.setState({ percent: num, visible: num !== totalNum, title: notice(totalNum, num) });
                // 保存成功后更新项目模板列表数据
                this.context.actions.fetchTemplateList({ projectId: this.projectId, pageNumber: 1 });
              });
            });
          }
        }
      }
      if (rejectedFiles.length) console.log(rejectedFiles);
    };
  }

  get i18n() {
    return this.props.i18n;
  }

  get type() {
    return this.props.type;
  }

  get projectId() {
    return this.props.projectId;
  }

  render() {
    return (
      <div className={classnames({ 'add-card': true, project: this.type === 'project' })}>
        {
          this.type === 'project' ?
          <div className='card-wrapper' onClick={this.handleClick}>
            <p className='icon'><i className='iconfont'>&#xe748;</i></p>
            <p className='introducer'>{this.i18n[`create.${this.type}.explain`]}</p>
            <Button type='primary' className='action'>{this.i18n[`create.${this.type}.action`]}</Button>
          </div> :
          <Dropzone className='upload-dropzone' accept='.psd' onDrop={this.handleDrop}>
            <div className='card-wrapper'>
              <p className='icon'><i className='iconfont'>&#xe748;</i></p>
              <p className='introducer'>{this.i18n[`create.${this.type}.explain`]}</p>
              <Button type='primary' className='action'>{this.i18n[`create.${this.type}.action`]}</Button>
            </div>
          </Dropzone>
        }
        <Loading visible={this.state.visible} title={this.state.title} />
      </div>
    );
  }
}
