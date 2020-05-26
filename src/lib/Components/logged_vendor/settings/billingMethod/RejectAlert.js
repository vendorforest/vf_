import React, { Component } from 'react'
import { Alert } from "antd";


class RejectAlert extends Component {

    render() {

        if (!this.props.reasons || this.props.reasons.length === 0) return null;

        const getDescription = () => {

            return this.props.reasons.map((reason, index) => {

                return <span key={index}>{reason}</span>
            })
        }

        return (
            <Alert
                message={this.props.message}
                description={getDescription()}
                type="error"
            />
        )
    }
}

export default RejectAlert;
