// @ts-nocheck
import React from "react";
import { Icon, Card, Table, Divider, Modal, Button } from "antd";
import VendorEditTeam from "./EditTeam";

class VendorTeamSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: [],
      selectedTeam: undefined,
      isModal: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  selectTeam(index) {
    this.setState({
      selectedTeam: index !== undefined ? this.state.teams[index] : undefined,
    });
    this.toggle();
  }

  toggle() {
    this.setState({
      isModal: !this.state.isModal,
      currentStep: 0,
    });
  }

  componentDidMount() {
    let teams = [];
    for (let i = 0; i < 20; i++) {
      teams.push({
        name: "Team Wakanda",
        members: [
          {
            email: "gerardkasemba@mail.com",
            permission: 0,
          },
          {
            email: "jaonmicle@mail.com",
            permission: 1,
          },
        ],
        about:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure eligendi laboriosam optio! Repudiandae in, commodi, autem voluptatum eveniet rem nostrum.",
      });
    }
    this.setState({
      teams: teams,
    });
  }

  render() {
    const columns = [
      {
        title: "Team Name",
        dataIndex: "name",
        key: "name",
        render: (name) => <div style={{ minWidth: "120px" }}>{name}</div>,
      },
      {
        title: "Members",
        dataIndex: "members",
        key: "members",
        render: (members) => <div>{members.length}</div>,
      },
      {
        title: "About",
        dataIndex: "about",
        key: "about",
      },
      {
        title: "",
        key: "action",
        render: (text, record, index) => (
          <span
            style={{
              display: "block",
              minWidth: "130px",
            }}
          >
            <a
              className="text-color pointer"
              onClick={() => {
                this.selectTeam(index);
              }}
            >
              <Icon type="edit" className="mr-1" />
              Edit
            </a>
            <Divider type="vertical" />
            <a className="text-red">
              <Icon type="delete" className="mr-1" />
              Delete
            </a>
          </span>
        ),
      },
    ];

    return (
      <div className="vendor-team">
        <Card
          title={<span className="h5 font-weight-bold">Teams & Settings</span>}
          style={{ marginBottom: "50px" }}
        >
          <div className="row">
            <div className="col-md-12 d-flex justify-content-end mb-3">
              <button
                className="button-white"
                onClick={() => {
                  this.selectTeam();
                }}
              >
                Create a New Team
              </button>
            </div>
            <div className="col-md-12">
              <Table columns={columns} dataSource={this.state.teams} />
            </div>
          </div>
          <Modal
            title="Add Team"
            visible={this.state.isModal}
            onOk={this.toggle}
            onCancel={this.toggle}
            width={"650px"}
            footer={
              <Button
                key="next"
                type="primary"
                onClick={this.toggle}
                style={{ width: "100px" }}
              >
                Save
              </Button>
            }
          >
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <VendorEditTeam team={this.state.selectedTeam} />
                </div>
              </div>
            </div>
          </Modal>
        </Card>
      </div>
    );
  }
}

export default VendorTeamSettings;
