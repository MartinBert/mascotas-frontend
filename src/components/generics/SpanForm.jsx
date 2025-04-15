import React from 'react'


const SpanForm = (props) => {
    const {
        param
    } = props


    return (
        param.status === 'error'
            ? (
                <span style={{ color: 'red', width: '100%' }}>
                    {param.message}
                </span>
            )
            : ''
    )
}

export default SpanForm