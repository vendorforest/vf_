import React, { Component } from 'react'
import {Icon} from 'antd'


export default class CustomCarouselHeader extends Component {

    render() {

        return (

            <div className="cousel-header d-flex justify-content-lg-between">
                <Icon type="delete" className="pointer" onClick={()=>{
                    this.props.carouselProps.onClose()
                    this.props.carouselProps.onDelete(this.props.views[this.props.currentIndex])
                }}/>
                <Icon type="close" className="pointer" onClick={()=>{
                    this.props.carouselProps.onClose()
                }}/>
            </div>
            
        )

    }
    
}
