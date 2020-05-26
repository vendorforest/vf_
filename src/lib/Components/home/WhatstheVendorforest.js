import React from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import TopRatedVendorCard from "./TopRatedVendorCard";
import AliceCarousel from "react-alice-carousel";
import style from "alice";

class TopRatedVendors extends React.Component {

	constructor(props) {

		super(props);

		this.state = {};
	}

	componentDidMount() {
		
	}

	
	render() {

		return <div style={{ background: "#F2F2F2" }} className="px-2 px-sm-0">
			<div className="container whatsvendorforest">
				<div className="row">
                    <div className="col-12">
                        <h1 className="mb-5 text-center">We connect vendors to clients looking to hire them for specific skills.</h1>
                    </div>
                    <div className="col-lg-6">
                        <h4 className="font-weight-bold mb-lg-3 mb-2">1. VendorForest will help promote your brand.</h4>
                        <p className=" mb-lg-4 mb-3 ml-0 ml-lg-4">We believe that it doesn’t have to be hard to find a vendor or client online, It’s our job is to help to vendor get exposed to all the clients looking to hire them, and facilitate that connection.</p>
                        <h4 className="font-weight-bold mb-lg-3 mb-2">2. VendorForest will help increase your revenue</h4>
                        <p className=" mb-lg-4 mb-3 ml-0 ml-lg-4">By cutting down all the unnecessary fees our clients are paying almost nothing expect the job rate, and our vendors are walking keeping all the money, and the only thing that they are paying is the commission fee. Everything else is free!</p>
                    </div>
					<div className="col-lg-6">
						<iframe
							width={'100%'}
							height={315}
							src="https://www.youtube.com/embed/7gsTKhhAy2k?controls=0"
							frameBorder={0}
							allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						/>
					</div>
				</div>
			</div>
		</div>
	}
}

export default withStyles(style)(TopRatedVendors);
