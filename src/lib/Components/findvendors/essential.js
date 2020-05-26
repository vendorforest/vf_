import { apiUrl } from "@Shared/constants";
import { async } from "q";
// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_INIT_SUCCESS = "FETCH_INIT_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";
const FETCH_VENDORS_SUCCESS = "FETCH_VENDORS_SUCCESS";

// Reducer
export default function reducer(
  state = {
    error: undefined,
    success: undefined,
    homedata: undefined,
    pending: false,
    vendors: undefined,
  },
  action,
) {
  switch (action.type) {
    case FETCH_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_INIT_SUCCESS:
      return {
        ...state,
        homedata: action.payload,
        pending: false,
      };
    case FETCH_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case FETCH_VENDORS_SUCCESS:
      return {
        ...state,
        vendors: action.payload,
        pending: false,
      };
    case CLEAR_FAILURE:
      return {
        ...state,
        error: undefined,
        success: undefined,
        pending: false,
      };
    default:
      return state;
  }
}

// Action Creators
const fetchRequest = () => ({
  type: FETCH_REQUEST,
});

const fetchInitSuccess = (homeInfo) => ({
  type: FETCH_INIT_SUCCESS,
  payload: homeInfo,
});

const fetchError = (err) => ({
  type: FETCH_FAILURE,
  payload: err,
});

const clearError = () => ({
  type: CLEAR_FAILURE,
});

const fetchVendorsSuccess = (vendorsInfo) => ({
  type: FETCH_VENDORS_SUCCESS,
  payload: vendorsInfo,
});

export const fetchInitData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.GET_HOMEDATA, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.status >= 400) {
        throw new Error(result.message);
      }
      dispatch(fetchInitSuccess(result.data));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

export const fetchFindVendorsData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.FIND_VENDORS, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.status >= 400) {
        throw new Error(result.message);
      }
      if (result.status === 302) {
        dispatch(fetchError(result));
      }
      dispatch(fetchVendorsSuccess(result.data));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

export const fetchMyJob = async () => {
  return await fetch(apiUrl.GET_MY_POSTS, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (result) => {
      if (result.status >= 400) {
        throw new Error(result.message);
      }
      return result;
    })
    .catch((err) => {});
};

export const hireVendor = async (payload) => {
  return await fetch(apiUrl.HIRE_VENDOR, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then(async (result) => {
      if (result.status >= 400) {
        throw new Error(result.message);
      }
      return result;
    })
    .catch((err) => {});
};

export const askQuestion = async (payload) => {
  return await fetch(apiUrl.ASK_QUESTION, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then(async (result) => {
      if (result.status >= 400) {
        throw new Error(result.message);
      }
      return result;
    })
    .catch((err) => {});
};
