import {
  FETCH_PROFILE,
  SET_USER_ID,
  UPDATE_PROFILE,
  UPDATE_PASSWORD,
  UPLOAD_AVATAR,
  DELETE_PROFILE,
  FETCH_OTHER_PROFILE,
} from "../actions/profileActions";
import {
  FETCH_FOLLOWING,
  FETCH_FOLLOWERS,
  FOLLOW_USER,
  UNFOLLOW_USER,
  CHECK_FOLLOWING,
  FETCH_STATS,
} from "../actions/friendsActions";

const initialState = {
  data: null,
  userId: null,
  otherProfile: null,
  following: [],
  followers: [],
  followingStatus: {},
  stats: {},
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROFILE:
      return {
        ...state,
        data: action.payload,
      };

    case SET_USER_ID:
      return {
        ...state,
        userId: action.payload,
      };

    case UPDATE_PROFILE:
      return {
        ...state,
        data: action.payload,
      };

    case UPDATE_PASSWORD:
      return {
        ...state,
        data: action.payload,
      };

    case UPLOAD_AVATAR:
      return {
        ...state,
        currentProfile: action.payload,
      };

    case DELETE_PROFILE:
      return initialState;

    case FETCH_OTHER_PROFILE:
      return {
        ...state,
        otherProfile: action.payload,
      };

    case FETCH_FOLLOWING:
      return {
        ...state,
        following: action.payload,
      };

    case FETCH_FOLLOWERS:
      return {
        ...state,
        followers: action.payload,
      };

    case FOLLOW_USER:
      return {
        ...state,
        followingStatus: {
          ...state.followingStatus,
          [action.payload]: true,
        },
      };

    case UNFOLLOW_USER:
      return {
        ...state,
        following: state.following.filter((user) => user.id !== action.payload),
        followingStatus: {
          ...state.followingStatus,
          [action.payload]: false,
        },
      };

    case CHECK_FOLLOWING:
      return {
        ...state,
        followingStatus: {
          ...state.followingStatus,
          [action.payload.userId]: action.payload.isFollowing,
        },
      };

    case FETCH_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          [action.payload.userId]: action.payload.stats,
        },
      };

    default:
      return state;
  }
};

export default profileReducer;
