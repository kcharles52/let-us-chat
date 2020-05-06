import { CREATE_ROOM, JOIN_ROOM } from "./types";
import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : window.location.origin;

export const getSessionInfo = () => (dispatch) => {
  axios
    .post(`${baseURL}/api/session`)
    .then((response) => {
      dispatch({
        type: CREATE_ROOM,
        payload: response.data,
      });
    })
    .catch((error) => {
      return error.response;
    });
};

export const getToken = (sessionId) => (dispatch) => {
  return axios
    .post(`${baseURL}/api/token`, { sessionId })
    .then((response) => {
      dispatch({
        type: JOIN_ROOM,
        payload: response.data,
      });
    })
    .catch((error) => {
      return error.response;
    });
};

const userInitialState = {
  data: [],
  createdRoom: {
    apiKey: "",
    sessionId: "",
    token: "",
  },
  availableRooms: [],
  userToken: "",
};

export const reducer = (state = userInitialState, action) => {
  switch (action.type) {
    case CREATE_ROOM:
      return {
        ...state,
        createdRoom: action.payload,
      };
    case JOIN_ROOM:
      return {
        ...state,
        userToken: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
