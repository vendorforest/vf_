import React from "react";
import { Icon, Badge, Input, Avatar, Button } from "antd";
import withStyles from "isomorphic-style-loader/withStyles";
import style from "./index.scss";
import logo from "@Components/images/logo.svg";
import { getNavBarNotification, logout, isRead, getBadge } from "./essential";
import { connect } from "react-redux";
import configureStore from "@Shared/configureStore";
import { withRouter } from "react-router";
const { persistor } = configureStore();

const { Search } = Input;
const ButtonGroup = Button.Group;

class ClientHeader extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            onlineStatus: 'online',

            badgeCount: 0,
        };

        this.menuRefs = new Array(3).fill(1).map(value => {return React.createRef()})
    }


    componentDidMount() {

        this.props.getNavBarNotification();

        getBadge().then((result) => {

            this.setState({ badgeCount: result.length });
        });

        window.addEventListener('click', event => {

            let target = event.target || event.srcElement || event.currentTarget;

            for (let i = 0; i < document.getElementsByClassName('menu-item dropdown').length; i++){

                // @ts-ignore
                if (document.getElementsByClassName('menu-item dropdown')[i].contains(target)) return;
            }

            this.showSubMenu(null);
        })
    }


    handleBadge = (params) => {

        this.props.isRead({ id: params });
    };

    
    handleIcon = () => {};


    handleLogout = () => {

        this.props.logout();

        persistor.pause();

        persistor.purge().then(() => {

            return persistor.flush();

        }).then(() => { 

            persistor.pause() 

            window.location.href = '/'
        });
    };


    search = (value) => {

    }

    goHome = (e) => {

        this.props.history.push('/');
    }

    changeOnlineStatus = (value) => {

        this.setState({onlineStatus: value})
    }

    showSubMenu = (currentRef) => {

        this.menuRefs.forEach(ref => {

            if (ref.current){
                
                const newClasses = ref.current.className.replace(' open', '');

                ref.current.className = newClasses;
            }
        })

        if (currentRef && currentRef.current) currentRef.current.className += ' open'
    }

    render() {

        if (!this.props.user) return null;

        const displayNotification = () => {

            if (!this.props.navNotification || this.props.navNotification.length === 0){

                return  <li className="submenu-item">
                    <a className="submenu-label">See All Notifications</a>
                </li>
            }

            return <li className="submenu-item">
                <a className="submenu-label">See All Notifications</a>
            </li>
        }

        return <div id="vendor-header">
            <div className="menu-content">
                <div className=" container-lg container-fluid h-100">
                    <div className="row h-100">
                        <div className="col-12 h-100 d-flex align-items-center justify-content-lg-start justify-content-between">
                            <div className="d-block d-lg-none">&nbsp;</div>
                            <div className="logo">
                                <img src={logo} onClick={this.goHome}/>
                            </div>
                            <div className="search-box d-xl-block d-none">
                                <Search placeholder="Find Jobs" onSearch={this.search} size="large"/>
                            </div>
                            <div className="menu d-lg-block d-none">
                                <ul className="m-0 p-0">
                                    <li className="menu-item">
                                        <a className="menu-label" href="/vendor">DASHBOARD</a>
                                    </li>
                                    <li className="menu-item">
                                        <a className="menu-label" href="/vendor/findjob">FIND JOBS</a>
                                    </li>
                                    <li className="menu-item">
                                        <a className="menu-label" href="/messages/v">MESSAGES</a>
                                    </li>
                                    <li className="menu-item dropdown" onClick={()=>{this.showSubMenu(this.menuRefs[0])}} ref={this.menuRefs[0]}>
                                        <a className="menu-label icon"><Icon type="question"/></a>
                                        <ul className="sub-menu m-0 bg-white right">
                                            <li className="submenu-item">
                                                <a className="submenu-label">Help and Support</a>
                                            </li>
                                            <li className="submenu-item">
                                                <a className="submenu-label" href="/question&answer">Questions & Answers</a>
                                            </li>
                                            <li className="submenu-item">
                                                <a className="submenu-label" href="/dispute">Disputes</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="menu-item dropdown" onClick={()=>{this.showSubMenu(this.menuRefs[1])}} ref={this.menuRefs[1]}>
                                        <a className="menu-label icon"><Icon type="bell"/></a>
                                        <ul className="sub-menu m-0 bg-white right">
                                            {displayNotification()}
                                        </ul>
                                    </li>
                                    <li className="menu-item dropdown" onClick={()=>{this.showSubMenu(this.menuRefs[2])}} ref={this.menuRefs[2]}>
                                        <a className="menu-label icon"><Avatar src={this.props.user.userObj.profileImage} size={40}/></a>
                                        <ul className="sub-menu m-0 bg-white right">
                                            <li className="submenu-item">
                                                <ButtonGroup>
                                                    <Button 
                                                    // @ts-ignore
                                                    type={this.state.onlineStatus === 'online' ? 'primary' : ''} onClick={()=>{
                                                        this.changeOnlineStatus('online')
                                                    }}>Online</Button>
                                                    <Button 
                                                    // @ts-ignore
                                                    type={this.state.onlineStatus === 'invisible' ? 'primary' : ''}onClick={()=>{
                                                        this.changeOnlineStatus('invisible')
                                                    }}>Invisible</Button>
                                                </ButtonGroup>
                                            </li>
                                            <li className="submenu-item">
                                                <a className="submenu-label" href="/vendor/profile">
                                                    <div className="d-flex align-items-center">
                                                        <Avatar src={this.props.user.userObj.profileImage} size={30}/>
                                                        <div className="ml-3">
                                                            <p>{this.props.user.userObj.username}</p>
                                                            <small>Vendor</small>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li className="submenu-item">
                                                <a className="submenu-label" href="/vendor/settings"><Icon type="setting" className="mr-3"/>Settings</a>
                                            </li>
                                            <li className="submenu-item">
                                                <a className="submenu-label" onClick={this.handleLogout}><Icon type="logout"  className="mr-3"/>Logout</a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            <div className="menu mobile d-lg-none">
                                <div className={`hamburger-btn ${this.props.isOpenMobileMenu ? 'text-color' : ''}`} onClick={this.props.toggleMobileMenu}>
                                    { this.props.isOpenMobileMenu ? <Icon type="close" /> : <Icon type="menu" />}
                                </div>
                                <div className={`menu-content ${this.props.isOpenMobileMenu ? 'show' : ''}`}>
                                    <div className="search-box w-100 px-3 mb-4">
                                        <Search placeholder="Find Jobs" onSearch={this.search} size="large"/>
                                    </div>
                                    <ul className="m-0 p-0">
                                        <li><a href="/vendor">DASHBOARD</a></li>
                                        <li><a href="/findjob">FIND JOBS</a></li>
                                        <li><a href="/messages/v">MESSAGES</a></li>
                                        <li><a href="/vendor">HELP & SUPORT</a></li>
                                        <li><a href="/question&answer">QUESTIONS & ANSWERS</a></li>
                                        <li><a href="/dispute">DISPUTES</a></li>
                                        <li><a href="/vendor">NOTIFICATIONS</a></li>
                                        <li><a href="/vendor/profile">PROFILE</a></li>
                                        <li><a href="/vendor/settings">SETTING</a></li>
                                        <li><a onClick={this.handleLogout}>LOGOUT</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = ({ headerNotiReducer, loginReducer, vendorProfileReducer }) => {

    const { navNotification } = headerNotiReducer;

    const { user } = loginReducer;

    const { reviews } = vendorProfileReducer;

    return { navNotification, user, reviews };
};

export default connect(mapStateToProps, { 

    getNavBarNotification,
    
    logout, 
    
    isRead, 
    
    getBadge 

})( withStyles(style)(withRouter(ClientHeader)) );
