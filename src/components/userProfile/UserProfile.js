import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { isLoginAction } from '../../store/reducers/isOpenSlice';
import { useNavigate } from 'react-router-dom';
const UserProfile = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate;
	const { user } = useSelector((state) => state.user);

	return (
		<>
			{!user ? (
				<button
					onClick={() => dispatch(isLoginAction(true))}
					className="!text-white hover:!text-white text-2xl font-bold debug"
				>
					<span>
						<svg
							stroke="currentColor"
							fill="none"
							strokeWidth="2"
							viewBox="0 0 24 24"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-6 h-6 drop-shadow-xl"
							height="1em"
							width="1em"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
					</span>
				</button>
			) : (
				<button
					onClick={() => navigate('/dashboard')}
					className="!text-white hover:!text-white text-2xl font-bold debug"
				>
					<span>
						<svg
							stroke="currentColor"
							fill="none"
							strokeWidth="2"
							viewBox="0 0 24 24"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-6 h-6 drop-shadow-xl"
							height="1em"
							width="1em"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
					</span>
				</button>
			)}
		</>
	);
};

export default UserProfile;
