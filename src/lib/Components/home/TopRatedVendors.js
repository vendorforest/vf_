import React from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import TopRatedVendorCard from "./TopRatedVendorCard";
import AliceCarousel from "react-alice-carousel";
import style from "alice";

class TopRatedVendors extends React.Component {

	constructor(props) {

		super(props);

		this.myRef = React.createRef();

		this.state = {

			visible: false,

			vendorGroup: [],
		};
	}

	componentDidMount() {
		if (this.props.vendors) {

			let vendorGroup = [];

			for (let i = 0; i < this.props.vendors.length; i += 3) {

				vendorGroup.push(this.props.vendors.slice(i, 3));
			}

			this.setState({ vendorGroup: vendorGroup });
		}
	}

	generateVendors = () => {

		return this.state.vendorGroup.map((group, index) => {

			return <div key={index} className={`carousel-item px-2 active ${index === 0 ? "active" : ""}`}>
				<div className="row">{this.generateCard(group)}</div>
			</div>
		});
	};

	generateCard = (group) => {

		return group.map((vendor, index) => {

			return <div key={index} className="col-md-4"><TopRatedVendorCard vendor={vendor} /></div>
		});
	};

	generateSlide = () => {

		return this.state.vendorGroup.map((group, index) => {

			return <li key={index} data-target="#toprated-carousel" data-slide-to={`${index}`} className={`${index === 0 ? "active" : ""}`}></li>
		});
	};

	render() {

		return <div style={{ background: "#fff" }}>
			<div className="container toprate-vendor">
				<div className="row">
				<div className="col-12">
					<h1 className="mb-5">Top vendors <br /> recommended for you</h1>
					<div id="toprated-carousel" className="carousel-inner">
					<AliceCarousel items={this.generateVendors()} buttonsDisabled />
					</div>
				</div>
				</div>
			</div>
		</div>
	}
}

export default withStyles(style)(TopRatedVendors);
