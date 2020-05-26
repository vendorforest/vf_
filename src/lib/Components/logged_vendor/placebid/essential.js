import { apiUrl } from "@Shared/constants";
import store from "store";

// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_PBDJOB_SUCCESS = "FETCH_PBDJOB_SUCCESS";
const FETCH_PBDPROPOSAL_SUCCESS = "FETCH_PBDPROPOSAL_SUCCESS";
const FETCH_PBDTEAMS_SUCCESS = "FETCH_PBDTEAMS_SUCCESS";
const FETCH_MSG_SUCCESS = "FETCH_MSG_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";

// Reducer
export default function reducer(
  state = {
    error: undefined,
    success: undefined,
    job: undefined,
    proposal: undefined,
    teams: undefined,
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
    case FETCH_PBDJOB_SUCCESS:
      return {
        ...state,
        job: action.payload,
        pending: false,
      };
    case FETCH_PBDPROPOSAL_SUCCESS:
      return {
        ...state,
        proposal: action.payload,
        pending: false,
      };
    case FETCH_PBDTEAMS_SUCCESS:
      return {
        ...state,
        teams: action.payload,
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
  type: FETCH_PBDJOB_SUCCESS,
  payload: jobInfo,
});

const fetchProposalSuccess = (proposalInfo) => ({
  type: FETCH_PBDPROPOSAL_SUCCESS,
  payload: proposalInfo,
});

const fetchTeamsSuccess = (teamInfo) => ({
  type: FETCH_PBDTEAMS_SUCCESS,
  payload: teamInfo,
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

export const fetchGetJobData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchProposalSuccess(undefined));
  dispatch(fetchJobSuccess(undefined));
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

export const fetchGetProposalData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchProposalSuccess(undefined));
  dispatch(fetchJobSuccess(undefined));
  dispatch(fetchRequest());
  let urlStr = "";
  Object.keys(payload).forEach((key, index) => {
    urlStr += `${index === 0 ? "?" : "&"}${key}=${payload[key]}`;
  });
  return await fetch(`${apiUrl.GET_PROPOSALE}${urlStr}`, {
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
      dispatch(fetchProposalSuccess(result.data));
      dispatch(fetchJobSuccess(result.data.job));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

export const fetchTeamsData = () => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.GET_TEAMS, {
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
      dispatch(fetchTeamsSuccess(result.data));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchProposalSubmit = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.CREATE_PROPOSAL, {
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
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchProposalUpdate = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.UPDATE_PROPOSAL, {
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
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};
