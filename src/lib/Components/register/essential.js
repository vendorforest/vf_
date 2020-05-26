import { apiUrl } from "@Shared/constants";
// Actions
const FETCH_REGISTER_REQUEST = "FETCH_REGISTER_REQUEST";
const FETCH_REGISTER_SUCCESS = "FETCH_REGISTER_SUCCESS";
const FETCH_REGISTER_FAILURE = "FETCH_REGISTER_FAILURE";
const CLEAR_REGISTER_FAILURE = "CLEAR_REGISTER_FAILURE";
const CLEAR_REGISTER_RESULTS = "CLEAR_REGISTER_RESULTS";
// Reducer
export default function reducer(
  state = {
    error: false,
    user: undefined,
    pending: false,
  },
  action,
) {
  switch (action.type) {
    case FETCH_REGISTER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        pending: false,
      };
    case FETCH_REGISTER_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case CLEAR_REGISTER_FAILURE:
      return {
        error: false,
        pending: false,
        user: undefined,
      };
    case CLEAR_REGISTER_RESULTS:
      return {
        error: false,
        pending: false,
        user: undefined,
      };
    default:
      return state;
  }
}

// Action Creators
const requestRegister = () => ({
  type: FETCH_REGISTER_REQUEST,
});
const receivedRegister = (userInfo) => ({
  type: FETCH_REGISTER_SUCCESS,
  payload: userInfo,
});
const RegisterError = (err) => ({
  type: FETCH_REGISTER_FAILURE,
  payload: err,
});

const clearRegisterError = () => ({
  type: CLEAR_REGISTER_FAILURE,
});

const clearRegisterResults = () => ({
  type: CLEAR_REGISTER_RESULTS,
});

export const fetchRegister = (payload) => async (dispatch, getState) => {
  dispatch(clearRegisterError());
  dispatch(requestRegister());
  return await fetch(apiUrl.REGISTER, {
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
        throw new Error(result.msg);
      }
      dispatch(receivedRegister(result));
    })
    .catch((err) => dispatch(RegisterError(err.message)));
};

export const restRegisterState = (payload) => async (dispatch, getState) => {
  await dispatch(clearRegisterError());
  await dispatch(clearRegisterResults());
};
