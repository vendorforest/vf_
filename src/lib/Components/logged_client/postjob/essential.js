import { apiUrl } from "@Shared/constants";
import * as sub from "./subscribe";
// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_INIT_SUCCESS = "FETCH_INIT_SUCCESS";
const FETCH_SERVICE_SUCCESS = "FETCH_SERVICE_SUCCESS";
const FETCH_MATCHVENDOR_SUCCESS = "FETCH_MATCHVENDOR_SUCCESS";
const FETCH_MSG_SUCCESS = "FETCH_MSG_SUCCESS";
const FETCH_POST_SUCCESS = "FETCH_POST_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";

const UPDATE_JOB = "UPDATE_JOB";
const UPDATE_STEP = "UPDATE_STEP";
// Reducer
export default function reducer(
  state = {
    error: undefined,
    success: undefined,
    currentStep: 0,
    user: undefined,
    services: [],
    vendors: undefined,
    job: undefined,
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
    case FETCH_SERVICE_SUCCESS:
      return {
        ...state,
        services: action.payload,
        pending: false,
      };
    case FETCH_MATCHVENDOR_SUCCESS:
      return {
        ...state,
        vendors: action.payload,
        pending: false,
      };
    case FETCH_MSG_SUCCESS:
      return {
        ...state,
        pending: false,
        success: action.payload,
      };
    case FETCH_POST_SUCCESS:
      return {
        ...state,
        pending: false,
        job: action.payload,
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
    case UPDATE_JOB:
      return {
        ...state,
        job: action.payload,
      };
    case UPDATE_STEP:
      return {
        ...state,
        currentStep: action.payload,
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

const fetchServiceSuccess = (sercieInfo) => ({
  type: FETCH_SERVICE_SUCCESS,
  payload: sercieInfo,
});

const fetchMatchVendorSuccess = (vendorInfo) => ({
  type: FETCH_MATCHVENDOR_SUCCESS,
  payload: vendorInfo,
});

const fetchSuccessMsg = (success) => ({
  type: FETCH_MSG_SUCCESS,
  payload: success,
});

const fetchPostSuccess = (success) => ({
  type: FETCH_POST_SUCCESS,
  payload: success,
});

const fetchError = (err) => ({
  type: FETCH_FAILURE,
  payload: err,
});

const clearError = () => ({
  type: CLEAR_FAILURE,
});

export const updateJob = (payload) => {
  return {
    type: UPDATE_JOB,
    payload: payload,
  };
};

export const updateStep = (payload) => {
  return {
    type: UPDATE_STEP,
    payload: payload,
  };
};

export const fetchInitialData = () => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.GET_USER, {
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
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchServiceData = () => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.GET_SERVICE, {
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
      dispatch(fetchServiceSuccess(result.data));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchMatchVendorData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.VENDOR_IN_RADIUS, {
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
      dispatch(fetchMatchVendorSuccess(result.data));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchPostJob = async (payload) => {
  return await fetch(apiUrl.CREATE_JOB, {
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
      return result;
    })
    .catch((err) => {
      throw err.message;
    });
};

export const sendEmail = (payload) => async (dispatch) => {
  sub.subscribeUser(payload);
  return await fetch(apiUrl.SEND_EMAIL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vendorID: payload }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.status >= 400) {
        throw new Error(result.message);
      }
      return result;
    })
    .catch((err) => {
      throw err.message;
    });
};

export const fetchUpdateJob = async (payload) => {
  return await fetch(apiUrl.UPDATE_JOB, {
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
      return result;
    })
    .catch((err) => {
      throw err.message;
    });
};

export const fetchGetJob = async (payload) => {
  let urlStr = "";
  Object.keys(payload).forEach((key, index) => {
    urlStr += `${index === 0 ? "?" : "&"}${key}=${payload[key]}`;
  });
  return await fetch(`${apiUrl.GET_JOB}${urlStr}`, {
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
      return result;
    })
    .catch((err) => {
      throw err.message;
    });
};
// to test init chat
export const initChat = async (payload) => {
  return await fetch(apiUrl.INIT_CHAT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vendor: payload }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.status >= 400) {
        throw new Error(result.message);
      }
      process.env.NODE_ENV === "development" && console.log("kkkkkkkkkk", result);
      return result;
    })
    .catch((err) => {
      throw err.message;
    });
};
