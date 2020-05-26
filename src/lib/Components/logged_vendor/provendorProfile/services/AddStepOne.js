import React from "react";
import { Select } from "antd";
const { Option } = Select;

const serviceTypes = ["Type1", "Type2", "Type3", "Type4"];
const categories = ["Category1", "Category2", "Category3", "Category4"];
const moreItems = ["More1", "More2", "More3", "More4"];

class AddStepOne extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      serviceType: 0,
      category: 0,
      more: 0,
    };
    this.selectServiceType = this.selectServiceType.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.selectMore = this.selectMore.bind(this);
  }

  selectServiceType(value) {
    this.setState({
      serviceType: value,
    });
  }

  selectCategory(value) {
    this.setState({
      category: value,
    });
  }

  selectMore(value) {
    this.setState({
      more: value,
    });
  }

  render() {
    const generateServiceTypeOptions = () => {
      return serviceTypes.map((type, index) => {
        return <Option value={String(index)}>{type}</Option>;
      });
    };

    const generateCategoryOptions = () => {
      return categories.map((category, index) => {
        return <Option value={String(index)}>{category}</Option>;
      });
    };

    const generateMoreOptions = () => {
      return moreItems.map((more, index) => {
        return <Option value={String(index)}>{more}</Option>;
      });
    };

    return (
      <div className="addservice-stepone">
        <div className="row">
          <div className="col-12 mb-4">
            <Select
              value={String(this.state.serviceType)}
              style={{ width: "100%" }}
              onChange={(value) => {
                this.selectServiceType(Number(value));
              }}
            >
              {generateServiceTypeOptions()}
            </Select>
          </div>
          <div className="col-12 mb-4">
            <Select
              value={String(this.state.category)}
              style={{ width: "100%" }}
              onChange={(value) => {
                this.selectCategory(Number(value));
              }}
            >
              {generateCategoryOptions()}
            </Select>
          </div>
          <div className="col-12 mb-4">
            <Select
              value={String(this.state.more)}
              style={{ width: "100%" }}
              onChange={(value) => {
                this.selectMore(Number(value));
              }}
            >
              {generateMoreOptions()}
            </Select>
          </div>
        </div>
      </div>
    );
  }
}

export default AddStepOne;
