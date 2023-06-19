import React, { useEffect, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { login } from '../../store/reducers/userSlice';

const SignupSchema = Yup.object().shape({
	name: Yup.string().required('Full Name is required!'),
	email: Yup.string()
		.email('Invalid email')
		.required('Email address is required!'),
	phone: Yup.string().required('Phone/Mobile is required!'),
	address: Yup.string().required('Your Address is required!'),
});
const UpdateProfile = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);
	const [selectedImage, setSelectedImage] = useState(null);
	const [selectedFile, setSelectedFile] = useState('');
	const [selectedFileName, setSelectedFileName] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const handleSubmit = async (values) => {
		setIsLoading(true);
		console.log(isLoading);
		const formData = new FormData();
		const data = {
			image: selectedFile,
			name: values.name,
			address: values.address,
			phone: values.phone,
			email: values.email,
			token: user?.token,
			id: user?.user?._id,
		};

		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				formData.append(key, data[key]);
			}
		}
		axios
			.put(
				`${process.env.REACT_APP_BASE_API_URL}/user/update-profile`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${user?.token}`,
					},
				}
			)
			.then((res) => res.data)
			.then((data) => {
				setIsLoading(false);
				// toast.success(data.message);
				console.log(data);
				toast.success('Profile updated successfully');
				dispatch(login(data));
			})
			.catch((error) => {
				console.log(error);
				toast.error(
					error
						? error?.response?.error ||
								error?.response?.data?.message ||
								error?.response?.data?.error.message ||
								error?.message
						: error?.message
				);
				setIsLoading(false);
			});
	};
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	const handleImageChange = (event) => {
		const file = event.target.files[0];
		setSelectedImage(URL.createObjectURL(file));
		setSelectedFile(file);
		setSelectedFileName(file?.name);
	};
	return (
		<div className="max-w-screen-2xl">
			<div className="md:grid md:grid-cols-3 md:gap-6">
				<div className="md:col-span-1">
					<div className="px-4 sm:px-0">
						<h2 className="text-xl font-semibold mb-5 text-black">
							Update Profile
						</h2>
					</div>
				</div>
			</div>

			<Formik
				initialValues={{
					image: user?.user?.image?.url,
					name: user?.user?.name,
					address: user?.user?.address,
					phone: user?.user?.phone,
					email: user?.user?.email,
				}}
				validationSchema={SignupSchema}
				onSubmit={handleSubmit}
			>
				{({ errors, touched }) => {
					return (
						<Form>
							<div className=" mt-5 md:mt-0 md:col-span-2">
								<div className="bg-white space-y-6">
									<div>
										<label
											htmlFor="image"
											className="block text-gray-500 font-medium text-sm leading-none mb-2"
										>
											Photo
										</label>
										<div className="mt-1 flex items-center">
											<div className="w-full text-center">
												<label
													tabIndex="0"
													className="flex flex-col w-full h-fit px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer "
												>
													{' '}
													{selectedImage ? (
														<img
															src={selectedImage}
															alt="Selected"
															className="max-h-32 max-w-32 mx-auto"
														/>
													) : (
														<>
															<span className="mx-auto flex justify-center">
																<svg
																	stroke="currentColor"
																	fill="none"
																	strokeWidth="2"
																	viewBox="0 0 24 24"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	className="text-3xl text-emerald-500"
																	height="1em"
																	width="1em"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<polyline points="16 16 12 12 8 16"></polyline>
																	<line x1="12" y1="12" x2="12" y2="21"></line>
																	<path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
																	<polyline points="16 16 12 12 8 16"></polyline>
																</svg>
															</span>
															<p className="text-sm mt-2 text-black">
																Drag your image here
															</p>
															<em className="text-xs text-gray-400">
																Only *.jpeg and *.png images will be accepted
															</em>
														</>
													)}
													<Field
														id="image"
														name="image"
														accept="image/jpeg, image/png, image/svg+xml"
														type="file"
														tabIndex="-1"
														style={{ display: 'none' }}
														autoComplete="off"
														onChange={handleImageChange}
													/>
												</label>

												<aside className="flex flex-row flex-wrap mt-4">
													<div className="inline-flex border rounded-md border-gray-100 w-24 max-h-24 p-2">
														<p className="text-semibold text-sm">
															{selectedFileName && selectedFileName}
														</p>
													</div>
												</aside>
											</div>
										</div>
										<span className="text-red-400 text-sm mt-2">
											{errors.firstName}
										</span>
									</div>
								</div>
								<div className="mt-10 sm:mt-0">
									<div className="md:grid-cols-6 md:gap-6">
										<div className="mt-5 md:mt-0 md:col-span-2">
											<div className="lg:mt-6 mt-4 bg-white">
												<div className="grid grid-cols-6 gap-6">
													<div className="col-span-6 sm:col-span-3">
														<label
															htmlFor="name"
															className="block text-gray-500 font-medium text-sm leading-none mb-2"
														>
															Full Name
														</label>
														<div className="relative">
															<Field
																id="name"
																name="name"
																placeholder="Full Name"
																className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
															/>
														</div>
														<span className="text-red-400 text-sm mt-2">
															{errors.name && touched.name && (
																<div>{errors.name}</div>
															)}
														</span>
													</div>
													<div className="col-span-6 sm:col-span-3">
														<label
															htmlFor="address"
															className="block text-gray-500 font-medium text-sm leading-none mb-2"
														>
															Your Address
														</label>
														<div className="relative">
															<Field
																id="address"
																name="address"
																placeholder="Your Address"
																className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
															/>
														</div>
														<span className="text-red-400 text-sm mt-2">
															{errors.address && touched.address && (
																<div>{errors.address}</div>
															)}
														</span>
													</div>
													<div className="col-span-6 sm:col-span-3">
														<label
															htmlFor="phone"
															className="block text-gray-500 font-medium text-sm leading-none mb-2"
														>
															Phone/Mobile
														</label>
														<div className="relative">
															<Field
																id="phone"
																name="phone"
																placeholder="Your Mobile Number"
																className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
															/>
														</div>
														<span className="text-red-400 text-sm mt-2">
															{errors.phone && touched.phone && (
																<div>{errors.phone}</div>
															)}
														</span>
													</div>
													<div className="col-span-6 sm:col-span-3">
														<label
															htmlFor="email"
															className="block text-gray-500 font-medium text-sm leading-none mb-2"
														>
															Email Address
														</label>
														<div className="relative">
															<Field
																id="email"
																name="email"
																placeholder="Your Email"
																className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
															/>
														</div>
														<span className="text-red-400 text-sm mt-2">
															{errors.email && touched.email && (
																<div>{errors.email}</div>
															)}
														</span>
													</div>
												</div>
												<div className="col-span-6 sm:col-span-3 mt-5 text-right">
													<button
														type="submit"
														className="md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-emerald-500 text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-emerald-600 h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto"
														disabled={isLoading}
													>
														{isLoading ? 'Updating Profile' : 'Update Profile'}
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
};

export default UpdateProfile;
