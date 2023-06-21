import React, { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-hot-toast';
// paypla

import axios from 'axios';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
// stripe
import { Elements } from '@stripe/react-stripe-js';
import { StripeCheckout } from './StripeCheckout';
import { loadStripe } from '@stripe/stripe-js';

const Payment = ({ isOpen, order, setIsPayment }) => {
	let navigate = useNavigate();
	// paypal
	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
	useEffect(() => {
		paypalDispatch({
			type: 'resetOptions',
			value: {
				'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID,
				currency: 'USD',
			},
		});
	}, [paypalDispatch]);

	function createOrder(data, actions) {
		console.log(data);
		return actions.order
			.create({
				application_context: {
					shipping_preference: 'NO_SHIPPING',
				},
				payer: {
					email_address: order?.email,
					phone: {
						phone_number: order?.phone,
					},
					shipping: {
						name: {
							firstName: data?.fullName,
							lastName: data?.lastName,
						},
						address: {
							address_line_1: order.address,
							admin_area_1: data.address,
							postal_code: data?.postal_code,
							country_code: 'US',
						},
					},
				},
				purchase_units: [
					{
						amount: {
							value: order.totalAmount,
						},
					},
				],
			})
			.then((orderId) => {
				return orderId;
			});
	}

	function onApprove(data, actions) {
		return actions.order.capture().then((details) => {
			try {
				const name = details.payer.name.given_name;
				alert(`Transaction completed by ${name}`);
				axios
					.post(`${process.env.REACT_APP_BASE_API_URL}/order/pay`, data)
					.then((res) => res.data)
					.then((data) => {
						toast.success(data.message);
						localStorage.setItem('order', JSON.stringify(data));
						navigate(`/order/`);
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
					});
			} catch (error) {
				console.log(error);
			}
		});
	}
	function onError(error) {
		return console.log('an error occur', error);
	}
	// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);
	const stripePromise = loadStripe(
		'pk_test_51NBaTpCCrWcBmYv2xmC9Db65X1M6cyftLwspR6b8z3Xkg5Q0XVX07ZJ2d7286rqwrZrqJ7ZtbnF7Eb3xVVp0YciQ00AcgfSwvG'
	);
	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog
				static={true}
				as="div"
				className=" fixed inset-0 overflow-y-auto text-center z-30"
				onClose={() => {}}
			>
				<div className="min-h-screen px-4">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-60" />
					</Transition.Child>
					<span
						className="inline-block h-screen align-middle"
						aria-hidden="true"
					>
						​
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<Dialog.Panel
							className="
								inline-block w-full max-w-lg
								p-10 overflow-hidden text-left 
								align-middle transition-all transform 
								bg-white shadow-xl rounded-2xl "
						>
							<div className="overflow-hidden bg-white mx-auto">
								<div className="text-center mb-6">
									<h2 className="font-semibold text-black text-2xl text-center py-2 px-5 capitalize">
										Select a Payment method
									</h2>
								</div>
								<>
									{isPending ? (
										<button
											type="button"
											className="hover:border-gray-600 border border-gray-500 transition-all rounded py-3 text-center text-sm font-medium flex justify-center w-full"
											disabled
										>
											Loading Paypal...
										</button>
									) : (
										<PayPalButtons
											style={{ layout: 'horizontal' }}
											createOrder={createOrder}
											onApprove={onApprove}
											onError={onError}
										/>
									)}{' '}
								</>
								{/* stripe */}
								<div className="h-fit">
									<Elements stripe={stripePromise}>
										<StripeCheckout order={order} />
									</Elements>
								</div>
							</div>
						</Dialog.Panel>
					</Transition.Child>
					<Transition.Child
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div
							onClick={() => setIsPayment(false)}
							className="absolute right-5 top-5"
						>
							<button
								type="button"
								className="inline-flex justify-center px-2 py-2 text-base font-medium text-red-500 bg-white border border-transparent rounded-full hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
							>
								<svg
									stroke="currentColor"
									fill="currentColor"
									strokeWidth="0"
									viewBox="0 0 512 512"
									height="1em"
									width="1em"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"></path>
								</svg>
							</button>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
};

export default Payment;
