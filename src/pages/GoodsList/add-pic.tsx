import { Modal } from 'antd';
import { ProFormUploadButton } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import cosUpload from '@/utils/upload'
import connectModel from '@/utils/connect';


function getBase64(file:File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@connectModel('initialState', '@@initialState')
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
    console.log(this.props.initialState);
    
  };

  handleChange = async ({ file, fileList }) => {
    this.setState({ fileList });
  }

  /* Replace with component key prop: https://blog.csdn.net/nnxxyy1111/article/details/80832525 */
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.fileList == this.props.fileList) return;  // 当增删图的时候value prop会变化，误触此函数
  //   this.setState({fileList: nextProps.fileList});
  // }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const { initialState } = this.props;
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
                  path: `products/member-${initialState?.currentUser?.id}`,
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