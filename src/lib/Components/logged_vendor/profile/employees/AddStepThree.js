import React from "react";
import { Select, InputNumber } from "antd";
const { Option } = Select;

const serviceTypes = ["Type1", "Type2", "Type3", "Type4"];
const categories = ["Category1", "Category2", "Category3", "Category4"];
const moreItems = ["More1", "More2", "More3", "More4"];

class AddStepThree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ratePreHr: 0,
      fixedRate: 0,
    };
    this.changeRatePerHr = this.changeRatePerHr.bind(this);
    this.changeFixedRate = this.changeFixedRate.bind(this);
  }

  changeFixedRate(value) {
    this.setState({
      ratePreHr: value,
    });
  }

  changeRatePerHr(value) {
    this.setState({
      fixedRate: value,
    });
  }

  render() {
    return (
      <div className="addemployee-stepthree">
        <div className="row">
          <div className="col-6 my-5">
            <p>Per Hour</p>
            <InputNumber
              defaultValue={35}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              step={0.1}
              onChange={this.changeRatePerHr}
            />
          </div>
          <div className="col-6 my-5">
            <p>Fix Rate</p>
            <InputNumber
              defaultValue={2000}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={this.changeFixedRate}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AddStepThree;
