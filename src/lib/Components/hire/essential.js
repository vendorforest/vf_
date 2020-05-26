import { apiUrl } from "@Shared/constants";

// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_JOB_SUCCESS = "FETCH_JOB_SUCCESS";
const FETCH_HIRE_DATA_SUCCESS = "FETCH_HIRE_DATA_SUCCESS";
const FETCH_REVIEWS_SUCCESS = "FETCH_REVIEWS_SUCCESS";
const FETCH_MSG_SUCCESS = "FETCH_MSG_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";

// Reducer
export default function reducer(
  state = {
    error: undefined,
    success: undefined,
    job: undefined,
    proposales: undefined,
    hireInfo: undefined,
    reviews: [],
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
    case FETCH_JOB_SUCCESS:
      return {
        ...state,
        job: action.payload,
        pending: false,
      };
    case FETCH_HIRE_DATA_SUCCESS:
      return {
        ...state,
        hireInfo: action.payload,
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

const fetchGetHireDataSuccess = (hireInfo) => ({
  type: FETCH_HIRE_DATA_SUCCESS,
  payload: hireInfo,
});

const fetchReviewsSuccess = (reviewsInfo) => ({
  type: FETCH_REVIEWS_SUCCESS,
  payload: reviewsInfo,
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

export const updateJob = (payload) => {
  return {
    type: FETCH_JOB_SUCCESS,
    payload: payload,
  };
};

export const fetchGetHireData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.GET_HIRE_DETAIL, {
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
      dispatch(fetchGetHireDataSuccess(result.data));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

export const updateProposal = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.UPDATE_HIRE_PROPOSAL, {
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
      dispatch(fetchSuccessMsg(result.message));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

export const comparePW = async (payload) => {
  return await fetch(apiUrl.CREATE_MILESTONE, {
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
