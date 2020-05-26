import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/withStyles";
import AddPortfolio from "./AddPortfolio";
import moment from "moment";
import style from "./index.scss";
import { fetchPortfoliosData } from "../essential";
import { Card, Modal, Button, Icon } from "antd";
const { Meta } = Card;

class VendorPortfolios extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModal: false,
      selectedPortfolio: undefined,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.props.fetchPortfoliosData();
  }

  toggle() {
    this.setState({
      isModal: !this.state.isModal,
    });
  }

  selectPortfolio(index) {
    this.setState({
      selectedPortfolio: this.props.portfolios[index],
    });
    this.toggle();
  }

  render() {
    process.env.NODE_ENV === "development" && console.log("portfolios", this.props.portfolios);

    const generateCards = () => {
      if (this.props.portfolios.length === 0) {
        return <h6 className="text-danger p-5 text-center w-100">No Portfolio</h6>;
      }
      return this.props.portfolios.map((portfolio, index) => {
        return (
          <div className="col-md-4 portfolio-card" key={index}>
            <Card
              hoverable
              onClick={() => {
                this.selectPortfolio(index);
              }}
              style={{ width: "100%", marginBottom: "24px" }}
              cover={
                <img
                  alt="cover"
                  src={portfolio.coverImage.url}
                  style={{
                    minHeight: "200px",
                    height: "200px",
                    width: "auto",
                    margin: "0 auto",
                  }}
                />
              }
            >
              <Meta title={portfolio.title} description={portfolio.caption} />
            </Card>
          </div>
        );
      });
    };

    return (
      <div className="vendor-portfolio">
        <Card
          title={<span className="h5 font-weight-bold">Portfolio</span>}
          className="shadow"
          style={{ marginBottom: "50px" }}
          extra={
            <div
              onClick={() => {
                this.setState({
                  selectedPortfolio: undefined,
                });
                this.toggle();
              }}
              className="text-color"
              style={{ cursor: "pointer" }}
            >
              <Icon type="plus" />
            </div>
          }
        >
          {!this.props.portfolios && this.props.pending && (
            <div className="w-100 p-5 text-center loading-small">
              <Icon type="sync" spin />
            </div>
          )}
          {this.props.portfolios && <div className="row">{generateCards()}</div>}
        </Card>
        <Modal
          title="Add Portfolio"
          visible={this.state.isModal}
          onOk={this.toggle}
          onCancel={this.toggle}
          width={"800px"}
          footer={[null, null]}
        >
          <AddPortfolio toggle={this.toggle} portfolio={this.state.selectedPortfolio} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = ({ vendorProfileReducer }) => {
  return ({ error, user, portfolios, pending } = vendorProfileReducer);
};

export default connect(mapStateToProps, {
  fetchPortfoliosData,
})(withStyles(style)(VendorPortfolios));
