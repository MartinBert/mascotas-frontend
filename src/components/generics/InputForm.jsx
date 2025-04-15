import React from 'react'
import { Input } from 'antd'


const InputForm = (props) => {
    const {
        disabled, // boolean
        onChange, // function
        param, // { message: string, status: boolean, value: any }
        placeholer, // string
        roundedNumberValue // boolean
    } = props

    
    return (
        <div>
            <Input
                disabled={disabled}
                onChange={onChange}
                placeholder={placeholer}
                status={param.status}
                style={{ width: '100%' }}
                value={param.value}
            />
            {
                param.status === 'error'
                    ? (
                        <span  style={{ color: 'red' }}>
                            {param.message}
                        </span>
                    )
                    : ''
            }
        </div>
    )
}

export default InputForm