import axios from 'axios';
export const LoginUser = async ({ user }) => {
	const response = await axios.post(
		`${process.env.REACT_APP_BASE_API_URL}/user/login`,
		user
	);
	const data = response.data;
	return data;
};
export const SignupUser = async ({ user }) => {
	const response = await axios.post(
		`${process.env.REACT_APP_BASE_API_URL}/user/signup`,
		user
	);
	const data = response.data;
	return data;
};
export const PayOtherUser = async ({ user }) => {
	const response = await axios.post(
		`${process.env.REACT_APP_BASE_API_URL}/wallet/send`,
		user
	);
	const data = response.data;
	return data;
};

// export const fetchUser = async () => {
// 	const response = await axios.get(
// 		`${process.env.REACT_APP_BASE_API_URL}"/user/login"`
// 	);
// 	const user = response.data;
// 	return user;
// };
