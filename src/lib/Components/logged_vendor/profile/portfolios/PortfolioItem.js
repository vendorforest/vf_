import React, { Component } from 'react'
import {Icon} from 'antd'
import { constants } from '@Shared/constants'

class PortfolioItem extends Component {

    constructor(props){

        super(props)

        this.state={}
    }

    getThumbnailImageUrl = () => {

        const thumbnailTransformation = "c_thumb,g_face,w_250,h_250"

        if (this.props.portfolio.type === constants.PORTFOLIO_TYPE.IMAGE) {

            return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${thumbnailTransformation}` + 
                    `/v${this.props.portfolio.version}/${this.props.portfolio.public_id}`

        }else{

            return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/${this.props.portfolio.video_type}/${thumbnailTransformation}` + 
                    `/${this.props.portfolio.public_id}`
        }
    }

    render() {

        return (

            <div className="portfolio-item" onClick={this.props.onClick}>
                <img src={this.getThumbnailImageUrl()} alt='portfolio-thumbnail'/>
                <div className="mask">
                    {
                        this.props.portfolio.type === constants.PORTFOLIO_TYPE.IMAGE &&
                        <Icon type="search" />
                    }
                </div>
                {
                    this.props.portfolio.type === constants.PORTFOLIO_TYPE.VIDEO &&
                    <div className="playicon">
                        <Icon type="play-circle" />
                    </div>
                }

            </div>
        )
    }
}

export default PortfolioItem