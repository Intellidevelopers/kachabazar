import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-hot-toast';
// import { useSelector } from 'react-redux';

export const StripeCheckout = ({ order }) => {
	const stripe = useStripe();
	const elements = useElements();
	const [errorMessage, setErrorMessage] = useState(null);
	// const { user } = useSelector((state) => state.user);
	// const appearance = {
	// 	theme: 'stripe',

	// 	variables: {
	// 		colorPrimary: '#0570de',
	// 		colorBackground: '#ffffff',
	// 		colorText: '#30313d',
	// 		colorDanger: '#df1b41',
	// 		fontFamily: 'Ideal Sans, system-ui, sans-serif',
	// 		spacingUnit: '2px',
	// 		borderRadius: '4px',
	// 	},
	// };
	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const { error } = await elements.submit();
			if (error) {
				throw new Error(error.message);
			}

			const response = await axios.post(
				`${process.env.REACT_APP_BASE_API_URL}/create-stripe-payment`,
				{ amount: order.totalPrice }
			);

			if (!response.status === 200) {
				throw new Error('Failed to create payment');
			}

			const client_secret = response?.data;

			const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
				payment_method: {
					card: elements.getElement(CardElement),
				},
			});

			if (paymentIntent) {
				const res = await axios.post(
					`${process.env.REACT_APP_BASE_API_URL}/order/create`,
					{
						...order,
						paymentMethod: 'stripe',
					}
				);
				console.log(res);
				toast.success(`Payment ${paymentIntent.status}`);
			}
		} catch (error) {
			console.log(error);
			setErrorMessage(error.message);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mt-1 h-fit">
			<CardElement id="card-element" />
			<button
				type="submit"
				disabled={!stripe || !elements}
				className="hover:border-gray-600 border border-gray-500 transition-all mt-2 rounded py-3 text-center text-sm flex justify-center w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4"
			>
				Pay with Stripe
			</button>
			{/* Show error message to your customers */}
			{errorMessage && <div>{errorMessage}</div>}
		</form>
	);
};
