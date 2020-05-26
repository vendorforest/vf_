import { apiUrl, constants } from "@Shared/constants";
// import getStorage from "redux-persist/es/storage/getStorage";
// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const SET_CLIENT_NAME = "SET_CLIENT_NAME";
const FETCH_INIT_SUCCESS = "FETCH_INIT_SUCCESS";
const FETCH_CONNECTEDUSER_SUCCESS = "FETCH_CONNECTEDUSER_SUCCESS";
const FETCH_OLD_MESSAGE = "FETCH_OLD_MESSAGE";
const FETCH_POSTEDJOB_SUCCESS = "FETCH_POSTEDJOB_SUCCESS";
const FETCH_PASTCONTRACT_SUCCESS = "FETCH_PASTCONTRACT_SUCCESS";
const FETCH_PENDINGCONTRACT_SUCCESS = "FETCH_PENDINGCONTRACT_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";

// Reducer
export default function reducer(
  state = {
    error: undefined,
    success: undefined,
    postedJobs: undefined,
    pendingContracts: undefined,
    pastContracts: undefined,
    pending: false,
    connectedUser: undefined,
    oldMsg: undefined,
    clientName: undefined,
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
    case FETCH_CONNECTEDUSER_SUCCESS:
      return {
        ...state,
        connectedUser: action.payload,
      };
    case FETCH_OLD_MESSAGE:
      return {
        ...state,
        oldMsg: action.payload,
      };
    case SET_CLIENT_NAME:
      return {
        ...state,
        clientName: action.payload,
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

const fetchGetConnectedUserSuccess = (connectedUser) => ({
  type: FETCH_CONNECTEDUSER_SUCCESS,
  payload: connectedUser,
});

const fetchOldMsgSuccess = (oldMsgs) => ({
  type: FETCH_OLD_MESSAGE,
  payload: oldMsgs,
});

const setClientID = (clientName) => ({
  type: SET_CLIENT_NAME,
  payload: clientName,
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

export const sendEmail = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.RESET_EMAIL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail: payload }),
  })
    .then((response) => response.json())
    .then((result) => {
      dispatch(fetchInitSuccess(result));
    })
    .catch((err) => {
      console.log(err);
      dispatch(fetchError(err));
    });
};
