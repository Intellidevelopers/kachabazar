export const loginAction = (user) => ({
	type: 'LOGIN',
	payload: user,
});

export const logoutAction = () => ({
	type: 'LOGOUT',
});

export const updateAction = (user) => ({
	type: 'UPDATE',
	payload: user,
});
