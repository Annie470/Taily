import {
  REGISTER_CHAIRMAN,
  SEARCH_USER,
  DELETE_USER,
  DELETE_EXPIRED_POSTS,
} from "../actions/adminActions";

const initialState = {
  registeredChairman: null,
  searchedUser: null,
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_CHAIRMAN:
      return {
        ...state,
        registeredChairman: action.payload,
      };
    case SEARCH_USER:
      return {
        ...state,
        searchedUser: action.payload,
      };
    case DELETE_USER:
      return {
        ...state,
        searchedUser: null,
      };

    case DELETE_EXPIRED_POSTS:
      return state;
    default:
      return state;
  }
};

export default adminReducer;
