import { apiUrl, constants } from "@Shared/constants";
import { async } from "q";

// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_CONTRACT_SUCCESS = "FETCH_CONTRACT_SUCCESS";
const FETCH_ATTACHFILES_SUCCESS = "FETCH_ATTACHFILES_SUCCESS";
const FETCH_MILESTONES_SUCCESS = "FETCH_MILESTONES_SUCCESS";
const FETCH_MSG_SUCCESS = "FETCH_MSG_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";

// Reducer
export default function reducer(
  state = {
    error: undefined,
    success: undefined,
    contract: undefined,
    attachFiles: undefined,
    milestones: undefined,
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
    case FETCH_CONTRACT_SUCCESS:
      return {
        ...state,
        contract: action.payload,
        pending: false,
      };
    case FETCH_MILESTONES_SUCCESS:
      return {
        ...state,
        milestones: action.payload,
        pending: false,
      };
    case FETCH_ATTACHFILES_SUCCESS:
      return {
        ...state,
        attachFiles: action.payload,
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

const fetchContractSuccess = (contractInfo) => ({
  type: FETCH_CONTRACT_SUCCESS,
  payload: contractInfo,
});

const fetchAttachFilesSuccess = (attachFilesInfo) => ({
  type: FETCH_ATTACHFILES_SUCCESS,
  payload: attachFilesInfo,
});

const fetchMilestonesSuccess = (milestonesInfo) => ({
  type: FETCH_MILESTONES_SUCCESS,
  payload: milestonesInfo,
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

export const updateContract = (payload) => {
  return {
    type: FETCH_CONTRACT_SUCCESS,
    payload: payload,
  };
};

export const fetchGetContractData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  let urlStr = "";
  Object.keys(payload).forEach((key, index) => {
    urlStr += `${index === 0 ? "?" : "&"}${key}=${payload[key]}`;
  });
  return await fetch(`${apiUrl.GET_CONTRACT}${urlStr}`, {
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
      dispatch(fetchContractSuccess(result.data));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

export const jobComplete = async (payload) => {
  return await fetch(apiUrl.SEND_JOB_COMPLETE, {
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
      console.log(err);
    });
};

export const fetchUpdateContractData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
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
      dispatch(fetchContractSuccess(result.data));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

export const fetchGetAttachFilesData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  let urlStr = "";
  Object.keys(payload).forEach((key, index) => {
    urlStr += `${index === 0 ? "?" : "&"}${key}=${payload[key]}`;
  });
  return await fetch(`${apiUrl.GET_ATTACHFILES}${urlStr}`, {
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
      dispatch(fetchAttachFilesSuccess(result.data));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

export const fetchGetMilestonesData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  let urlStr = "";
  Object.keys(payload).forEach((key, index) => {
    urlStr += `${index === 0 ? "?" : "&"}${key}=${payload[key]}`;
  });
  return await fetch(`${apiUrl.GET_MILESTONES}${urlStr}`, {
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
      dispatch(fetchMilestonesSuccess(result.data));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

export const fetchRequestRleaseMilestoneData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.REQ_RELEASE_MILESTONE, {
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
      const newMilestones = [...getState().clientContractDetailsReducer.milestones];
      const newContract = { ...getState().clientContractDetailsReducer.contract };
      const index = newMilestones.findIndex((ms) => ms._id === result.data._id);
      if (index > -1) {
        newMilestones[index] = result.data;
      }
      dispatch(fetchMilestonesSuccess(newMilestones));
      dispatch(fetchContractSuccess(newContract));
      dispatch(fetchSuccessMsg(result.message));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

export const fetchCancelMilestoneData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.CANCEL_MILESTONE, {
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
      const newMilestones = [...getState().clientContractDetailsReducer.milestones];
      const index = newMilestones.findIndex((ms) => ms._id === result.data._id);
      if (index > -1) {
        newMilestones.splice(index, 1);
      }
      dispatch(fetchMilestonesSuccess(newMilestones));
      dispatch(fetchSuccessMsg(result.message));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

// export const fetchCreateContract = async (payload) => {
//     return await fetch(apiUrl.CREATE_CONTRACT, {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(payload)
//         })
//         .then(response => response.json())
//         .then(result => {
//             if (result.status >= 400) {
//                 throw new Error(result.message);
//             }
//             return result
//         })
//         .catch(err => {throw err.message});
// };
