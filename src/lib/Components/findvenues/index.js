import React from "react";
import { Input, Radio, Icon, List, Checkbox, DatePicker } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import moment from "moment";

import { Footer, Header } from "@Components/inc";
import VenueItem from "./VenueItem";
import globalStyle from "@Sass/index.scss";
import localStyle from "./index.scss";
const CheckboxGroup = Checkbox.Group;
const Search = Input.Search;

const filterCategories = [
  "All Categories",
  "Barn & Farm Weddings",
  "Hotel Weddings",
  "Winery Weddings",
  "Formal / prom",
  "Fundraiser",
  "Reunion",
  "Shower (baby, bridal, etc.)",
  "Graduation party",
  "Anniversary party",
];
const filterEventTypes = [
  "Wedding",
  "Corporate Event",
  "Conference / convention",
  "Birthday party",
  "Formal / prom",
  "Fundraiser",
  "Reunion",
  "Shower (baby, bridal, etc.)",
  "Graduation party",
  "Anniversary party",
];

const filterMaxCapacities = [
  "25 or fewer guests",
  "25 - 50 guests",
  "51 -  100 guests",
  "101 - 150 guests",
  "151 - 200 guests",
  "201 - 250 guests",
];

const filterRentalDurations = ["Half Day", "Full Day"];

const filterSettings = ["Indoor", "Covered Outdoor", "Uncovered Outdoor"];

const filterSpaceNeedTypes = [
  "Party / reception space",
  "Dining space",
  "Meeting space",
  "Presentation space",
  "Kitchen",
  "Parking",
];

const filterServiceTypes = [
  "Sound equipment",
  "Video equipment",
  "Microphones",
  "Tables & chairs",
  "Tableware",
  "Lighting",
  "Valet parking",
  "Catering Services",
  "Bar Services",
  "Clean Up",
  "Pet Friendly",
  "Wifi",
];

class FindVenue extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      venues: [],
      filterCategory: 0,
      lessCategory: true,
      filterEventType: 0,
      lessEvent: true,
      filterMaxCapacity: 0,
      lessMaxCapacity: true,
      filterRentalDuration: 0,
      filterSetting: 0,
      filterSpaceNeeds: [],
      lessSpaceneed: true,
      filterServices: [],
      lessService: true,
      filterAvailability: moment(),
      showFilter: true,
    };
  }

  componentDidMount() {
    let venues = [];
    for (let i = 0; i < 20; i++) {
      venues.push({
        name: "Altamont Manor",
        rate: 5.0,
        reviews: 144,
        service: "Garden Weddings",
        location: "Altamont, NY",
        overview:
          "Altamont Manor, an historic wedding venue in the Albany, New York area, is an 1894 Victorian Manor with elegant indoor and outdoor spaces. Couples can marry...",
        hourlyRate: 100,
        deposit: 100,
      });
    }
    this.setState({
      venues: venues,
    });
  }

  render() {
    const generateFilterCategoryOptions = () => {
      return filterCategories.map((category, index) => {
        return (
          <Radio
            value={index}
            key={index}
            className={index > 4 && this.state.lessCategory ? "d-none" : "d-block"}
          >
            {category}
          </Radio>
        );
      });
    };

    const generateFilterEventTypeOptions = () => {
      return filterEventTypes.map((eventType, index) => {
        return (
          <Radio
            value={index}
            key={index}
            className={index > 4 && this.state.lessEvent ? "d-none" : "d-block"}
          >
            {eventType}
          </Radio>
        );
      });
    };

    const generateFilterMaxCapacitiesOptions = () => {
      return filterMaxCapacities.map((capacity, index) => {
        return (
          <Radio
            value={index}
            key={index}
            className={index > 4 && this.state.lessMaxCapacity ? "d-none" : "d-block"}
          >
            {capacity}
          </Radio>
        );
      });
    };

    const generateFilterRentalDurationsOptions = () => {
      return filterRentalDurations.map((rental, index) => {
        return (
          <Radio value={index} key={index} className="d-block">
            {rental}
          </Radio>
        );
      });
    };

    const generateFilterSettingsOptions = () => {
      return filterSettings.map((setting, index) => {
        return (
          <Radio value={index} key={index} className="d-block">
            {setting}
          </Radio>
        );
      });
    };

    return (
      <div className="find-venue">
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-md-3 mb-4">
                <div
                  className="d-flex justify-content-between shadow bg-white d-block d-md-none mb-1 pointer text-color"
                  style={{ padding: "12px" }}
                  onClick={() => {
                    this.setState({
                      showFilter: !this.state.showFilter,
                    });
                  }}
                >
                  <div>Search Filter Setting</div>
                  <div>{this.state.showFilter ? <Icon type="up" /> : <Icon type="down" />}</div>
                </div>
                <div
                  className={`filter ${
                    this.state.showFilter ? "d-block" : "d-none d-md-block"
                  }`}
                >
                  <h4 className="my-5 d-none d-md-block">Filter</h4>
                  <div className="filter-items mb-4">
                    <h6 className="pb-3 border-bottom mb-2">Category</h6>
                    <Radio.Group
                      onChange={(e) => {
                        this.setState({
                          filterCategory: e.target.value,
                        });
                      }}
                      value={this.state.filterCategory}
                    >
                      {generateFilterCategoryOptions()}
                    </Radio.Group>
                    <p
                      className="text-color less"
                      onClick={() => {
                        this.setState({
                          lessCategory: !this.state.lessCategory,
                        });
                      }}
                    >
                      {this.state.lessCategory ? "more" : "less"}
                    </p>
                  </div>
                  <div className="filter-items mb-4">
                    <h6 className="pb-3 border-bottom mb-2">Availability</h6>
                    <DatePicker
                      onChange={(date, dateString) => {
                        process.env.NODE_ENV === "development" && console.log(date, dateString);
                      }}
                    />
                  </div>
                  <div className="filter-items mb-4">
                    <h6 className="pb-3 border-bottom mb-2">Event Type</h6>
                    <Radio.Group
                      onChange={(e) => {
                        this.setState({
                          filterEventType: e.target.value,
                        });
                      }}
                      value={this.state.filterEventType}
                    >
                      {generateFilterEventTypeOptions()}
                    </Radio.Group>
                    <p
                      className="text-color less"
                      onClick={() => {
                        this.setState({
                          lessEvent: !this.state.lessEvent,
                        });
                      }}
                    >
                      {this.state.lessEvent ? "more" : "less"}
                    </p>
                  </div>
                  <div className="filter-items mb-4">
                    <h6 className="pb-3 border-bottom mb-2">Maximum Capacity</h6>
                    <Radio.Group
                      onChange={(e) => {
                        this.setState({
                          filterMaxCapacity: e.target.value,
                        });
                      }}
                      value={this.state.filterMaxCapacity}
                    >
                      {generateFilterMaxCapacitiesOptions()}
                    </Radio.Group>
                    <p
                      className="text-color less"
                      onClick={() => {
                        this.setState({
                          lessMaxCapacity: !this.state.lessMaxCapacity,
                        });
                      }}
                    >
                      {this.state.lessMaxCapacity ? "more" : "less"}
                    </p>
                  </div>
                  <div className="filter-items mb-4">
                    <h6 className="pb-3 border-bottom mb-2">Rental Duration</h6>
                    <Radio.Group
                      onChange={(e) => {
                        this.setState({
                          filterRentalDuration: e.target.value,
                        });
                      }}
                      value={this.state.filterRentalDuration}
                    >
                      {generateFilterRentalDurationsOptions()}
                    </Radio.Group>
                  </div>
                  <div className="filter-items mb-4">
                    <h6 className="pb-3 border-bottom mb-2">Settings</h6>
                    <Radio.Group
                      onChange={(e) => {
                        this.setState({
                          filterSetting: e.target.value,
                        });
                      }}
                      value={this.state.filterSetting}
                    >
                      {generateFilterSettingsOptions()}
                    </Radio.Group>
                  </div>
                  <div className="filter-items mb-4">
                    <h6 className="pb-3 border-bottom mb-2">Space needs</h6>
                    <CheckboxGroup
                      value={this.state.filterSpaceNeeds}
                      options={
                        this.state.lessSpaceneed
                          ? filterSpaceNeedTypes.slice(0, 3)
                          : filterSpaceNeedTypes
                      }
                      onChange={(checkList) => {
                        this.setState({
                          filterSpaceNeeds: checkList,
                        });
                      }}
                    />
                    <p
                      className="text-color less"
                      onClick={() => {
                        this.setState({
                          lessSpaceneed: !this.state.lessSpaceneed,
                        });
                      }}
                    >
                      {this.state.lessSpaceneed ? "more" : "less"}
                    </p>
                  </div>
                  <div className="filter-items mb-4">
                    <h6 className="pb-3 border-bottom mb-2">Service and equipment needs</h6>
                    <CheckboxGroup
                      value={this.state.filterServices}
                      options={
                        this.state.lessService
                          ? filterServiceTypes.slice(0, 3)
                          : filterServiceTypes
                      }
                      onChange={(checkList) => {
                        this.setState({
                          filterServices: checkList,
                        });
                      }}
                    />
                    <p
                      className="text-color less"
                      onClick={() => {
                        this.setState({
                          lessService: !this.state.lessService,
                        });
                      }}
                    >
                      {this.state.lessService ? "more" : "less"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-9">
                <div className="search-bar">
                  <div className="row">
                    <div className="col-md-7 mb-2">
                      <Input
                        prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />}
                        placeholder="Waterfront wedding"
                      />
                    </div>
                    <div className="col-md-5">
                      <Search
                        placeholder="Where"
                        onSearch={(value) =>
                          process.env.NODE_ENV === "development" && console.log(value)
                        }
                        className="mb-4"
                        enterButton
                      />
                    </div>
                  </div>
                </div>
                <List
                  itemLayout="vertical"
                  size="large"
                  className="venue-list"
                  pagination={{
                    onChange: (page) => {
                      process.env.NODE_ENV === "development" && console.log(page);
                    },
                    pageSize: 20,
                  }}
                  dataSource={this.state.venues}
                  footer={<div></div>}
                  renderItem={(item, index) => (
                    <List.Item key={index} style={{ cursor: "pointer" }}>
                      <VenueItem venue={item} />
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(globalStyle, localStyle)(FindVenue);
