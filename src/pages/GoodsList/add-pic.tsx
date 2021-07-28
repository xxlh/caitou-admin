import { Modal } from 'antd';
import { ProFormUploadButton } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import cosUpload from '@/utils/upload'


function getBase64(file:File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component {
  // const { initialState } = useModel('@@initialState');
  // const { currentUser } = initialState || {};
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    url: '',
    fileList: this.props.fileList || [],
  };


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

  handleChange = async ({ file, fileList }) => {
    this.setState({ fileList });
  }


  componentWillReceiveProps() {
    this.setState({fileList: this.props.fileList});
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
          label="商品图片"
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            method: "PUT",
            headers: {"Content-Type": 'application/octet-stream'},
            onPreview: this.handlePreview,
            customRequest ({
              action,
              file,
              headers,
              onError,
              onProgress,
              onSuccess,
              withCredentials,
            }) {
              cosUpload({
                  // path: `${currentUser?.id}`, // Todo: +/分类id
                  file,
                  success: onSuccess,
              })
            }
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