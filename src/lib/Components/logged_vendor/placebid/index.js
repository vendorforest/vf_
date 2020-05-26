import React from "react";
import { Input, Icon, Radio, InputNumber, Checkbox, Tag, Form, message } from "antd";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import withStyles from "isomorphic-style-loader/withStyles";
import { Footer, Header } from "@Components/inc";
import SelectTeamMember from "./SelectTeamMember";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import {
  fetchGetJobData,
  fetchGetProposalData,
  fetchTeamsData,
  fetchProposalSubmit,
  fetchProposalUpdate,
} from "./essential";

import { constants } from "@Shared/constants";
import moment from "moment";
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

class PlaceBid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answers: [],
      bidType: 0,
      offerBudget: undefined,
      fee: 25,
      getPaidPrice: undefined,
      teams: [],
      btnPending: false,
    };
    this.updateTeam = this.updateTeam.bind(this);
    this.proposalSubmit = this.proposalSubmit.bind(this);
  }

  componentDidMount() {
    if (this.isUpdate()) {
      this.props.fetchGetProposalData({
        _id: this.props.match.params.proposal_id,
      });
    } else {
      this.props.fetchGetJobData({
        _id: this.props.match.params.job_id,
      });
    }
    this.props.fetchTeamsData();
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.success && props.success) {
      message.success(props.success);
      if (!props.match.params.proposal_id) {
        props.history.push("/vendor/findjob");
      }
    }
    if (!state.error && props.error) {
      message.error(props.error);
    }
    if (!state.proposal && props.proposal) {
      return {
        bidType: props.proposal.bidType,
        offerBudget: props.proposal.offerBudget,
        getPaidPrice: props.proposal.offerBudget * 0.75,
      };
    }
    if (
      props.teams &&
      props.proposal &&
      props.proposal.bidType === constants.BID_TYPE.TEAM &&
      state.teams.length === 0
    ) {
      const newTeams = [...props.teams].filter((team) => {
        return (
          props.proposal.offers.filter((offer) => {
            if (team._id === offer.team) {
              team.members.forEach((member) => {
                if (member._id === offer.receiver) {
                  member.isSelected = true;
                  member.budget = offer.budget;
                }
              });
              return true;
            }
            return false;
          }).length > 0
        );
      });
      return {
        teams: newTeams,
      };
    }
    return null;
  }

  isUpdate() {
    if (this.props.match.params.proposal_id) {
      return true;
    }
    return false;
  }

  displaySkills() {
    return this.props.job.subCategories.map((subct, index) => {
      return (
        <Tag key={index} color="#ddd" className="text-dark mb-1">
          {subct}
        </Tag>
      );
    });
  }

  getBudgetType() {
    return this.props.job.budgetType === constants.BUDGET_TYPE.FIXED ? "Fixed Price" : "Hourly";
  }

  async updateTeam(newTeam) {
    const newTeams = [...this.state.teams];
    var offeredBudget =
      this.state.offerBudget === undefined ? this.props.job.budget : this.state.offerBudget;
    var totalBidBudget = 0;
    await newTeams.map((newTeam) => {
      newTeam.members.map((member) => {
        totalBidBudget += member.budget;
      });
    });
    if (totalBidBudget > offeredBudget) {
      this.setState({
        btnPending: true,
      });
      message.warning(`Please input valid price. Total Maximum price is $${offeredBudget}.`);
      return;
    } else {
      this.setState({
        btnPending: false,
      });
      const index = newTeams.findIndex((team) => team._id === newTeam._id);
      newTeams[index] = newTeam;
      this.setState({
        teams: newTeams,
      });
    }
  }

  proposalSubmit = async (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && !this.props.pending) {
        if (this.state.bidType === constants.BID_TYPE.TEAM && this.state.teams.length === 0) {
          return message.warning("Please select at least one team.");
        }
        if (this.isUpdate()) {
          const params = {
            _id: this.props.proposal._id,
            offerBudget: values.offerBudget,
            offerBudgetType: this.props.job.budgetType,
            bidType: this.state.bidType,
            answers: this.props.job.questions.map((question, index) => {
              return {
                question: question,
                answer: values[`answer${index}`],
              };
            }),
          };
          console.log('update', params)
          // this.props.fetchProposalUpdate(params);
        } else {
          if (!this.props.user.userObj.bsLocation || !this.props.user.userObj.timeZone) {
            message.warning("Please complete your profile and setting.");
            return;
          }
          const params = {
            job: this.props.job._id,
            vendor: this.props.user.userObj._id,
            offerBudget: values.offerBudget,
            offerBudgetType: this.props.job.budgetType,
            bidType: this.state.bidType,
            offers: this.generateOffers(),
            answers: this.props.job.questions.map((question, index) => {
              return {
                question: question,
                answer: values[`answer${index}`],
              };
            }),
          };
          this.props.fetchProposalSubmit(params);
        }
      }
    });
  };

  generateOffers() {
    let offers = [];
    this.state.teams.forEach((team) => {
      team.members.forEach((member) => {
        if (member.isSelected && member.budget) {
          offers.push({
            team: team._id,
            receiver: member._id,
            offerBudgetType: this.props.job.budgetType,
            budget: member.budget,
          });
        }
      });
    });
    return offers;
  }

  render() {
    const myTeams = this.props.teams
      ? this.props.teams.filter((team) => team.admin._id === this.props.user.userObj._id)
      : [];
    console.log("state === ", this.state.offerBudget);
    const generateTeams = () => {
      return this.state.teams.map((team, index) => {
        return (
          <SelectTeamMember
            key={index}
            team={team}
            disabled={this.isUpdate()}
            updateTeam={this.updateTeam}
          />
        );
      });
    };

    const generateQA = () => {
      return this.props.job.questions.map((question, index) => {
        return (
          <div className="question" key={index}>
            <p className="mb-2">{question}</p>
            <Form.Item>
              {getFieldDecorator(`answer${index}`, {
                initialValue: this.props.proposal
                  ? this.props.proposal.answers[index].answer
                  : "",
                rules: [{ required: true, message: "Please input answer" }],
              })(<TextArea className="w-100" rows={4}></TextArea>)}
            </Form.Item>
          </div>
        );
      });
    };

    const { getFieldDecorator } = this.props.form;

    return (
      <div className="place-bid">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              {!this.props.job && this.props.pending && (
                <div className="col-12 p-5 text-center loading-small shadow">
                  <Icon type="sync" spin />
                </div>
              )}
              {this.props.job && (
                <div className="col-12">
                  <div className="job-content shadow mb-5">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="job-main-content">
                          <div className="job-head">
                            <h4 className="mb-2">{this.props.job.title}</h4>
                            <div>{this.displaySkills()}</div>
                            <p>Posted 1 month a go</p>
                          </div>
                          <hr />
                          <div className="job-body">
                            <p>{this.props.job.description}</p>
                          </div>
                          <hr />
                          <div className="job-price d-flex">
                            <p className=" font-weight-bold">
                              {this.getBudgetType()}: <Icon type="dollar" />
                              <span className="ml-1">
                                ${this.props.job.budget}
                                {this.props.job.budgetType === constants.BUDGET_TYPE.HOURLY
                                  ? "/hr"
                                  : ""}
                              </span>
                            </p>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-md-8">
                              <div className="job-timeline-location">
                                <p>
                                  <span className=" font-weight-bold">Start date & time: </span>
                                  <Icon type="calendar" />
                                  <span className="ml-1">
                                    {moment(this.props.job.stDateTime).format("YYYY/MM/DD")}-
                                  </span>
                                  <Icon type="clock-circle" />
                                  <span className="ml-1">
                                    {moment(this.props.job.stDateTime).format("HH:mm")}
                                  </span>
                                </p>
                                <p>
                                  <span className=" font-weight-bold">End date & time: </span>
                                  <Icon type="calendar" />
                                  <span className="ml-1">
                                    {moment(this.props.job.endDateTime).format("YYYY/MM/DD")}-
                                  </span>
                                  <Icon type="clock-circle" />
                                  <span className="ml-1">
                                    {moment(this.props.job.endDateTime).format("HH:mm")}
                                  </span>
                                </p>
                                <p>
                                  <span className=" font-weight-bold">Location: </span>
                                  <Icon type="global" />
                                  <span className="ml-1">
                                    {this.props.job.location.city}/
                                    {this.props.job.location.country}{" "}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="col-md-4 text-right">
                              <NavLink
                                className="text-color font-weight-bold"
                                to={`/vendor/job/${this.props.job._id}`}
                              >
                                View Job Details
                              </NavLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bid-content shadow">
                    <Form layout="vertical" onSubmit={this.proposalSubmit}>
                      <div className="bid-type">
                        <Radio.Group
                          onChange={(e) => {
                            this.setState({
                              bidType: e.target.value,
                            });
                          }}
                          value={this.state.bidType}
                        >
                          <Radio value={0} className="mb-2 mb-md-0">
                            Placing bid as individual
                          </Radio>
                          <Radio value={1} disabled={myTeams.length === 0 ? true : false}>
                            Placing bid as a Team
                          </Radio>
                        </Radio.Group>
                      </div>
                      <hr />
                      <div className="bid-price">
                        <div className="d-md-flex d-block align-items-center mb-2 ">
                          <p className="price-label">For how much will you do this work for?</p>
                          <div className="price-value d-flex align-items-center">
                            <Form.Item className="mb-0 pb-0">
                              {getFieldDecorator("offerBudget", {
                                initialValue: this.state.offerBudget
                                  ? this.state.offerBudget
                                  : this.props.job.budget, //solution
                                rules: [{ required: true, message: "" }],
                              })(
                                <InputNumber
                                  onChange={(value) => {
                                    this.setState({
                                      offerBudget: value,
                                      getPaidPrice: value * 0.75,
                                    });
                                    // window.offerBudget = value;
                                  }}
                                  style={{ minWidth: "150px" }}
                                  formatter={(value) =>
                                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                />,
                              )}
                            </Form.Item>
                            <div className="ml-1">
                              {this.props.job.budgetType === constants.BUDGET_TYPE.HOURLY
                                ? "/hr"
                                : ""}
                            </div>
                          </div>
                        </div>
                        <div className="d-md-flex d-block align-items-center mb-2">
                          <p className="price-label">VendorForest Fee</p>
                          <p className=" font-weight-bold">{this.state.fee}%</p>
                        </div>
                        <div className="d-md-flex d-block align-items-center mb-2">
                          <p className="price-label">For how much will you do this work for?</p>
                          <div className="price-value">
                            <InputNumber
                              value={this.state.getPaidPrice || this.props.job.budget * 0.75}
                              onChange={(value) => {
                                this.setState({
                                  getPaidPrice: value,
                                });
                                this.props.form.setFieldsValue({
                                  offerBudget: value / 0.75,
                                });
                              }}
                              style={{ minWidth: "150px" }}
                              formatter={(value) =>
                                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              }
                              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            />{" "}
                            <span>
                              {this.props.job.budgetType === constants.BUDGET_TYPE.HOURLY
                                ? "/hr"
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      <hr />
                      {this.state.bidType === 1 && (
                        <div className="provendor-option">
                          <div className="select-team">
                            <h6 className="mb-3">Select your teams</h6>
                            <CheckboxGroup
                              value={this.state.teams.map((team) => team.name)}
                              options={myTeams.map((team) => team.name)}
                              disabled={this.isUpdate()}
                              onChange={(checkList) => {
                                let newTeams = [...myTeams].filter(
                                  (team) => checkList.indexOf(team.name) > -1,
                                );
                                newTeams = newTeams.map((team) => {
                                  const members = team.members.map((member) => {
                                    (member.isSelected = false), (member.budget = undefined);
                                    return member;
                                  });
                                  team.members = members;
                                  return team;
                                });
                                this.setState({
                                  teams: newTeams,
                                });
                              }}
                            />
                          </div>
                          <div className="select-members">{generateTeams()}</div>
                          <hr />
                        </div>
                      )}
                      <div className="bid-additional-question">
                        <h6 className="mb-3">Screening Questions</h6>
                        {generateQA()}
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          className={`button-primary mb-3 ${
                            this.props.pending || this.state.btnPending === true
                              ? "disable hidden"
                              : ""
                          }`}
                          type="submit"
                        >
                          {this.isUpdate() ? "Update" : "Submit"}
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ vendorPlaceBidReducer, loginReducer }) => {
  const { error, job, proposal, teams, success, pending } = vendorPlaceBidReducer;

  const { user } = loginReducer;

  return {
    error,
    job,
    proposal,
    teams,
    success,
    pending,
    user,
  };
};
const PlaceBidForm = Form.create({ name: "place_bid" })(PlaceBid);
export default connect(mapStateToProps, {
  fetchGetJobData,
  fetchGetProposalData,
  fetchTeamsData,
  fetchProposalSubmit,
  fetchProposalUpdate,
})(withStyles(globalStyle, localStyle)(PlaceBidForm));
