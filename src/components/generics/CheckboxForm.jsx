import React from 'react'
import { Checkbox } from 'antd'


const CheckboxForm = (props) => {
    const {
        checked, // boolean
        onChange // function
    } = props

    
    return (
        <Checkbox
            checked={checked}
            onChange={onChange}
        />
    )
}

export default CheckboxForm