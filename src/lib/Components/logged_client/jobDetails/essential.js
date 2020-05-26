import { apiUrl } from "@Shared/constants";

// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_JOB_SUCCESS = "FETCH_JOB_SUCCESS";
const FETCH_PROPOSALES_SUCCESS = "FETCH_PROPOSALES_SUCCESS";
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

export const fetchGetJobData = (payload) => async (dispatch, getState) => {
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

export const fetchGetProposalesData = (payload) => async (dispatch, getState) => {
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

export const fetchGetReviewsData = (payload) => async (dispatch, getState) => {
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

export const askQuestion = async (payload) => {
  return await fetch(apiUrl.ASK_QUESTION, {
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
    .catch((err) => {
      throw err.message;
    });
};
