import {useReducer, useEffect} from 'react';
import 'antd/dist/antd.css';
import AppRouter from './routes';
import reducers from './reducers';
import api from './services';

const { initialState, reducer, actions } = reducers.loggedUserReducer;
const {LOAD_USER, SET_LOADING} = actions;

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchLoggedUser = async() => {
      const loggedUser = await api.usuarios.findById(localStorage.getItem('userId'));
      dispatch({type: LOAD_USER, payload: loggedUser});
      setTimeout(() => {
        dispatch({type: SET_LOADING})
      }, 50)
    }
    fetchLoggedUser();
  }, [])
  
  return (
    <div style={{height: '100%'}}>
      <AppRouter userState={state} userDispatch={dispatch} userActions={actions}/>
    </div>
  );
}

export default App;
