import {
  SET_CITY,
  FETCH_PROVINCE,
  FETCH_COMUNI,
} from "../actions/locationActions";

const initialState = {
  city: null,
  lat: null,
  lon: null,
  province: [],
  comuni: [],
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CITY:
      return {
        ...state,
        city: action.payload.city,
        lat: action.payload.lat,
        lon: action.payload.lon,
      };

    case FETCH_PROVINCE:
      return {
        ...state,
        province: action.payload,
      };

    case FETCH_COMUNI:
      return {
        ...state,
        comuni: action.payload,
      };

    default:
      return state;
  }
};

export default locationReducer;
