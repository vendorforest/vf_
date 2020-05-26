import { apiUrl } from "../../../constants";
import { constants } from "../../../constants";

// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_INIT_SUCCESS = "FETCH_INIT_SUCCESS";
const FETCH_MSG_SUCCESS = "FETCH_MSG_SUCCESS";
const FETCH_POSTEDJOB_SUCCESS = "FETCH_POSTEDJOB_SUCCESS";
const FETCH_PASTCONTRACT_SUCCESS = "FETCH_PASTCONTRACT_SUCCESS";
const FETCH_PENDINGCONTRACT_SUCCESS = "FETCH_PENDINGCONTRACT_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";
const FETCH_CLIENT_INFO_SUCCESS = "FETCH_CLIENT_INFO_SUCCESS";

// Reducer
export default function reducer(
  state = {
    error: undefined,
    success: undefined,
    postedJobs: undefined,
    pendingContracts: undefined,
    pastContracts: undefined,
    pending: false,
    clientInfo: undefined,
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
    case FETCH_POSTEDJOB_SUCCESS:
      return {
        ...state,
        postedJobs: action.payload,
        pending: false,
      };
    case FETCH_CLIENT_INFO_SUCCESS:
      return {
        ...state,
        clientInfo: action.payload,
      };
    case FETCH_PASTCONTRACT_SUCCESS:
      return {
        ...state,
        pastContracts: action.payload,
        pending: false,
      };
    case FETCH_PENDINGCONTRACT_SUCCESS:
      return {
        ...state,
        pendingContracts: action.payload,
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

const fetchPostedJobsSuccess = (jobInfo) => ({
  type: FETCH_POSTEDJOB_SUCCESS,
  payload: jobInfo,
});

const fetchPendingContractsSuccess = (contractInfo) => ({
  type: FETCH_PENDINGCONTRACT_SUCCESS,
  payload: contractInfo,
});

const fetchPastContractsSuccess = (contractInfo) => ({
  type: FETCH_PASTCONTRACT_SUCCESS,
  payload: contractInfo,
});

const fetchSuccessMsg = (success) => ({
  type: FETCH_MSG_SUCCESS,
  payload: success,
});

const fetchClientInfoSuccess = (payload) => ({
  type: FETCH_CLIENT_INFO_SUCCESS,
  payload: payload,
});
const fetchError = (err) => ({
  type: FETCH_FAILURE,
  payload: err,
});

const clearError = () => ({
  type: CLEAR_FAILURE,
});

export const updatePendingContracts = (payload) => {
  return {
    type: FETCH_PENDINGCONTRACT_SUCCESS,
    payload: payload,
  };
};

export const updatePastContracts = (payload) => {
  return {
    type: FETCH_PASTCONTRACT_SUCCESS,
    payload: payload,
  };
};

export const fetchPostJobsData = () => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.GET_CLIENT_JOBS, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.status >= 400) {
        throw new Error(result.message);
      }
      dispatch(fetchPostedJobsSuccess(result.data));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchPendingContractsData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchPendingContractsSuccess(undefined));
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
  dispatch(fetchPastContractsSuccess(undefined));
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
      dispatch(fetchPastContractsSuccess(result.data));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

export const fetchUpdateContract = async (payload) => {
  return await fetch(apiUrl.UPDATE_CONTRACT, {
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

export const fetchEndContract = async (payload) => {
  return await fetch(apiUrl.END_CONTRACT, {
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

export const fetchClient = () => async (dispatch) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.GET_CLIENT, {
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
      dispatch(fetchClientInfoSuccess(result.data));
    })
    .catch((err) => {
      throw err.message;
    });
};
