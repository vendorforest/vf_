import React from "react";
import homeIcon from "@Components/images/NewIcons/icons_Home.png";
import eventsIcon from "@Components/images/NewIcons/icons_Events.png";
import weddingsIcon from "@Components/images/NewIcons/icons_Weddings.png";
import wellnessIcon from "@Components/images/NewIcons/icons_Wellness.png";
import venueIcon from "@Components/images/NewIcons/icons_Venue.png";

class HomeCategories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      top: 0,
      bottom: 0,
    };
  }

  render() {
    return (
      <div className="home-categories">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="content">
                <div className="category">
                  <a href="/categories/home">
                    <div className="link_icon">
                      <img src={homeIcon} alt="" />
                    </div>
                    <div className="">Home</div>
                  </a>
                </div>
                <div className="category">
                  <a href="/categories/events">
                    <div className="link_icon">
                      <img src={eventsIcon} alt="" />
                    </div>
                    <div className="link_content">Events</div>
                  </a>
                </div>
                <div className="category">
                  <a href="/categories/wedding">
                    <div className="link_icon">
                      <img src={weddingsIcon} alt="" />
                    </div>
                    <div className="link_content">Weddings</div>
                  </a>
                </div>
                <div className="category">
                  <a href="/categories/wellness">
                    <div className="link_icon">
                      <img src={wellnessIcon} alt="" />
                    </div>
                    <div className="link_content">Wellness</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeCategories;
