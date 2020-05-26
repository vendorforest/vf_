import React, { Component } from 'react'
import { Icon, Button } from 'antd'

class BillingAccountItem extends Component {

    constructor(props){

        super(props);

        this.state = {}
    }
    
    render() {
        return (
            <div className={`${this.props.className} bank-item shadow w-100`}>
                <div className="row">
                    <div className="col-md-4 d-flex align-items-center">
                        <div className="h1"><Icon type={this.props.account.object === "card" ? "credit-card" : "bank"}/></div>
                        <div className="ml-3">
                            <h6>{this.props.account.object === "card" ? 'Card' : 'Bank'} Account</h6>
                            <p>Name: {this.props.account.object === "card" ? this.props.account.name : this.props.account.account_holder_name}</p>
                        </div>
                    </div>
                    <div className="col-md-4 d-flex justify-content-center align-items-center">
                        <div className="text-center">
                            <h6>{this.props.account.object === "card" ? `${this.props.account.brand}(Debit)` : this.props.account.bank_name} Account</h6>
                            <p>XXXX...........{this.props.account.last4}</p>
                        </div>
                    </div>
                    <div className="col-md-4 d-flex justify-content-end align-items-center">
                        <p className="link" onClick={()=>this.props.newAccount(true)}>New</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default BillingAccountItem;
