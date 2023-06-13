import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from './reducers/cartSlice';
import { isOpenReducer } from './reducers/isOpenSlice';
import { searchReducer } from './reducers/searchSlice';
import { shoppingCardReducer } from './reducers/shoppingCardSlice';
import { sidebarReducer } from './reducers/sidebarSlice';
import { authReducer } from './reducers/userSlice';

export const store = configureStore({
	reducer: {
		shoppingCard: shoppingCardReducer,
		sidebar: sidebarReducer,
		cart: cartReducer,
		search: searchReducer,
		isOpen: isOpenReducer,
		user: authReducer, // Add the authReducer to the store
	},
	devTools: true,
});

// import { authReducer } from './reducers';

// const store = createStore(authReducer);
