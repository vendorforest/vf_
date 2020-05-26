import { apiUrl, API_URL } from "@Shared/constants";
// import stripe from "react-stripe-elements";
// Actions
const FETCH_VERIFY_REQUEST = "FETCH_VERIFY_REQUEST";
const FETCH_SUCCESS = "FETCH_SUCCESS";
const FETCH_ERROR = "FETCH_ERROR";
const CLEAR_FAILURE = "CLEAR_SETTINGS_FAILURE";
// Reducer
export const ForgotPasswordReducer = function reducer(
  state = {
    error: undefined,
    success: undefined,
    pending: false,
  },
  action,
) {
  switch (action.type) {
    case FETCH_VERIFY_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        error: undefined,
        pending: false,
        success: action.payload,
      };
    case FETCH_ERROR:
      return {
        ...state,
        success: undefined,
        pending: false,
        error: action.payload,
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
};

// Action Creators
const requestVerifyLink = () => ({
  type: FETCH_VERIFY_REQUEST,
});

const setSuccess = (success) => ({
  type: FETCH_SUCCESS,
  payload: success,
});

const setError = (error) => ({
  type: FETCH_ERROR,
  payload: error,
});

const clearError = () => ({
  type: CLEAR_FAILURE,
});

export const fetchResetPass = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(requestVerifyLink());
  return await fetch(`${API_URL}/apis/forgotPassword`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((result) => {
      process.env.NODE_ENV === "development" && console.log("client result", result);
      if (result.status >= 400) {
        throw new Error(result.message);
      }
      dispatch(setSuccess(result.message));
    })
    .catch((err) => dispatch(setError(err.message)));
};

export const verifyLink = (token) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(requestVerifyLink());
  return await fetch(`${API_URL}/apis/authToken/${token}`, {
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
      dispatch(setSuccess("This Link is authenticated!"));
    })
    .catch((err) => dispatch(setError(err.message)));
};
