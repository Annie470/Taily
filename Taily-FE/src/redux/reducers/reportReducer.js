import {
  CREATE_REPORT,
  FETCH_REPORTS,
  DELETE_REPORT,
} from "../actions/reportActions";

const initialState = {
  reports: [],
  createdReport: null,
  paginatedReports: null,
};

const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REPORT:
      return {
        ...state,
        createdReport: action.payload,
        reports: [action.payload, ...state.reports],
      };

    case FETCH_REPORTS:
      return {
        ...state,
        paginatedReports: action.payload,
      };

    case DELETE_REPORT:
      return {
        ...state,
        reports: state.reports.filter((report) => report.id !== action.payload),
      };

    default:
      return state;
  }
};

export default reportReducer;
