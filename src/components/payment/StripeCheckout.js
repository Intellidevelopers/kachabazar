import React, { useState } from 'react';
import {
	PaymentElement,
	useStripe,
	useElements,
} from '@stripe/react-stripe-js';

export const StripeCheckout = () => {
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
			// Show error to your customer
			setErrorMessage(submitError.message);
			return;
		}

		// Create the PaymentIntent and obtain clientSecret from your server endpoint
		const res = await fetch(
			`${process.env.REACT_APP_BASE_API_URL}/create-stripe-payment`,
			{
				method: 'POST',
			}
		);

		const { client_secret: clientSecret } = await res.json();

		const result = await stripe.confirmPayment({
			//`Elements` instance that was used to create the Payment Element
			elements,
			clientSecret,
			confirmParams: {
				return_url: 'https://example.com/order/123/complete',
			},
		});

		if (result.error) {
			setErrorMessage(result.error.message);
		} else {
			console.log(result);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<PaymentElement />
			<button type="submit" disabled={!stripe || !elements}>
				Pay
			</button>
			{/* Show error message to your customers */}
			{errorMessage && <div>{errorMessage}</div>}
		</form>
	);
};
