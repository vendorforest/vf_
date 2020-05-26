import React from "react";

import withStyles from "isomorphic-style-loader/withStyles";
import { Footer, Header } from "@Components/inc";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
import { services } from "@Shared/services.json";
import $ from "jquery";

class ServiceCategories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
    };
  }

  componentDidMount() {
    this.setState({
      services: services,
    });
    const id = this.props.match.params.id;
    $(document).ready(function() {
      $("html, body").animate(
        {
          scrollTop: $(`#${id}`).offset().top - 150,
        },
        500,
      );
    });
  }

  getCategoryGroup(service) {
    const categories = service.categories;
    let catCountData = categories.map((cat) => {
      cat.counts = cat.subCategories.length;
      return cat;
    });
    catCountData.sort((a, b) => (a.counts < b.counts ? 1 : a.counts > b.counts ? -1 : 0));
    let sum = 0;
    catCountData.forEach((category) => {
      sum += category.counts;
    });
    const avgSum = Math.floor(sum / 3);
    let categoryGroup = [];
    if (catCountData.length < 4) {
      catCountData.forEach((category) => {
        categoryGroup.push([category]);
      });
      return categoryGroup;
    }
    for (let i = 0; i < 3; i++) {
      let group = [];
      group.push(catCountData[0]);
      let tempSum = catCountData[0].counts;
      catCountData.splice(0, 1);
      let flag = false;
      while (!flag && catCountData.length > 0) {
        for (let j = catCountData.length - 1; j >= 0; j--) {
          if (tempSum + catCountData[j].counts >= avgSum) {
            group.push(catCountData[j]);
            tempSum += catCountData[j].counts;
            catCountData.splice(j, 1);
            flag = true;
            break;
          }
        }
        if (!flag) {
          group.push(catCountData[0]);
          tempSum += catCountData[0].counts;
          catCountData.splice(0, 1);
        }
      }
      categoryGroup.push(group);
    }
    return categoryGroup;
  }

  render() {
    const displaySubCategoris = (subCategories) => {
      return subCategories.map((subcategory, index) => {
        return (
          <a href={`/findvendors?subcat=${subcategory}`} key={index}>
            <p className="text-grey mb-2">{subcategory}</p>
          </a>
        );
      });
    };

    const displayCategories = (catGroup) => {
      return catGroup.map((category, index) => {
        return (
          <div className="categories mb-4" key={index}>
            <h5 className="mb-2 font-weight-bold">{category.name}</h5>
            {displaySubCategoris(category.subCategories)}
          </div>
        );
      });
    };

    const displayService = () => {
      return this.state.services.map((service, index) => {
        const catGroups = this.getCategoryGroup(service);
        return (
          <div id={service.name.toLowerCase()} key={index}>
            <h2 className="text-center mt-4 mb-5 font-weight-bold">{service.name}</h2>
            <div className="row">
              <div className="col-md-4 mb-4">
                {catGroups.length > 0 && displayCategories(catGroups[0])}
              </div>
              <div className="col-md-4 mb-4">
                {catGroups.length > 1 && displayCategories(catGroups[1])}
              </div>
              <div className="col-md-4 mb-4">
                {catGroups.length > 2 && displayCategories(catGroups[2])}
              </div>
            </div>
          </div>
        );
      });
    };

    return (
      <div className="service-categories-section">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="shadow serivce-content">
                  {this.state.services.length > 0 && displayService()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
export default withStyles(globalStyle, localStyle)(ServiceCategories);
