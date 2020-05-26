import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import { Icon } from 'antd'
import { constants } from '@Shared/constants'

class CustomCarouselView extends Component {

    constructor(props) {

        super(props);

        this.state = {

            loading: true,
        }
    }

    componentDidMount(){}


    componentDidUpdate(prevProps, prevState){

        if (prevProps.currentIndex !== this.props.currentIndex && !this.state.loading){

            this.setState({loading: true})
        }
    }

    onReady = () => {

        this.setState({loading: false})
    }

    render() {

        const data = this.props.views[this.props.currentIndex]

        return (

            <div className="cousel-view d-flex justify-content-center">
                {
                    data.type === constants.PORTFOLIO_TYPE.IMAGE ?
                    <img src={data.url} onLoad={this.onReady}/>:
                    <ReactPlayer url={data.url} controls={true} onReady={this.onReady}/>
                }
                {
                    this.state.loading && <div className="video-loading"><Icon type="loading" /></div>
                }
            </div>
            
        )

    }    
}

export default CustomCarouselView
