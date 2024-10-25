import { useSelector } from 'react-redux';
import setUpInterceptor from '../../services/api.service';
import DisconnectPage from '../DisconnectPage';
import { store } from '../../store/store';
import AppRoutes from '../../routes/AppRoutes';

//component này để xử lý disconnect, token hết hạn,...
const App = () => {

  setUpInterceptor(store);
  console.log(store.getState())
  const isOnline = useSelector((state) => state.rootReducer.app.onLineStatus);
  return (
    <div className="App">{isOnline ? <AppRoutes /> : <DisconnectPage />}</div>
  );
};

export default App;
