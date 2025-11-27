import { LOGIN, LOGOUT } from "../actions/authActions";

const initialState = {
  token: null,
  role: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.payload.token,
        role: action.payload.role,
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default authReducer;
