import api from '../api';
import authReducer from '../store/slices/auth';
import historyReducer from '../store/slices/history';

const rootReducer = {
  [api.reducerPath]: api.reducer,
  auth: authReducer,
  history: historyReducer,
};

export default rootReducer;
