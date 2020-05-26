import { apiUrl } from "@Shared/constants";
import { PURGE } from "redux-persist";

// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_JOB_SUCCESS = "FETCH_JOB_SUCCESS";
const FETCH_PROPOSALES_SUCCESS = "FETCH_PROPOSALES_SUCCESS";
const FETCH_REVIEWS_SUCCESS = "FETCH_REVIEWS_SUCCESS";
const FETCH_MSG_SUCCESS = "FETCH_MSG_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";
const FETCH_NOTI_SUCCESS = "FETCH_NOTI_SUCCESS";

// Reducer
export default function reducer(
  state = {
    error: undefined,
    success: undefined,
    job: undefined,
    proposales: undefined,
    reviews: [],
    pending: false,
    navNotification: undefined,
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
    case CLEAR_FAILURE:
      return {
        ...state,
        error: undefined,
        success: undefined,
        pending: false,
      };
    case FETCH_NOTI_SUCCESS:
      return {
        ...state,
        navNotification: action.payload,
      };
    case PURGE:
      return {};
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

const fetchNotiSuccess = (data) => ({
  type: FETCH_NOTI_SUCCESS,
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

export const getNavBarNotification = () => async (dispatch) => {
  return await fetch(apiUrl.GET_NAV_NOTIFICATION, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      process.env.NODE_ENV === "development" && console.log("fetch result = ", result);
      dispatch(fetchNotiSuccess(result.result));
    })
    .catch((err) => process.env.NODE_ENV === "development" && console.log("fetch error", err));
};

export const logout = () => async (dispatch, getState) => {
  return fetch(`/logout`);
};

export const fetchGetJobData = (payload) => async (dispatch) => {
  dispatch(clearError());
  dispatch(fetchRequest());
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
      dispatch(fetchJobSuccess(result.data));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

export const fetchGetProposalesData = (payload) => async (dispatch) => {
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
      if (result.status >= 400) {
        throw new Error(result.message);
      }
      dispatch(fetchProposalesSuccess(result.data));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

export const fetchGetReviewsData = (payload) => async (dispatch) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  let urlStr = "";
  Object.keys(payload).forEach((key, index) => {
    urlStr += `${index === 0 ? "?" : "&"}${key}=${payload[key]}`;
  });
  return await fetch(`${apiUrl.GET_REVIEWS}${urlStr}`, {
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
      dispatch(fetchReviewsSuccess(result.data));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

export const fetchCreateContract = async (payload) => {
  return await fetch(apiUrl.CREATE_CONTRACT, {
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

export const getBadge = async () => {
  return await fetch(apiUrl.GET_BADGE, {
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

export const isRead = (payload) => async (dispatch) => {
  return await fetch(apiUrl.CHECK_NOTI, {
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
    })
    .catch((err) => {
      throw err.message;
    });
};

export const fetchCloseJob = async (payload) => {
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

export const fetchDeclineProposal = async (payload) => {
  return await fetch(apiUrl.DECLINE_PROPOSAL, {
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
      return result;
    })
    .catch((err) => {
      throw err.message;
    });
};
