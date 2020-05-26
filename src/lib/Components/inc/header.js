import React from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import styles from "./index.scss";
import ClientHeader from "./client_header";
import VendorHeader from "./vendor_header";
import PublicHeader from "./public_header";
import { connect } from "react-redux";
import { constants } from "@Shared/constants";

class Header extends React.Component {

	constructor(props) {

		super(props);

		this.state = {

			isOpenMobileMenu: false,
		};
		
	}

	componentDidMount(){
		
	}


	componentWillUnmount(){

		
	}

	toggleMobileMenu = () => {

        this.setState({isOpenMobileMenu: !this.state.isOpenMobileMenu}, () =>{

            document.getElementsByTagName('body')[0].style.overflow = 'auto'

            if (this.state.isOpenMobileMenu){
                
                document.getElementsByTagName('body')[0].style.overflow = 'hidden'
            }
        })
    }


	render() {

		return <div id="header">
			{
				!this.props.user &&
				<PublicHeader 
					// @ts-ignore
					isOpenMobileMenu = {this.state.isOpenMobileMenu}
					toggleMobileMenu={this.toggleMobileMenu}
				/>
			}
			{
				this.props.user && this.props.user.userObj.accountType === constants.ACCOUNT_TYPE.VENDOR &&
				<VendorHeader 
					// @ts-ignore
					isOpenMobileMenu = {this.state.isOpenMobileMenu}
					toggleMobileMenu={this.toggleMobileMenu}
				/>
			}
			{
				this.props.user && this.props.user.userObj.accountType === constants.ACCOUNT_TYPE.CLIENT &&
				<ClientHeader 
					// @ts-ignore
					isOpenMobileMenu = {this.state.isOpenMobileMenu}
					toggleMobileMenu={this.toggleMobileMenu}
				/>
			}
		</div>
	}
}

const mapStateToProps = ({ loginReducer }) => {

	const { user } = loginReducer;

	return { user };
};

export default connect(mapStateToProps, {})(withStyles(styles)(Header));