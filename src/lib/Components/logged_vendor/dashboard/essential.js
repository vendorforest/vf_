import { apiUrl, constants } from "@Shared/constants";
// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_INIT_SUCCESS = "FETCH_INIT_SUCCESS";
const FETCH_MSG_SUCCESS = "FETCH_MSG_SUCCESS";
const FETCH_SUBMITTEDPROPOSALES_SUCCESS = "FETCH_SUBMITTEDPROPOSALES_SUCCESS";
const FETCH_ACTIVEPROPOSALES_SUCCESS = "FETCH_ACTIVEPROPOSLES_SUCCESS";
const FETCH_PASTPROPOSALES_SUCCESS = "FETCH_PASTPROPOSALES_SUCCESS";
const FETCH_PENDINGCONTRACTS_SUCCESS = "FETCH_PENDINGCONTRACTS_SUCCESS";
const FETCH_PASTCONTRACTS_SUCCESS = "FETCH_PASTCONTRACTS_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";

// Reducer
export default function reducer(
  state = {
    error: undefined,
    success: undefined,
    submittedProposales: undefined,
    activeProposales: undefined,
    pastProposales: undefined,
    pendingContracts: undefined,
    pastContracts: undefined,
    pending: false,
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
        user: action.payload,
        pending: false,
      };
    case FETCH_SUBMITTEDPROPOSALES_SUCCESS:
      return {
        ...state,
        submittedProposales: action.payload,
        pending: false,
      };
    case FETCH_ACTIVEPROPOSALES_SUCCESS:
      return {
        ...state,
        activeProposales: action.payload,
        pending: false,
      };
    case FETCH_PASTPROPOSALES_SUCCESS:
      return {
        ...state,
        pastProposales: action.payload,
        pending: false,
      };
    case FETCH_PENDINGCONTRACTS_SUCCESS:
      return {
        ...state,
        pendingContracts: action.payload,
        pending: false,
      };
    case FETCH_PASTCONTRACTS_SUCCESS:
      return {
        ...state,
        pastContracts: action.payload,
        pending: false,
      };
    case FETCH_MSG_SUCCESS:
      return {
        ...state,
        pending: false,
        success: action.payload,
      };
    case FETCH_FAILURE:
      return {
        ...state,
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
}

// Action Creators
const fetchRequest = () => ({
  type: FETCH_REQUEST,
});

const fetchInitSuccess = (userInfo) => ({
  type: FETCH_INIT_SUCCESS,
  payload: userInfo,
});

const fetchSubmittedProposalesSuccess = (proposalesInfo) => ({
  type: FETCH_SUBMITTEDPROPOSALES_SUCCESS,
  payload: proposalesInfo,
});

const fetchActiveProposalesSuccess = (proposalesInfo) => ({
  type: FETCH_ACTIVEPROPOSALES_SUCCESS,
  payload: proposalesInfo,
});

const fetchPastProposalesSuccess = (proposalesInfo) => ({
  type: FETCH_PASTPROPOSALES_SUCCESS,
  payload: proposalesInfo,
});

const fetchPendingContractsSuccess = (contractsInfo) => ({
  type: FETCH_PENDINGCONTRACTS_SUCCESS,
  payload: contractsInfo,
});

const fetchPastContractsSuccess = (contractsInfo) => ({
  type: FETCH_PASTCONTRACTS_SUCCESS,
  payload: contractsInfo,
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

export const fetchSubmittedProposalesData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  let urlStr = "";
  Object.keys(payload).forEach((key, index) => {
    urlStr += `${index === 0 ? "?" : "&"}${key}=${payload[key]}`;
  });
  return await fetch(`${apiUrl.GET_PROPOSALES}${urlStr}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      process.env.NODE_ENV === "development" && console.log(result);
      if (result.status >= 400) {
        throw new Error(result.message);
      }
      dispatch(fetchSubmittedProposalesSuccess(result.data));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchActiveProposalesData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  let urlStr = "";
  Object.keys(payload).forEach((key, index) => {
    urlStr += `${index === 0 ? "?" : "&"}${key}=${payload[key]}`;
  });
  return await fetch(`${apiUrl.GET_PROPOSALES}${urlStr}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      process.env.NODE_ENV === "development" && console.log(result);
      if (result.status >= 400) {
        throw new Error(result.message);
      }
      dispatch(fetchActiveProposalesSuccess(result.data));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchPastProposalesData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  let urlStr = "";
  Object.keys(payload).forEach((key, index) => {
    urlStr += `${index === 0 ? "?" : "&"}${key}=${payload[key]}`;
  });
  return await fetch(`${apiUrl.GET_PROPOSALES}${urlStr}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      process.env.NODE_ENV === "development" && console.log(result);
      if (result.status >= 400) {
        throw new Error(result.message);
      }
      dispatch(fetchPastProposalesSuccess(result.data));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchPendingContractsData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  let urlStr = "";
  Object.keys(payload).forEach((key, index) => {
    urlStr += `${index === 0 ? "?" : "&"}${key}=${payload[key]}`;
  });
  return await fetch(`${apiUrl.GET_CONTRACTS}${urlStr}`, {
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
      dispatch(fetchPendingContractsSuccess(result.data));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchPastContractsData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  let urlStr = "";
  Object.keys(payload).forEach((key, index) => {
    urlStr += `${index === 0 ? "?" : "&"}${key}=${payload[key]}`;
  });
  return await fetch(`${apiUrl.GET_CONTRACTS}${urlStr}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      process.env.NODE_ENV === "development" && console.log("contract result", result);
      if (result.status >= 400) {
        throw new Error(result.message);
      }
      dispatch(fetchPastContractsSuccess(result.data));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};
