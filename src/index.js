import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.scss';
import {ConfigProvider} from 'antd';
import esES from 'antd/lib/locale/es_ES';
import moment from 'moment';

moment.locale('es');

ReactDOM.render(
  //<React.StrictMode>
  <ConfigProvider locale={esES}>
    <App />
  </ConfigProvider>,
  //</React.StrictMode>,
  document.getElementById('root')
);
