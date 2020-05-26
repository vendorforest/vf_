import React from "react";
import JobItem from "./JobItem";

class NewPostedJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const generateJobs = () => {
      return (
        this.props.jobs &&
        this.props.jobs.map((job, index) => {
          return <JobItem job={job} key={index} />;
        })
      );
    };

    return (
      <div className="newposted-jobs">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="mb-5">
                Browse top jobs <span className="text-color">Near <br />
    You</span>
              </h1>
              <div className="content">{generateJobs()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewPostedJobs;
