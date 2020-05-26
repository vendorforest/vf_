import React from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import styles from "./index.scss";
import { connect } from "react-redux";
import logo from "@Components/images/logo.svg";
import { Button, Input, Icon } from "antd";

const { Search } = Input;

class PublicHeader extends React.Component {

	constructor(props) {

		super(props);

		this.state = {

			isShowSecondaryMenu: true
		};

		this.scondaryMenuRef = React.createRef()
	}

	componentDidMount(){

		if (!this.props.hideSecondaryMenu){

			window.addEventListener('scroll', this.stickyHeader)
		}else{

			this.scondaryMenuRef.current.className = 'scondary-menu-content hide'

            this.setState({isShowSecondaryMenu : false})
		}
	}


	componentWillUnmount(){

		if (!this.props.hideSecondaryMenu){

			window.removeEventListener('scroll', this.stickyHeader)
		}
	}


	stickyHeader = () => {

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop

        // @ts-ignore
        if (winScroll < 150 & !this.state.isShowSecondaryMenu) {

            this.scondaryMenuRef.current.className += ' show'

            this.setState({isShowSecondaryMenu : true})
        }

        // @ts-ignore
        if (winScroll >= 150  & this.state.isShowSecondaryMenu) {

            this.scondaryMenuRef.current.className = this.scondaryMenuRef.current.className.replace(' show', '')

            this.setState({isShowSecondaryMenu : false})
        }
	}
	
	search = (value) => {

    }
    
    goHome = () => {

        window.location.href = "/"
    }


	render() {
        
        return <div id="public-header">
            <div className="menu-content">
                <div className="container-lg container-fluid h-100">
                    <div className="row h-100">
                        <div className="col-12 h-100 d-flex align-items-center justify-content-lg-start justify-content-between">
                            <div className="d-block d-lg-none">&nbsp;</div>
                            <div className="logo">
                                <img src={logo} onClick={this.goHome}/>
                            </div>
                            <div className="search-box d-xl-block d-none">
                                <Search placeholder="Find Vendors" onSearch={this.search} size="large"/>
                            </div>
                            <div className="menu d-lg-block d-none">
                                <ul className="m-0 p-0">
                                    <li className="menu-item">
                                        <a className="menu-label" href="/register">SIGN UP</a>
                                    </li>
                                    <li className="menu-item">
                                        <a className="menu-label" href="/login">LOGIN</a>
                                    </li>
                                    <li className="menu-item">
                                        <a className="menu-label" href="/login">POST A JOB</a>
                                    </li>
                                    <li className="menu-item">
                                        <Button type="primary" href="/login">I AM A VENDOR</Button>
                                    </li>
                                </ul>
                            </div>
                            <div className="menu mobile d-lg-none">
                                <div className={`hamburger-btn ${this.props.isOpenMobileMenu ? 'text-color' : ''}`} onClick={this.props.toggleMobileMenu}>
                                    { this.props.isOpenMobileMenu ? <Icon type="close" /> : <Icon type="menu" />}
                                </div>
                                <div className={`menu-content ${this.props.isOpenMobileMenu ? 'show' : ''}`}>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="search-box w-100 px-3 mb-4">
                                                <Search placeholder="Find Vendors" onSearch={this.search} size="large"/>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <ul className="m-0 p-0">
                                                <li><a href="/">HOW IT WORKS</a></li>
                                                <li><a href="/register">SIGN UP</a></li>
                                                <li><a href="/login">LOGIN</a></li>
                                                <li><a href="/login">POST A JOB</a></li>
                                                <li><a href="/login">I AM A VENDOR</a></li>
                                            </ul>
                                        </div>
                                        <div className="col-sm-6 d-none d-sm-block">
                                            <h6 className="text-color text-center mb-4">POPULATE SERVICE</h6>
                                            <ul className="m-0 p-0">
                                                <li>Additions & Remodels</li>
                                                <li>Appliances</li>
                                                <li>Cleaning</li>
                                                <li>Beauty</li>
                                                <li>Event Entertainment</li>
                                                <li>Food</li>
                                                <li>Music & Dance</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
			</div>
			<div className="scondary-menu-content show d-lg-block d-none" ref={this.scondaryMenuRef}>
                <div className="container-lg container-fluid h-100">
                    <div className="row h-100">
                        <div className="col-12 h-100">
                            <ul>
                                <li>Additions & Remodels</li>
                                <li>Appliances</li>
                                <li>Cleaning</li>
                                <li>Beauty</li>
                                <li>Event Entertainment</li>
                                <li>Food</li>
                                <li>Music & Dance</li>
                            </ul>
                        </div>
                    </div>
                </div>
			</div>
		</div>
	}
}

const mapStateToProps = ({ loginReducer }) => {

	const { user } = loginReducer;

	return { user };
};

export default connect(mapStateToProps, {})(withStyles(styles)(PublicHeader));