import React, { Component } from 'react'
import { Icon, Button } from 'antd'

class BillingCardItem extends Component {

    constructor(props){

        super(props);

        this.state = {}
    }
    
    render() {
        return (
            <div className={`${this.props.className} card-item shadow w-100`}>
                <div className="row">
                    <div className="col-md-4 d-flex align-items-center">
                        <div className="h1"><Icon type="card"/></div>
                        <div className="ml-3">
                            <h6>Card ({this.props.card.brand})</h6>
                            <p>Name: {this.props.card.name}</p>
                        </div>
                    </div>
                    <div className="col-md-4 d-flex justify-content-center align-items-center">
                        <div className="text-center">
                            <h6>Card Number</h6>
                            <p>XXXX...........{this.props.card.last4}</p>
                        </div>
                    </div>
                    <div className="col-md-4 d-flex justify-content-end align-items-center">
                        <p className="link" onClick={this.props.toggleNewCard}>New</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default BillingCardItem;
