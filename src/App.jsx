import 'antd/dist/antd.css'
import AppRouter from './routes';

//REDUX
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={ store }>
      <AppRouter/>
    </Provider>
  );
}

export default App;
