import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
// import { useDispatch } from 'react-redux';
// import { isLoginAction } from '../../store/reducers/isOpenSlice';
const ResetPassword = () => {
	const { token } = useParams();
	// const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	useEffect(() => {
		setIsLoading(true);
		axios
			.get(
				`${process.env.REACT_APP_BASE_API_URL}/user/reset-password/${token}`,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
			.then((res) => res.data)
			.then((data) => {
				setIsLoading(false);
				toast.success(data.message);
				setIsSuccess('Password Reset Successfully');
				setTimeout(() => {
					navigate(`/change-password/${data?.token}`);
				}, 2000);
			})
			.catch((error) => {
				toast.error(
					error
						? error?.response?.data?.message ||
								error?.response?.data?.error.message
						: error?.message
				);
				setIsError(
					error
						? error?.response?.data?.message ||
								error?.response?.data?.error.message
						: error?.message
				);
				setTimeout(() => {
					navigate('/forget-password');
				}, 8000);
				setIsLoading(false);
			});
	}, [navigate, token]);
	return (
		<div className="overflow-hidden bg-white mx-auto mt-10 md:mt-20 md:mb-5 p-4 md:p-2 w-full md:max-w-[600px] shadow-xl">
			<div className="text-center mb-6">
				<h2 className="text-3xl font-bold text-black">Password Reset</h2>
				<p className="text-sm md:text-base text-gray-500 mt-2 mb-8 sm:mb-10">
					Your previous password is being reset
				</p>
			</div>
			<div className="py-4 mt-2 text-center text-lg md:text-xl font-semibold">
				{isLoading && <div>Resetting Password</div>}
				{isError && <div className="text-red-500 ">{isError}</div>}
				{isSuccess && <div className="text-green-500 ">{isSuccess}</div>}
			</div>
		</div>
	);
};

export default ResetPassword;
