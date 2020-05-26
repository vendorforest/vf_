import React from "react";
import { Select, Card, Form, Checkbox } from "antd";
const CheckboxGroup = Checkbox.Group;

const pushNotiContents = [
  "Clients send you messages.",
  "You’ve got upcoming projects or there are other updates about your projects.",
  "There are coupons, promotions, surveys, and project ideas you might like.",
  "We have updates about your account, projects, and security/privacy matters.",
];

const emailMeContents = [
  "Cost guides, project checklists, and tips from VendorForest Vendors & Pro Vendors",
  "Personalized suggestions for projects, pro vendors, vendors, and more",
  "Discounts, rewards, and promotions",
  "Quick surveys to get your ideas for improving VendorForest",
  "Incomplete request reminders, recurring project reminders, and more",
  "Feature updates and product announcements",
];

class VendorNotification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNotification: 0,
      increaseMsg: 0,
      emailUnread: 0,
      emailUnreadTime: 0,
      offlineNoti: false,
      pushNoties: [],
      emailMe: [],
    };
  }

  render() {
    return (
      <div className="provendor-notification">
        <Card
          title="Messages"
          style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)", marginBottom: "50px" }}
        >
          <div className="row">
            <div className="col-md-4">
              <Form.Item label="Show notifications for:" required>
                <Select
                  value={String(this.state.showNotification)}
                  onChange={(value) => {
                    this.setState({
                      showNotification: Number(value),
                    });
                  }}
                >
                  <Select.Option value="0">All Activity</Select.Option>
                  <Select.Option value="1">Activity Item 1</Select.Option>
                  <Select.Option value="2">Activity Item 2</Select.Option>
                  <Select.Option value="3">Activity Item 3</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-8"></div>
            <div className="col-md-4">
              <Form.Item label="Increment message counter for:" required>
                <Select
                  value={String(this.state.increaseMsg)}
                  onChange={(value) => {
                    this.setState({
                      increaseMsg: Number(value),
                    });
                  }}
                >
                  <Select.Option value="0">All Activity</Select.Option>
                  <Select.Option value="1">Activity Item 1</Select.Option>
                  <Select.Option value="2">Activity Item 2</Select.Option>
                  <Select.Option value="3">Activity Item 3</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-8"></div>
            <div className="col-12">
              <button className="button-primary">Save</button>
            </div>
          </div>
        </Card>
        <Card
          title="Email"
          style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)", marginBottom: "50px" }}
        >
          <h6 className="mb-4">Sending email to (g***kase***@gmail.com)</h6>
          <div className="row">
            <div className="col-md-4">
              <Form.Item label="Send an email with unread activity for:" required>
                <Select
                  value={String(this.state.emailUnread)}
                  onChange={(value) => {
                    this.setState({
                      emailUnread: Number(value),
                    });
                  }}
                >
                  <Select.Option value="0">All Activity</Select.Option>
                  <Select.Option value="1">Activity Item 1</Select.Option>
                  <Select.Option value="2">Activity Item 2</Select.Option>
                  <Select.Option value="3">Activity Item 3</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item label="" required style={{ marginTop: "47px" }}>
                <Select
                  value={String(this.state.emailUnreadTime)}
                  onChange={(value) => {
                    this.setState({
                      emailUnreadTime: Number(value),
                    });
                  }}
                >
                  <Select.Option value="0">After every 15 min</Select.Option>
                  <Select.Option value="1">After every 30 min</Select.Option>
                  <Select.Option value="2">After every 60 min</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-4"></div>
            <div className="col-md-12 mb-5">
              <Checkbox
                onChange={(e) => {
                  this.setState({
                    offlineNoti: e.target.checked,
                  });
                }}
              >
                Only send when offline or idle
              </Checkbox>
            </div>
            <div className="col-12">
              <button className="button-primary">Save</button>
            </div>
          </div>
        </Card>
        <Card
          title="Other VendorForest Email Updates"
          style={{ boxShadow: "0 1px 6px rgba(57,73,76,.35)", marginBottom: "50px" }}
        >
          <div className="getpushnoti w-100 mb-4">
            <h6 className="mb-3">Get push notifications when:</h6>
            <CheckboxGroup
              options={pushNotiContents}
              value={this.state.pushNoties}
              onChange={(list) => {
                this.setState({
                  pushNoties: list,
                });
              }}
            />
          </div>
          <div className="getpushnoti w-100 mb-4">
            <h6 className="mb-3">Get push notifications when:</h6>
            <CheckboxGroup
              options={emailMeContents}
              value={this.state.emailMe}
              onChange={(list) => {
                this.setState({
                  emailMe: list,
                });
              }}
            />
          </div>
          <div className="w-100">
            <button className="button-primary">Save</button>
          </div>
        </Card>
      </div>
    );
  }
}

export default VendorNotification;
