import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import cos, { getObjectUrl } from '@/utils/cos'
import { ProFormUploadButton } from '@ant-design/pro-form';


function getBase64(file:File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    url: '',
    fileList: [],
  };

  getUploadURL = async (params:any) => {
    let url = await getObjectUrl({Key: params.filename});
    this.setState({url});
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = ({ file, fileList }) => {
    if (file.status == 'done') file.url = file?.xhr?.responseURL;
    this.setState({ fileList });
  }

  beforeUpload = async (file:File) => {
    await this.getUploadURL({filename: file.name});
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <ProFormUploadButton
          name="images"
          label="Upload"
          action={this.state.url}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            method: "PUT",
            headers: {"Content-Type": 'application/octet-stream'},
            onPreview: this.handlePreview,
            beforeUpload: this.beforeUpload,
          }}
          fileList={fileList}
          max={8}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </ProFormUploadButton>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

export default PicturesWall;