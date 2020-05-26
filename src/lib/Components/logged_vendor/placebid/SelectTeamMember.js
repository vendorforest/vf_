import React from "react";
import { connect } from "react-redux";
import { Input, Avatar, Checkbox, InputNumber, Icon, Progress, Rate } from "antd";
import { constants } from "@Shared/constants";
import defaultProfileImage from "@Components/images/profileplace.png";
const { Search } = Input;

class SelectTeamMember extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { team } = this.props;

    team.members = team.members.filter((member) => member._id !== this.props.user.userObj._id);

    const generateMembers = () => {
      return team.members.map((member, index) => {
        return (
          <div
            className={`member p-2 ${index < team.members.length - 1 ? "border-bottom" : ""}`}
            key={index}
          >
            <div className="row">
              <div className="col-md-5">
                <div className="member-info d-flex align-items-center">
                  <Checkbox
                    value={index}
                    onChange={() => {
                      if (this.props.disabled) {
                        return;
                      }
                      const newTeam = { ...team };
                      newTeam.members[index].isSelected = !newTeam.members[index].isSelected;
                      this.props.updateTeam(newTeam);
                    }}
                    className="mr-3"
                    checked={member.isSelected}
                    disabled={this.props.disabled}
                  />
                  <img
                    src={member.profileImage || defaultProfileImage}
                    alt="vendorprofileimage"
                    style={{ height: "50px", width: "50px" }}
                  />
                  <div className="member-name ml-3">
                    <h6 className=" font-weight-bold">{member.username}</h6>
                    {member.vendor.service && member.vendor.category && (
                      <p>
                        {member.vendor.service
                          ? `${member.vendor.service.name} / ${member.vendor.category.name}`
                          : "NONE"}
                      </p>
                    )}
                    {member.bsLocation && (
                      <p>
                        <span className=" font-weight-bold">Location: </span>
                        <Icon type="global" />
                        <span className="ml-1">
                          {member.bsLocation.city}/{member.bsLocation.country}{" "}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <Progress
                  percent={member.vendor.jobs !== 0 ? member.vendor.jobCompletedRate : 0 }
                  size="small"
                  status="active"
                  className="job-progress"
                  style={{ width: "165px" }}
                />
                <div>
                  <Rate
                    disabled
                    value={member.vendor.rate}
                  />
                  <span>
                    {member.vendor.rate}
                  </span>
                </div>
              </div>
              <div className="col-md-3 d-flex justify-content-end align-items-center">
                {member.isSelected && (
                  <InputNumber
                    value={member.budget}
                    disabled={this.props.disabled}
                    onChange={(value) => {
                      if (this.props.disabled) {
                        return;
                      }
                      const newTeam = { ...team };
                      newTeam.members[index].budget = value;
                      this.props.updateTeam(newTeam);
                    }}
                    style={{ minWidth: "200px" }}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                )}
              </div>
            </div>
          </div>
        );
      });
    };
    return (
      <div className="select-teammember">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-11">
            <hr />
            <p className="mb-3 font-weight-bold">{team.members.length} Members</p>
            <div className="members">{generateMembers()}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ loginReducer }) => {
  const { user } = loginReducer;
  return {
    user,
  };
};

export default connect(mapStateToProps, {})(SelectTeamMember);
