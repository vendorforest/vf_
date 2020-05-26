import { apiUrl } from "@Shared/constants";
// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_SUCCESS = "FETCH_SUCCESS";
const FETCH_MSG_SUCCESS = "FETCH_MSG_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";

// Reducer
export default function reducer(

	state = {

		error: undefined,

		success: undefined,

		user: undefined,

		pending: false,
		
	}, action 
) {

	switch (action.type) {

		case FETCH_REQUEST:

			return { ...state, pending: true };

		case FETCH_SUCCESS:

			return { ...state, user: action.payload, pending: false };

		case FETCH_MSG_SUCCESS:

			return { ...state, pending: false, success: action.payload };

		case FETCH_FAILURE:

			return { ...state, pending: false, error: action.payload };

		case CLEAR_FAILURE:

			return { ...state, error: undefined, success: undefined, pending: false };

		default:
			return state;
	}
}

// Action Creators
const fetchRequest = () => ({

	type: FETCH_REQUEST,
});

const fetchSuccess = (userInfo) => ({

	type: FETCH_SUCCESS,

	payload: userInfo,
});

const fetchSuccessMsg = (success) => ({

	type: FETCH_MSG_SUCCESS,

	payload: success,
});

const fetchError = (err) => ({

	type: FETCH_FAILURE,

	payload: err,
});

const clearError = () => ({

	type: CLEAR_FAILURE,
});


export const updateUser = (userInfo) =>({

	type: FETCH_SUCCESS,

	payload: userInfo,
});

export const fetchGetInitData = (payload) => async (dispatch, getState) => {

	dispatch(clearError());

	dispatch(fetchRequest());

	return await fetch(apiUrl.VENDOR_GET, {

		method: "GET",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400)  throw new Error(result.message);
		
		dispatch(fetchSuccess(result.data));

	}).catch((err) => dispatch(fetchError(err.message)));
};


export const signupStripe = (payload) => async (dispatch, getState) => {

	dispatch(clearError());

	dispatch(fetchRequest());

	return await fetch(apiUrl.GET_STRIPE_ID, { 
		
		method: "GET",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) throw new Error(result.message);

		dispatch(fetchSuccess(result.data));

		dispatch(fetchSuccessMsg(result.message));

	}).catch((err) => dispatch(fetchError(err.message)));
};

export const fetchUpdateAccount = (payload) => async (dispatch, getState) => {

	dispatch(clearError());

	dispatch(fetchRequest());

	process.env.NODE_ENV === "development" && console.log("update req: ", payload);

	return await fetch(apiUrl.UPDATE_ACCOUNT, {

		method: "POST",
		
		headers: { Accept: "application/json", "Content-Type": "application/json" },

		body: JSON.stringify(payload),

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) throw new Error(result.message);

		process.env.NODE_ENV === "development" && console.log("update response: ", result);

		dispatch(fetchSuccess(result.data));

		dispatch(fetchSuccessMsg(result.message));
		
	}).catch((err) => dispatch(fetchError(err.message)));
};


export const fetchResetPass = (payload) => async (dispatch, getState) => {

	dispatch(clearError());

	dispatch(fetchRequest());

	return await fetch(apiUrl.RESETPASS, {

		method: "POST",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

		body: JSON.stringify(payload),
		
	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) throw new Error(result.message);

		dispatch(fetchSuccessMsg(result.message));

	}).catch((err) => dispatch(fetchError(err.message)));
};

export const fetchUpdateNotifYSettings = (payload) => async (dispatch, getState) => {

	dispatch(clearError());

	dispatch(fetchRequest());

	return await fetch(apiUrl.VENDOR_POST_NOTIFYSETTING, {

		method: "POST",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

		body: JSON.stringify(payload),

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) throw new Error(result.message);

		dispatch(fetchSuccess(result.data));

		dispatch(fetchSuccessMsg(result.message));

	}).catch((err) => dispatch(fetchError(err.message)));
};


export const fetchSendCodeEmail = (payload) => async (dispatch, getState) => {

	dispatch(clearError());

	dispatch(fetchRequest());

	return await fetch(`${apiUrl.CODEEMAIL_SEND}/${payload.email}`, {

		method: "GET",

		headers: { Accept: "application/json", "Content-Type": "application/json" },
		
	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) throw new Error(result.message);

		dispatch(fetchSuccessMsg(result.message));

	}).catch((err) => dispatch(fetchError(err.message)));
};


export const fetchUpdateCompany = (payload) => async (dispatch, getState) => {

	dispatch(clearError());

	dispatch(fetchRequest());

	return await fetch(apiUrl.VENDOR_UPDATE_COMPANY, {

		method: "POST",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

		body: JSON.stringify(payload),
		
	}).then((response) => response.json()).then((result) => {

		process.env.NODE_ENV === "development" && console.log("company update", result);

		if (result.status >= 400) throw new Error(result.message);

		dispatch(fetchSuccessMsg(result.message));
		
	}).catch((err) => dispatch(fetchError(err.message)));
};


export const fetchUpdateBillingMethod = async(payload) => {

	return await fetch(apiUrl.VENDOR_UPDATE_BILLINGMETHOD, {

		method: "POST",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

		body: JSON.stringify(payload),

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) {

			throw new Error(result.message);
		}

		return result;

	}).catch((error) => { throw error });
	
};

export const fetchGetBillingMethod = async() => {

	return await fetch(apiUrl.VENDOR_GET_BILLINGMETHOD, {

		method: "GET",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) {

			throw new Error(result.message);
		}

		return result;

	}).catch((error) => { throw error });
	
};


export const fetchUploadPhoto = async(payload) => {

	const formData = new FormData();

	formData.append('file', payload.file)

	return await fetch(apiUrl.UPLOAD_USER_PHOTO, {

		method: "POST",

		body: formData

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) {

			throw new Error(result.message);
		}

		return result;

	}).catch((error) => { throw error });
};
