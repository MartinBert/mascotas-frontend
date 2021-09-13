import React from 'react';
import './spinner.css'
import { Row } from 'antd';

const Spinner = () => (
    <Row align="center">
        <div>
            <div className="lds-hourglass"></div>
        </div>
    </Row>
)

export default Spinner;