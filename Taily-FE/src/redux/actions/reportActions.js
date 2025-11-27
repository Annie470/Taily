export const CREATE_REPORT = "CREATE_REPORT";
export const FETCH_REPORTS = "FETCH_REPORTS";
export const DELETE_REPORT = "DELETE_REPORT";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const createReport = (token, reportData) => {
  return (dispatch) => {
    return fetch(`${API_URL}/reports`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            const errorMessage =
              errorData.errors && errorData.errors.length > 0
                ? errorData.errors.join(", ")
                : errorData.message ||
                  "Errore durante l'invio della segnalazione";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: CREATE_REPORT,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const fetchReports = (token, page = 0, size = 10) => {
  return (dispatch) => {
    return fetch(`${API_URL}/reports?page=${page}&size=${size}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            const errorMessage =
              errorData.message || "Errore nel caricamento delle segnalazioni";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: FETCH_REPORTS,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const deleteReport = (token, reportId) => {
  return (dispatch) => {
    return fetch(`${API_URL}/reports/${reportId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            const errorMessage =
              errorData.message ||
              "Errore durante l'eliminazione della segnalazione";
            throw new Error(errorMessage);
          });
        }
        dispatch({
          type: DELETE_REPORT,
          payload: reportId,
        });
        return { success: true };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};
