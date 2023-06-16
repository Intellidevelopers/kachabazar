import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import validator from 'validator';

const VerifyOtp = () => {
	const navigate = useNavigate();
	const { token, email } = useParams();
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [otp, setOtp] = useState('');
	const firstInput = useRef(null);
	const secondInput = useRef(null);
	const thirdInput = useRef(null);
	const fourthInput = useRef(null);
	const fifthInput = useRef(null);
	const sixthInput = useRef(null);
	const [inputValues, setInputValues] = useState(new Array(6).fill(''));
	const [isComplete, setIsComplete] = useState(false);
	const inputs = useRef(null);

	useEffect(() => {
		inputs.current = document.querySelectorAll('#otp > *[id]');
	}, [inputValues]);

	const handleInputChange = (event, index) => {
		const inputs = [
			firstInput,
			secondInput,
			thirdInput,
			fourthInput,
			fifthInput,
			sixthInput,
		];
		let value = event.target.value;

		// Validate that input is a number
		const pattern = /^\d*$/;
		if (!pattern.test(value)) {
			value = '';
		}
		// Update input value in state
		const newInputValues = [...inputValues];
		newInputValues[index] = value;
		setInputValues(newInputValues);

		if (inputs[index] && inputs[index].current) {
			if (event.key === 'Backspace') {
				setInputValues((prevInputValues) => {
					const newInputValues = [...prevInputValues];
					newInputValues[index] = '';
					if (index !== 0) {
						inputs[index - 1].current.focus();
					} else {
						inputs[inputs.length - 1].current.focus();
					}
					return newInputValues;
				});
			} else {
				const { value } = event.target;
				if (validator.isNumeric(value)) {
					setInputValues((prevInputValues) => {
						const newInputValues = [...prevInputValues];
						newInputValues[index] = value;
						if (index !== inputs.length - 1 && value !== '') {
							inputs[index + 1].current.focus();
						}
						return newInputValues;
					});
				} else {
					inputs[index].current.focus();
				}
			}
		}
	};
	useEffect(() => {
		setOtp(inputValues.join(''));
		if (otp.length === 6) {
			return setIsComplete(true);
		} else {
			return setIsComplete(false);
		}
	}, [inputValues, isComplete, otp]);

	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		if (otp.length !== 6) {
			setIsError(`OTP must be 6-digit number`);
			setTimeout(() => {
				setIsError(false);
			}, 2000);
			return toast.error('OTP must be 6-digit number');
		}
		setIsLoading(true);
		const data = { otp, token, email };
		axios
			.post(`${process.env.REACT_APP_BASE_API_URL}/user/verify-otp`, data)
			.then((res) => res.data)
			.then((data) => {
				setIsLoading(false);
				toast.success(data.message);
				setIsSuccess('OTP verified Successfully');
				setTimeout(() => {
					navigate(`/change-password/${data?.token}`);
				}, 2000);
			})
			.catch((error) => {
				console.log(error);
				toast.error(
					error
						? error?.response?.data?.message ||
								error?.response?.data?.error.message ||
								error?.message
						: error?.message
				);
				setIsError(
					error
						? error?.response?.data?.message ||
								error?.response?.data?.error.message
						: error?.message
				);
				setIsLoading(false);
			});
	};
	return (
		<div className="overflow-hidden bg-white mx-auto mt-10 md:mt-20 md:mb-5 p-4 md:p-2 w-full md:max-w-[600px] shadow-xl">
			<div className="text-center mb-6">
				<h2 className="text-3xl font-bold text-black">Verify OTP</h2>
				<p className="text-sm md:text-base text-gray-500 mt-2 mb-8 sm:mb-10">
					Enter the otp set to your <br />
					<span className="font-semibold">
						{email.slice(0, 4)}*****{email.slice(9)}
					</span>
				</p>
			</div>
			<div className="max-w-sm mx-auto md:max-w-lg my-5">
				<div className="w-full">
					<form className="bg-gray-50 relative min-h-64 py-3 rounded text-center">
						{/* <div className="absolute top-2 right-5 cursor-pointer">
								<i
									id="cancle"
									onClick={() => handleCheckOtp()}
									className="fa-solid fa-pen-to-square"
								></i>
							</div> */}
						<div
							id="otp"
							className="flex flex-row justify-center text-center px-2 mt-5"
						>
							<input
								className="m-1 md:m-2 border h-10 w-10 text-center form-control rounded"
								type="text"
								id="first"
								ref={firstInput}
								maxLength="1"
								value={inputValues[0]}
								onChange={(event) => handleInputChange(event, 0)}
								onKeyDown={(event) => handleInputChange(event, 0)}
							/>
							<input
								className="m-1 md:m-2 border h-10 w-10 text-center form-control rounded"
								type="text"
								id="second"
								ref={secondInput}
								maxLength="1"
								value={inputValues[1]}
								onChange={(event) => handleInputChange(event, 1)}
								onKeyDown={(event) => handleInputChange(event, 1)}
							/>
							<input
								className="m-1 md:m-2 border h-10 w-10 text-center form-control rounded"
								type="text"
								id="third"
								ref={thirdInput}
								maxLength="1"
								value={inputValues[2]}
								onChange={(event) => handleInputChange(event, 2)}
								onKeyDown={(event) => handleInputChange(event, 2)}
							/>
							<input
								className="m-1 md:m-2 border h-10 w-10 text-center form-control rounded"
								type="text"
								id="fourth"
								ref={fourthInput}
								maxLength="1"
								value={inputValues[3]}
								onChange={(event) => handleInputChange(event, 3)}
								onKeyDown={(event) => handleInputChange(event, 3)}
							/>
							<input
								className="m-1 md:m-2 border h-10 w-10 text-center form-control rounded"
								type="text"
								id="fifth"
								ref={fifthInput}
								maxLength="1"
								value={inputValues[4]}
								onChange={(event) => handleInputChange(event, 4)}
								onKeyDown={(event) => handleInputChange(event, 4)}
							/>
							<input
								className="m-1 md:m-2 border h-10 w-10 text-center form-control rounded"
								type="text"
								id="sixth"
								ref={sixthInput}
								maxLength="1"
								value={inputValues[5]}
								onChange={(event) => handleInputChange(event, 5)}
								onKeyDown={(event) => handleInputChange(event, 5)}
							/>
						</div>
						<div className="w-full mt-5">
							{isError && <div className="text-red-500 ">{isError}</div>}
							{isSuccess && <div className="text-green-500 ">{isSuccess}</div>}
							<button
								type="submit"
								disabled={isLoading}
								onClick={handleVerifyOtp}
								className="w-full md:max-w-[200px] mx-auto text-center py-3 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition-all focus:outline-none my-1"
							>
								{!isLoading ? 'Verify OTP' : 'Verifying'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default VerifyOtp;
