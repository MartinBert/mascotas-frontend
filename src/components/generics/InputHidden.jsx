import React from 'react'
import { Input } from 'antd'

const InputHidden = () => {
    const inputHiddenProps = {
        margin: '0',
        visibility: 'hidden'
    }

    return (
        <div style={inputHiddenProps}>
            <Input />
        </div>
    )
}

export default InputHidden