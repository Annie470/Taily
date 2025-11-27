export const FETCH_PROFILE = "FETCH_PROFILE";
export const SET_USER_ID = "SET_USER_ID";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const UPDATE_PASSWORD = "UPDATE_PASSWORD";
export const UPLOAD_AVATAR = "UPLOAD_AVATAR";
export const DELETE_PROFILE = "DELETE_PROFILE";
export const FETCH_OTHER_PROFILE = "FETCH_OTHER_PROFILE";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const fetchProfile = (token) => {
  return (dispatch) => {
    return fetch(`${API_URL}/dogowners/me`, {
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
              errorData.message || "Errore nel caricamento del profilo";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: FETCH_PROFILE,
          payload: data,
        });
        if (data.id) {
          dispatch({
            type: SET_USER_ID,
            payload: data.id,
          });
        }
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const updateProfile = (token, profileData) => {
  return (dispatch) => {
    return fetch(`${API_URL}/dogowners/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            const errorMessage =
              errorData.errors && errorData.errors.length > 0
                ? errorData.errors.join(", ")
                : errorData.message ||
                  "Errore durante l'aggiornamento del profilo";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: UPDATE_PROFILE,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const updatePassword = (token, passwordData) => {
  return (dispatch) => {
    return fetch(`${API_URL}/dogowners/me/password`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            const errorMessage =
              errorData.errors && errorData.errors.length > 0
                ? errorData.errors.join(", ")
                : errorData.message ||
                  "Errore durante l'aggiornamento della password";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: UPDATE_PASSWORD,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const uploadAvatar = (token, userId, file) => {
  return (dispatch) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return fetch(`${API_URL}/dogowners/${userId}/upload`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            const errorMessage =
              errorData.message || "Errore durante l'upload della foto";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: UPLOAD_AVATAR,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const deleteProfile = (token) => {
  return (dispatch) => {
    return fetch(`${API_URL}/dogowners/me`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            const errorMessage =
              errorData.message || "Errore durante l'eliminazione";
            throw new Error(errorMessage);
          });
        }
        dispatch({
          type: DELETE_PROFILE,
        });
        localStorage.removeItem("token");
        return { success: true };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const fetchOtherProfile = (token, username) => {
  return (dispatch) => {
    return fetch(`${API_URL}/dogowners/username/${username}`, {
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
              errorData.message || "Errore nel caricamento del profilo";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: FETCH_OTHER_PROFILE,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};
