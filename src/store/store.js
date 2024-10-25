import { configureStore } from '@reduxjs/toolkit';
import { watchSlice } from '../services/watch.service';
import { persistStore } from 'redux-persist';
import rootReducer from '../redux/rootReducer';

const store = configureStore({
	reducer: {
		rootReducer,
		[watchSlice.reducerPath]: watchSlice.reducer
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false
		}).concat(watchSlice.middleware)
});

const persistor = persistStore(store);

//action logout reset state

export { store, persistor };
