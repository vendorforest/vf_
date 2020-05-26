import React from "react";
import { Button, Modal, Form, Input, Radio } from "antd";

class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
    this.onCreate = this.onCreate.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }
  onCreate() {
    this.setState({
      visible: false,
    });
  }
  onCancel() {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          visible={this.state.visible}
          title="Create a new collection"
          okText="Create"
          onCancel={this.onCancel}
          onOk={this.onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Title">
              {getFieldDecorator("title", {
                rules: [{ required: true, message: "Please input the title of collection!" }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Description">
              {getFieldDecorator("description")(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item className="collection-create-form_last-form-item">
              {getFieldDecorator("modifier", {
                initialValue: "public",
              })(
                <Radio.Group>
                  <Radio value="public">Public</Radio>
                  <Radio value="private">Private</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
const EditModalForm = Form.create({ name: "edit job details." })(EditModal);

export default EditModalForm;
