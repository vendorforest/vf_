import { apiUrl, constants } from "@Shared/constants";
// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
const FETCH_REVIEW_SUCCESS = "FETCH_REVIEW_SUCCESS";
const FETCH_PORTFOLIO_SUCCESS = "FETCH_PORTFOLIO_SUCCESS";
const FETCH_TEAMS_SUCCESS = "FETCH_TEAMS_SUCCESS";
const FETCH_SERVICE_SUCCESS = "FETCH_SERVICE_SUCCESS";
const FETCH_MSG_SUCCESS = "FETCH_MSG_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";
const FETCH_VENDOR_PUBLIC_RECORD = "FETCH_VENDOR_PUBLIC_RECORD";
const CLEAR_VENDOR_PUBLIC_RECORD = "CLEAR_VENDOR_PUBLIC_RECORD";

// Reducer
export default function reducer(

	state = {

		error: undefined,

		success: undefined,

		user: undefined,

		selectedVendor: undefined,

		reviews: undefined,

		portfolios: undefined,

		teams: undefined,

		services: undefined,

		pending: false,

	}, action) {

	switch (action.type) {

		case FETCH_REQUEST:

			return { ...state, pending: true };

		case FETCH_USER_SUCCESS:

			return { ...state, user: action.payload, pending: false };

		case FETCH_REVIEW_SUCCESS:

			return { ...state, reviews: action.payload, pending: false };

		case FETCH_VENDOR_PUBLIC_RECORD:

			return { ...state, selectedVendor: action.payload, pending: false };

		case CLEAR_VENDOR_PUBLIC_RECORD:

			return { ...state, selectedVendor: undefined, pending: false };

		case FETCH_PORTFOLIO_SUCCESS:

			return { ...state, portfolios: action.payload, pending: false };

		case FETCH_TEAMS_SUCCESS:

			return { ...state, teams: action.payload, pending: false };

		case FETCH_SERVICE_SUCCESS:

			return { ...state, services: action.payload, pending: false };

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

const fetchUserSuccess = (userInfo) => ({

	type: FETCH_USER_SUCCESS,

	payload: userInfo,
});

const fetchReviewsSuccess = (reviewInfo) => ({

	type: FETCH_REVIEW_SUCCESS,

	payload: reviewInfo,
});

const fetchPortfoliosSuccess = (portfolioInfo) => ({

	type: FETCH_PORTFOLIO_SUCCESS,

	payload: portfolioInfo,
});

const fetchTeamsSuccess = (teamInfo) => ({

	type: FETCH_TEAMS_SUCCESS,

	payload: teamInfo,
});

const fetchServiceSuccess = (serviceInfo) => ({

	type: FETCH_SERVICE_SUCCESS,

	payload: serviceInfo,
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

const fetchvendor = (payload) => ({

	type: FETCH_VENDOR_PUBLIC_RECORD,

	payload: payload,
});

const clearVendorPublicSearch = () => ({
	
	type: CLEAR_VENDOR_PUBLIC_RECORD,
});



export const updatePortfolios = (payload) => {

	return {

		type: FETCH_PORTFOLIO_SUCCESS,

		payload: payload,
	};
};

export const updateTeams = (payload) => {

	return {

		type: FETCH_TEAMS_SUCCESS,

		payload: payload,
	};
};

export const fetchGetUserData = (payload) => async (dispatch, getState) => {

	dispatch(clearError());

	dispatch(fetchRequest());

	return await fetch(`${apiUrl.GET_USER}`, {

		method: "GET",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

		credentials: "include",

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) {

			throw new Error(result.message);
		}

		dispatch(fetchUserSuccess(result.data));

	}).catch((err) => dispatch(fetchError(err.message)));
};

export const fetchUpdateData = (payload) => async (dispatch, getState) => {

	dispatch(clearError());

	dispatch(fetchRequest());

	process.env.NODE_ENV === "development" && console.log("payload: ", payload);

	return await fetch(apiUrl.VENDOR_UPDATE_PROFILE, {

		method: "POST",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

		body: JSON.stringify(payload),

	}).then((response) => response.json()).then((result) => {

		process.env.NODE_ENV === "development" && console.log("result: ", result);

		if (result.status >= 400) {

			throw new Error(result.message);
		}

		dispatch(fetchUserSuccess(result.data));

		dispatch(fetchSuccessMsg(result.message));

	}).catch((err) => dispatch(fetchError(err.message)));
};

export const fetchReviewsData = () => async (dispatch, getState) => {

	dispatch(clearError());

	dispatch(fetchRequest());

	return await fetch(apiUrl.GET_MYREVIEWS, {

		method: "GET",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) {

			throw new Error(result.message);
		}

		console.log(result)
		dispatch(fetchReviewsSuccess(result.data));

	}).catch((err) => { dispatch(fetchError(err.message)) });
};

export const fetchPortfoliosData = (payload) => async (dispatch, getState) => {

	dispatch(clearError());

	dispatch(fetchRequest());

	return await fetch(apiUrl.GET_MYPORTFOLIOS, {

		method: "GET",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

	}).then((response) => response.json()).then((result) => {

		process.env.NODE_ENV === "development" && console.log("potfolio: ", result);

		if (result.status >= 400) {

			throw new Error(result.message);
		}

		dispatch(fetchPortfoliosSuccess(result.data));

	}).catch((err) => {dispatch(fetchError(err.message))});
};

export const fetchTeamsData = () => async (dispatch, getState) => {

	dispatch(clearError());

	dispatch(fetchRequest());

	return await fetch(apiUrl.GET_TEAMS, {

		method: "GET",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

	}).then((response) => response.json()).then((result) => {

		process.env.NODE_ENV === "development" && console.log("result", result);

		if (result.status >= 400) {

			throw new Error(result.message);
		}

		dispatch(fetchTeamsSuccess(result.data));

	}).catch((err) => { dispatch(fetchError(err.message))});
};

export const fetchUpdateAccount = (payload) => async (dispatch, getState) => {

	dispatch(clearError());

	dispatch(fetchRequest());

	return await fetch(apiUrl.UPDATE_ACCOUNT, {

		method: "POST",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

		body: JSON.stringify(payload),

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) {

			throw new Error(result.message);
		}

		dispatch(fetchTeamsSuccess(result.data));

		dispatch(fetchSuccessMsg(result.message));

	}).catch((err) => dispatch(fetchError(err.message)));
};

export const fetchServiceData = () => async (dispatch, getState) => {

	dispatch(clearError());

	dispatch(fetchRequest());

	return await fetch(apiUrl.GET_SERVICE, {

		method: "GET",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) {

			throw new Error(result.message);
		}

		dispatch(fetchServiceSuccess(result.data));

	}).catch((err) => { dispatch(fetchError(err.message))});
};

export const clientFetchVendorProfileByUsername = (payload) => async (dispatch, getState) => {

	dispatch(clearError());

	dispatch(clearVendorPublicSearch());

	return await fetch(`${apiUrl.GET_VENDOR_PROFILE}/${payload.username}`, {

		method: "GET",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) {

			throw new Error(result.message);
		}

		if (!result || result.length === 0) {

			throw new Error("empty result");
		}

		dispatch(fetchvendor(result.data));

	}).catch((err) => dispatch(fetchError(err.message)));
};

export const fetchFindUser = async (payload) => {
	
	return await fetch(apiUrl.VENDOR_FIND, {

		method: "POST",

		headers: { Accept: "application/json", "Content-Type": "application/json"},

		body: JSON.stringify(payload),

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) {

			throw new Error(result.message);
		}

		return result;

	}).catch((err) => { throw err.message });
};

export const fetchCreateTeam = async (payload) => {

	return await fetch(apiUrl.CREATE_TEAM, {

		method: "POST",

		headers: { Accept: "application/json", "Content-Type": "application/json" },

		body: JSON.stringify(payload),

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) {

			throw new Error(result.message);
		}

		return result;

	}).catch((err) => { throw err.message });
};

export const fetchUpdateVendorProfile = async (payload) => {

	return await fetch(apiUrl.CREATE_TEAM, {

		method: "POST",
		
		headers: { Accept: "application/json", "Content-Type": "application/json" },

		body: JSON.stringify(payload),

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) {

			throw new Error(result.message);
		}

		return result;

	}).catch((err) => { throw err.message });
};


export const fetchUploadImagePortfolio = async(payload) => {

	const formData = new FormData();

	formData.append('file', payload.file)

	return await fetch(apiUrl.UPLOAD_IMG_PORTFOLIO, {

		method: "POST",

		body: formData

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) {

			throw new Error(result.message);
		}

		return result;

	}).catch((error) => { throw error });
};

export const fetchUploadVideoPortfolio = async(payload) => {

	return await fetch(apiUrl.UPLOAD_VIDEO_PORTFOLIO, {

		method: "POST",
		
		headers: { Accept: "application/json", "Content-Type": "application/json" },

		body: JSON.stringify(payload),

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) throw new Error(result.message);

		return result;

	}).catch(error => { throw error});
};

export const fetchDeletePortfolio = async(payload) => {

	return await fetch(apiUrl.DELETE_PORTFOLIO, {

		method: "POST",
		
		headers: { Accept: "application/json", "Content-Type": "application/json" },

		body: JSON.stringify(payload),

	}).then((response) => response.json()).then((result) => {

		if (result.status >= 400) throw new Error(result.message);

		return result;

	}).catch(error => { throw error});
};