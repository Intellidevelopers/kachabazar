import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const StripeCheckout = ({ order }) => {
	const stripe = useStripe();
	const elements = useElements();

	const [errorMessage, setErrorMessage] = useState(null);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (elements == null) {
			return;
		}

		// Trigger form validation and wallet collection
		const { error: submitError } = await elements.submit();
		if (submitError) {
			console.log(submitError);
			setErrorMessage(submitError.message);
			return;
		}

		// Create the PaymentIntent and obtain clientSecret from your server endpoint
		const { client_secret } = await fetch(
			`${process.env.REACT_APP_BASE_API_URL}/create-stripe-payment`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ',
				},
				body: JSON.stringify({ amount: order.totalPrice }),
			}
		).then((res) => res.json());

		const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
			payment_method: {
				card: elements.getElement(CardElement),
			},
		});

		if (paymentIntent) {
			axios
				.post(`${process.env.REACT_APP_BASE_API_URL}/order/create`, order)
				.then((res) => {
					console.log(res);
					toast.success(`Payment ${paymentIntent.status}`);
				});
		}
	};
	return (
		<form onSubmit={handleSubmit} className="mt-1">
			<button
				type="submit"
				disabled={!stripe || !elements}
				className="hover:border-gray-600 border border-gray-500 transition-all rounded py-3 text-center text-sm flex justify-center w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4"
			>
				Pay with Stripe
			</button>
			{/* Show error message to your customers */}
			{errorMessage && <div>{errorMessage}</div>}
		</form>
	);
};
