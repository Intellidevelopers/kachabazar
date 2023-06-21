import React, { useEffect, useState } from 'react';
import Table from '../table/Table';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
const MyOrders = () => {
	let [isloading, setIsLoading] = useState(false);
	let [isError, setIsError] = useState(false);
	let [order, setOrder] = useState();
	const { user } = useSelector((state) => state.user);
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	const getOrders = async () => {
		setIsLoading(true);
		const userId = user?.user?._id;
		axios
			.get(`${process.env.REACT_APP_BASE_API_URL}/order/get`, userId)
			.then((res) => res.data)
			.then((data) => {
				setIsLoading(false);
				setOrder(data);
				console.log(data);
				toast.success(data.message);
				// dispatch(isLoginAction(false));
			})
			.catch((error) => {
				console.log(error);
				setIsError('Something went wrong!');
				// toast.error(
				// 	error
				// 		? error?.response?.data?.error ||
				// 				error?.response?.data?.message ||
				// 				error?.response?.data?.error.message ||
				// 				error?.message
				// 		: error?.message
				// );
				setIsLoading(false);
			});
	};
	useEffect(() => {
		getOrders();
	}, []);
	return (
		<div className="overlow-hidden">
			<h2 className="text-xl text-black font-semibold mb-5">My Orders</h2>
			<Table data={order} loading={isloading} error={isError} />
		</div>
	);
};

export default MyOrders;
