import { apiUrl } from "@Shared/constants";

// Actions
const FETCH_REQUEST = "FETCH_REQUEST";
const FETCH_TEAM_SUCCESS = "FETCH_TEAM_SUCCESS";
const FETCH_OFFERS_SUCCESS = "FETCH_OFFERS_SUCCESS";
const FETCH_MSG_SUCCESS = "FETCH_MSG_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const CLEAR_FAILURE = "CLEAR_FAILURE";
const FETCH_PENDINGCONTRACTS_SUCCESS = "FETCH_PENDINGCONTRACTS_SUCCESS";
const FETCH_PASTCONTRACTS_SUCCESS = "FETCH_PASTCONTRACTS_SUCCESS";
// Reducer
export default function reducer(
  state = {
    error: undefined,
    success: undefined,
    team: undefined,
    offers: undefined,
    pending: false,
    pendingContracts: undefined,
    pastContracts: undefined,
  },
  action,
) {
  switch (action.type) {
    case FETCH_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_TEAM_SUCCESS:
      return {
        ...state,
        team: action.payload,
        pending: false,
      };
    case FETCH_OFFERS_SUCCESS:
      return {
        ...state,
        offers: action.payload,
        pending: false,
      };
    case FETCH_PENDINGCONTRACTS_SUCCESS:
      return {
        ...state,
        pendingContracts: action.payload,
        pending: false,
      };
    case FETCH_PASTCONTRACTS_SUCCESS:
      return {
        ...state,
        pastContracts: action.payload,
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

const fetchTeamSuccess = (teamInfo) => ({
  type: FETCH_TEAM_SUCCESS,
  payload: teamInfo,
});

const fetchOffersSuccess = (offersInfo) => ({
  type: FETCH_OFFERS_SUCCESS,
  payload: offersInfo,
});

const fetchPendingContractsSuccess = (contractsInfo) => ({
  type: FETCH_PENDINGCONTRACTS_SUCCESS,
  payload: contractsInfo,
});

const fetchPastContractsSuccess = (contractsInfo) => ({
  type: FETCH_PASTCONTRACTS_SUCCESS,
  payload: contractsInfo,
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

export const updateTeam = (payload) => {
  return {
    type: FETCH_TEAM_SUCCESS,
    payload: payload,
  };
};

export const fetchTeamData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(`${apiUrl.GET_TEAM}?_id=${payload._id}`, {
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
      dispatch(fetchTeamSuccess(result.data));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchOffersData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  let urlStr = "";
  Object.keys(payload).forEach((key, index) => {
    urlStr += `${index === 0 ? "?" : "&"}${key}=${payload[key]}`;
  });
  return await fetch(`${apiUrl.GET_OFFERS}${urlStr}`, {
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
      dispatch(fetchOffersSuccess(result.data));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchPendingContractsData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.GET_TEAM_PENDING_CONTRACT, {
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
      dispatch(fetchPendingContractsSuccess(result.data));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchPastContractsData = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.GET_TEAM_PENDING_CONTRACT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((result) => {
      process.env.NODE_ENV === "development" && console.log("contract result", result);
      if (result.status >= 400) {
        throw new Error(result.message);
      }
      dispatch(fetchPastContractsSuccess(result.data));
    })
    .catch((err) => dispatch(fetchError(err.message)));
};

export const fetchOfferDecline = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  const offers = [...payload.offers];
  delete payload.offers;
  return await fetch(apiUrl.DECLINE_OFFER, {
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
      const index = offers.findIndex((offer) => offer._id === payload._id);
      offers.splice(index, 1);
      dispatch(fetchOffersSuccess(offers));
      dispatch(fetchSuccessMsg(result.message));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchOfferAccept = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  const offers = [...payload.offers];
  delete payload.offers;
  return await fetch(apiUrl.ACCEPT_OFFER, {
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
      const index = offers.findIndex((offer) => offer._id === payload._id);
      offers.splice(index, 1);
      dispatch(fetchOffersSuccess(offers));
      dispatch(fetchSuccessMsg(result.message));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchInviteAccept = (payload) => async (dispatch, getState) => {
  dispatch(clearError());
  dispatch(fetchRequest());
  return await fetch(apiUrl.ACCEPT_TEAM_INVITE, {
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
      dispatch(fetchTeamSuccess(result.data));
      dispatch(fetchSuccessMsg(result.message));
    })
    .catch((err) => {
      process.env.NODE_ENV === "development" && console.log(err);
      dispatch(fetchError(err.message));
    });
};

export const fetchInviteDecline = async (payload) => {
  return await fetch(apiUrl.DECLINE_TEAM_INVITE, {
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

export const fetchMemberDecline = async (payload) => {
  process.env.NODE_ENV === "development" && console.log("urlstring", payload);
  return await fetch(apiUrl.DECLINE_TEAM_MEMBER, {
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

export const fetchTeamInviteUsers = async (payload) => {
  return await fetch(apiUrl.INVITE_TEAMUSERS, {
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

// export const fetchFindUser = async (payload) => {
//   let urlStr = "";
//   Object.keys(payload).forEach((key, index) => {
//     urlStr += `${index === 0 ? "?" : "&"}${key}=${payload[key]}`;
//   });
//   return await fetch(`${apiUrl.VENDOR_FIND}${urlStr}`, {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((result) => {
//       if (result.status >= 400) {
//         throw new Error(result.message);
//       }
//       return result;
//     })
//     .catch((err) => {
//       throw err.message;
//     });
// };

export const fetchFindUser = async (payload) => {
  let urlStr = "";
  // Object.keys(payload).forEach((key, index) => {
  //   urlStr += `${index === 0 ? "?" : "&"}${key}=${payload[key]}`;
  // });
  process.env.NODE_ENV === "development" && console.log("urlstring", urlStr);
  return await fetch(apiUrl.VENDOR_FIND, {
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
