import {
  CREATE_POST,
  FETCH_USER_POSTS,
  DELETE_POST,
  REMOVE_GUEST,
  ADD_GUEST,
  FETCH_FILTERED_POSTS,
  DELETE_POST_BY_ADMIN,
  FIND_POST,
} from "../actions/postActions";

const initialState = {
  userPosts: [],
  createdPost: null,
  filteredPosts: [],
  foundedPost: null,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_POST:
      return {
        ...state,
        createdPost: action.payload,
        userPosts: [action.payload, ...state.userPosts],
      };

    case FETCH_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload,
      };

    case DELETE_POST:
      return {
        ...state,
        userPosts: state.userPosts.filter((post) => post.id !== action.payload),
        filteredPosts: state.filteredPosts.filter(
          (post) => post.id !== action.payload
        ),
      };

    case ADD_GUEST:
      return {
        ...state,
        userPosts: state.userPosts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
        filteredPosts: state.filteredPosts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
      };

    case REMOVE_GUEST:
      return {
        ...state,
        userPosts: state.userPosts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
        filteredPosts: state.filteredPosts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
      };

    case FETCH_FILTERED_POSTS:
      return {
        ...state,
        filteredPosts: action.payload,
      };

    case FIND_POST:
      return {
        ...state,
        foundedPost: action.payload,
      };

    case DELETE_POST_BY_ADMIN:
      return state;

    default:
      return state;
  }
};

export default postReducer;
