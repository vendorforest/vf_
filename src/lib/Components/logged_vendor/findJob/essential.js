import { apiUrl } from "@Shared/constants";

// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_JOBS_SUCCESS = "FETCH_JOBS_SUCCESS";
const FETCH_SERVICE_SUCCESS = "FETCH_SERVICE_SUCCESS";
const FETCH_MSG_SUCCESS = "FETCH_MSG_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";
const FETCH_USERINFO_SUCCESS = "FETCH_USERINFO_SUCCESS";

// Reducer
export default function reducer(
  state = {
    error: undefined,
    success: undefined,
    jobs: undefined,
    services: undefined,
    pending: false,
    userInfo: undefined,
  },
  action,
) {
  switch (action.type) {
    case FETCH_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_JOBS_SUCCESS:
      return {
        ...state,
        jobs: action.payload,
        pending: false,
      };
    case FETCH_SERVICE_SUCCESS:
      return {
        ...state,
        services: action.payload,
        pending: false,
      };
    case FETCH_MSG_SUCCESS:
      return {
        ...state,
        pending: false,
        success: action.payload,
      };
    case FETCH_USERINFO_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
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

const fetchJobsSuccess = (jobsInfo) => ({
  type: FETCH_JOBS_SUCCESS,
  payload: jobsInfo,
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

const fetchUserInfoSuccess = (userData) => ({
  type: FETCH_USERINFO_SUCCESS,
  payload: userData,
});

// export const updatePortfolios = (payload) => {
//     return {
//         type: FETCH_PORTFOLIO_SUCCESS,
//         payload: payload
//     }
// }

export const fetchFindJobsData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.FIND_JOBS, {
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
        // process.env.NODE_ENV === "development" && console.log('getpersiste1', getState()._persist)
        // process.env.NODE_ENV === "development" && console.log('getpersiste2', getState()._persist.persist())
        // process.env.NODE_ENV === "development" && console.log('getpersiste3', getState()._persist.purge())
        dispatch(fetchError(result));
      }
      dispatch(fetchJobsSuccess(result.data));
    })
    .catch((err) => dispatch(fetchError(err.message)));
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

export const fetchUserInfo = () => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.GET_USER_INFO, {
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
      dispatch(fetchUserInfoSuccess(result.body));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};
