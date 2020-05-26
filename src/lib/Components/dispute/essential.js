import { apiUrl } from "@Shared/constants";

// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_JOB_SUCCESS = "FETCH_JOB_SUCCESS";
const FETCH_PROPOSALES_SUCCESS = "FETCH_PROPOSALES_SUCCESS";
const FETCH_REVIEWS_SUCCESS = "FETCH_REVIEWS_SUCCESS";
const FETCH_MSG_SUCCESS = "FETCH_MSG_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";
const FETCH_PENDING_DISPUTE_SUCCESS = "FETCH_PENDING_DISPUTE_SUCCESS";
const FETCH_CLOSED_DISPUTE_SUCCESS = "FETCH_CLOSED_DISPUTE_SUCCESS";

// Reducer
export default function reducer(
  state = {
    error: undefined,
    success: undefined,
    job: undefined,
    proposales: undefined,
    reviews: [],
    pending: false,
    pendingDisputes: undefined,
    closedDisputes: undefined,
  },
  action,
) {
  switch (action.type) {
    case FETCH_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_JOB_SUCCESS:
      return {
        ...state,
        job: action.payload,
        pending: false,
      };
    case FETCH_PROPOSALES_SUCCESS:
      return {
        ...state,
        proposales: action.payload,
        pending: false,
      };
    case FETCH_REVIEWS_SUCCESS:
      return {
        ...state,
        reviews: action.payload,
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
    case FETCH_PENDING_DISPUTE_SUCCESS:
      return {
        ...state,
        pendingDisputes: action.payload,
      };
    case FETCH_CLOSED_DISPUTE_SUCCESS:
      return {
        ...state,
        closedDisputes: action.payload,
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

const fetchJobSuccess = (jobInfo) => ({
  type: FETCH_JOB_SUCCESS,
  payload: jobInfo,
});

const fetchProposalesSuccess = (proposalesInfo) => ({
  type: FETCH_PROPOSALES_SUCCESS,
  payload: proposalesInfo,
});

const fetchReviewsSuccess = (reviewsInfo) => ({
  type: FETCH_REVIEWS_SUCCESS,
  payload: reviewsInfo,
});

const fetchSuccessMsg = (success) => ({
  type: FETCH_MSG_SUCCESS,
  payload: success,
});

const fetchPendingDisputeSuccess = (data) => ({
  type: FETCH_PENDING_DISPUTE_SUCCESS,
  payload: data,
});

const fetchClosedDisputeSuccess = (data) => ({
  type: FETCH_CLOSED_DISPUTE_SUCCESS,
  payload: data,
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
    type: FETCH_JOB_SUCCESS,
    payload: payload,
  };
};

export const updateProposal = (payload) => {
  return {
    type: FETCH_PROPOSALES_SUCCESS,
    payload: payload,
  };
};

export const getPendingDisputes = () => async (dispatch) => {
  return await fetch(apiUrl.GET_PENDING_DISPUTE, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      dispatch(fetchPendingDisputeSuccess(result.data));
    })
    .catch((err) => process.env.NODE_ENV === "development" && console.log("fetch error", err));
};

export const getClosedDisputes = () => async (dispatch) => {
  return await fetch(apiUrl.GET_CLOSED_DISPUTE, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      dispatch(fetchClosedDisputeSuccess(result.data));
    })
    .catch((err) => process.env.NODE_ENV === "development" && console.log("fetch error", err));
};

export const DeleteNotification = async (payload) => {
  process.env.NODE_ENV === "development" && console.log("urlstring", payload);
  return await fetch(apiUrl.DELETE_NOTIFICATION, {
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
