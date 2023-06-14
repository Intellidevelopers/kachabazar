import { useEffect } from 'react';
import { createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const initialState = {
	user: localStorage.getItem('user')
		? JSON.parse(localStorage.getItem('user'))
		: '',
};
export const UserSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login(state, action) {
			state.user = action.payload;
			// Add user data to local storage
			localStorage.setItem('user', JSON.stringify(state.user));
		},
		logout(state, action) {
			state.user = action.payload;
			// Remove user data from local storage
			localStorage.removeItem('user');
		},
		update(state, action) {
			state.user = null;
			// Update user data in local storage
			localStorage.setItem('user', JSON.stringify(user));
		},
	},
});
export const { user, login, logout, update } = UserSlice.actions;

export const authReducer = UserSlice.reducer;

export const useUserFromLocalStorage = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const storedUser = localStorage.getItem('user');

		if (storedUser) {
			const user = JSON.parse(storedUser);
			dispatch(login(user));
		}
	}, [dispatch]);
};
