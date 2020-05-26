import { apiUrl, constants } from "@Shared/constants";
// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_MSG_SUCCESS = "FETCH_MSG_SUCCESS";
const FETCH_REVIEW_SUCCESS = "FETCH_REVIEW_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";

// Reducer
export default function reducer(
  state = {
    error: undefined,
    success: undefined,
    reviw: undefined,
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
    case FETCH_REVIEW_SUCCESS:
      return {
        ...state,
        review: action.payload,
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

const fetchReviewSuccess = (reviewInfo) => ({
  type: FETCH_REVIEW_SUCCESS,
  payload: reviewInfo,
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

export const fetchCreateReviewData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.CREATE_REVIEW, {
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
      dispatch(fetchReviewSuccess(result.data));
      dispatch(fetchSuccessMsg(result.message));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};
