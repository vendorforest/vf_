import React from "react";

class HomeSearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vendorName: "",
      zipCode: "",
    };
  }

  render() {
    return (
      <div className="home-searchbar">
        <input
          type="search"
          name="q"
          className="sq"
          value={this.state.vendorName}
          placeholder="Who do you need to hire"
          onChange={(e) => {
            this.setState({
              vendorName: e.target.value,
            });
          }}
        />
        <input
          type="search"
          name="q"
          className="sbtn"
          placeholder="Zip Code"
          value={this.state.zipCode}
          onChange={(e) => {
            this.setState({
              zipCode: e.target.value,
            });
          }}
        />
        <button
          className="button-primary"
          onClick={() => {
            window.location.href = `/findvendors?vendor=${
              this.state.vendorName !== "" ? this.state.vendorName : "a"
            }&&zip=${this.state.zipCode !== "" ? this.state.zipCode : "a"}`;
          }}
        >
          Get Started
        </button>
      </div>
    );
  }
}

export default HomeSearchBar;
