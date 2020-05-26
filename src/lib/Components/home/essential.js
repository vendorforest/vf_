import { apiUrl } from "@Shared/constants";
// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_INIT_SUCCESS = "FETCH_INIT_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";

// Reducer
export default function reducer(
  state = {
    error: undefined,
    success: undefined,
    homedata: undefined,
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
        homedata: action.payload,
        pending: false,
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
