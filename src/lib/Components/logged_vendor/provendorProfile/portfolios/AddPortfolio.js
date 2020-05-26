import React from "react";
import { connect } from "react-redux";
import { updatePortfolios } from "../essential";
import { Input, Form, Upload, Icon, message, Modal } from "antd";
import { apiUrl } from "@Shared/constants";
const { TextArea } = Input;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class AddPortfolio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      portfolioId: undefined,
      pending: false,
      attachImgFiles: [],
      attachVidFiles: [],
      title: "",
      caption: "",

      previewImgVisible: false,
      previewImage: "",

      previewVidVisible: false,
      previewVideo: "",
    };
    this.imgPreviewCancel = this.imgPreviewCancel.bind(this);
    this.imgPreview = this.imgPreview.bind(this);
    this.imgUpload = this.imgUpload.bind(this);
    this.imgRemove = this.imgRemove.bind(this);
    this.vidPreviewCancel = this.vidPreviewCancel.bind(this);
    this.vidPreview = this.vidPreview.bind(this);
    this.vidUpload = this.vidUpload.bind(this);
  }

  componentDidMount() {
    if (this.props.portfolio) {
      this.setState({
        portfolioId: this.props.portfolio._id,
        attachImgFiles: this.props.portfolio.attachImgFiles,
        attachVidFiles: this.props.portfolio.attachVidFiles,
        title: this.props.portfolio.title,
        caption: this.props.portfolio.caption,
      });
    }
  }

  UNSAFE__componentWillReceiveProps(newProps) {
    if (this.props.portfolio !== newProps.portfolio) {
      this.setState({
        portfolioId: newProps.portfolio._id,
        attachImgFiles: newProps.portfolio.attachImgFiles,
        attachVidFiles: newProps.portfolio.attachVidFiles,
        title: newProps.portfolio.title,
        caption: newProps.portfolio.caption,
      });
    }
    if (this.props.portfolio && !newProps.portfolio) {
      this.setState({
        portfolioId: undefined,
        attachImgFiles: [],
        attachVidFiles: [],
        title: "",
        caption: "",
      });
    }
  }

  imgPreviewCancel = () => this.setState({ previewImgVisible: false });

  imgPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewImgVisible: true,
    });
  };

  imgUpload = ({ fileList }) => {
    this.setState({
      attachImgFiles: fileList,
    });
  };

  imgRemove = (file) => {
    process.env.NODE_ENV === "development" && console.log(file);
  };

  vidPreviewCancel = () => this.setState({ previewVidVisible: false });

  vidPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewVideo: file.url || file.preview,
      previewVidVisible: true,
    });
  };

  vidUpload = ({ fileList }) => {
    this.setState({
      attachVidFiles: fileList,
    });
  };

  save = async (e) => {
    e.preventDefault();
    this.props.form.validateFields(["title", "caption"], async (error, values) => {
      if (!error && !this.props.pending) {
        const data = { ...values };
        (data.attachImgFiles = this.state.attachImgFiles.map((file) => {
          return {
            name: file.name,
            uid: file.uid,
            status: file.status,
            url: file.url || file.response.url,
          };
        })),
          (data.attachVidFiles = this.state.attachVidFiles.map((file) => {
            return {
              name: file.name,
              uid: file.uid,
              status: file.status,
              url: file.url || file.response.url,
            };
          })),
          (data.coverImage =
            data.attachImgFiles.length > 0 ? data.attachImgFiles[0] : undefined);
        data._id = this.state.portfolioId ? this.state.portfolioId : undefined;
        process.env.NODE_ENV === "development" && console.log(data);
        this.setState({ pending: true });
        await fetch(
          this.state.portfolioId ? apiUrl.UPDATE_PORTFOLIO : apiUrl.CREATE_PORTFOLIO,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          },
        )
          .then((response) => response.json())
          .then((result) => {
            this.setState({ pending: false });
            if (result.status >= 400) {
              message.error(result.message);
            }
            let portfolios = [...this.props.portfolios];
            if (this.state.portfolioId) {
              const index = portfolios.findIndex((pt) => pt._id === this.state.portfolioId);
              portfolios[index] = result.data;
            } else {
              portfolios.push(result.data);
            }
            this.props.updatePortfolios(portfolios);
            message.success(result.message);
            this.props.toggle();
          })
          .catch((err) => {
            this.setState({ pending: false });
            process.env.NODE_ENV === "development" && console.log(err);
            message.error(err.message);
          });
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    const {
      previewImgVisible,
      previewVidVisible,
      previewImage,
      previewVideo,
      attachImgFiles,
      attachVidFiles,
    } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="addemployee-stepone">
        <Form layout="vertical" onSubmit={this.save}>
          <div className="row">
            <div className="col-12 mb-3">
              <h6 className="mb-3">Images</h6>
              <div className="clearfix">
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={attachImgFiles}
                  onPreview={this.imgPreview}
                  onChange={this.imgUpload}
                  onRemove={this.imgRemove}
                >
                  {attachImgFiles.length >= 5 ? null : uploadButton}
                </Upload>
                <Modal
                  visible={previewImgVisible}
                  footer={null}
                  onCancel={this.imgPreviewCancel}
                >
                  <img alt="example" style={{ width: "100%" }} src={previewImage} />
                </Modal>
              </div>
            </div>
            <div className="col-12 mb-3">
              <h6 className="mb-3">Videos</h6>
              <div className="clearfix">
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={attachVidFiles}
                  onPreview={this.vidPreview}
                  onChange={this.vidUpload}
                >
                  {attachVidFiles.length >= 5 ? null : uploadButton}
                </Upload>
                <Modal
                  visible={previewVidVisible}
                  footer={null}
                  onCancel={this.vidPreviewCancel}
                >
                  <img alt="example" style={{ width: "100%" }} src={previewVideo} />
                </Modal>
              </div>
            </div>
            <div className="col-md-12">
              <Form.Item label="Title">
                {getFieldDecorator("title", {
                  initialValue: this.state.title, //solution
                  rules: [{ required: true, message: "Please input title" }],
                })(<Input placeholder="Title" name="title" size={"large"} />)}
              </Form.Item>
              <Form.Item label="Caption">
                {getFieldDecorator("caption", {
                  initialValue: this.state.caption, //solution
                  rules: [{ required: true, message: "Please input Caption" }],
                })(<TextArea placeholder="Caption" name="caption" rows={5} />)}
              </Form.Item>
            </div>
            <div className="col-12 controls d-flex justify-content-end">
              <button
                className={`button-primary ${this.state.pending ? "disable" : ""}`}
                type="submit"
              >
                Save
              </button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = ({ vendorProfileReducer }) => {
  const { error, user, portfolios } = vendorProfileReducer;
  return { error, user, portfolios };
};

const AddPortfolioForm = Form.create({ name: "vendor_addportfolio_form" })(AddPortfolio);

export default connect(mapStateToProps, {
  updatePortfolios,
})(AddPortfolioForm);
