import React, { useEffect, useState } from 'react';
import Table from '../table/Table'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
const MyOrders = () => {  
	let [isloading, setIsLoading] = useState(false);
  let [order, setOrder] = useState();  
	const { user } = useSelector((state) => state.user);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const getOrders = async () => {
		// console.log(isValidating);
		setIsLoading(true);
		axios
			.post(`${process.env.REACT_APP_BASE_API_URL}/order/get`, user)
			.then((res) => res.data)
			.then((data) => {
				setIsLoading(false);
				setOrder(false);
				toast.success(data.message);
				// dispatch(isLoginAction(false));
			})
			.catch((error) => {
				toast.error(
					error
						? error?.response?.data?.error ||
								error?.response?.data?.message ||
								error?.response?.data?.error.message ||
								error?.message
						: error?.message
				);
				setIsLoading(false);
			});
	};
  useEffect(() => {
		getOrders();
	}, [getOrders]);
  return (
		<div className="overlow-hidden">
			<h2 className="text-xl text-black font-semibold mb-5">My Orders</h2>
			<Table order={order} loading={isloading} />
		</div>
	);
}

export default MyOrders