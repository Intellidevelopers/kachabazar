import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isLoginAction } from '../store/reducers/isOpenSlice';

const ProtectedRoutes = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const { user } = useSelector((state) => state.user);
	if (!user) {
		dispatch(isLoginAction(true));
	}
	return user ? (
		<Outlet />
	) : (
		<Navigate to="/" state={{ path: location.pathname }} replace />
	);
};

export default ProtectedRoutes;
