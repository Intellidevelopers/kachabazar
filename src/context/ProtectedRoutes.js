import React from 'react';
// import { user } from '../store/reducers/userSlice';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoutes = () => {
	// const { user } = UserAuth();	
	const { user } = useSelector((state) => state.user);
	console.log(user);
	const location = useLocation();
	return user ? (
		<Outlet />
	) : (
		<Navigate to="/" state={{ path: location.pathname }} replace />
	);
};

export default ProtectedRoutes;
