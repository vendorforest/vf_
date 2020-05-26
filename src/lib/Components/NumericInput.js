import { Input } from 'antd';
import React from "react";

const formatNumber = (value) => {

    value += '';

    const list = value.split('.');

    const prefix = list[0].charAt(0) === '-' ? '-' : '';

    let num = prefix ? list[0].slice(1) : list[0];

    let result = '';

    while (num.length > 3) {

        result = `,${num.slice(-3)}${result}`;

        num = num.slice(0, num.length - 3);
    }

    if (num) result = num + result;

    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}
    
export default class NumericInput extends React.Component {

    onChange = e => {

        const { value } = e.target;

        if (value.length > this.props.maxLength) return this.props.onChange(value.slice(-1));

        const reg = /^-?[0-9]*(\.[0-9]*)?$/;

        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {

            this.props.onChange(value);
        }
    };

    render() {

        return (
            <Input
                {...this.props}
                onChange={this.onChange}
            />
        );
    }
}