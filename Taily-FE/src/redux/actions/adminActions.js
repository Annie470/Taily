export const REGISTER_CHAIRMAN = "REGISTER_CHAIRMAN";
export const SEARCH_USER = "SEARCH_USER";
export const DELETE_USER = "DELETE_USER";
export const DELETE_EXPIRED_POSTS = "DELETE_EXPIRED_POSTS";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const registerChairman = (token, chairmanData) => {
  return (dispatch) => {
    return fetch(`${API_URL}/usermaintenance/admin/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chairmanData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            const errorMessage =
              errorData.errors && errorData.errors.length > 0
                ? errorData.errors.join(", ")
                : errorData.message || "Errore durante la registrazione";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: REGISTER_CHAIRMAN,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const searchUserByEmail = (token, email) => {
  return (dispatch) => {
    return fetch(`${API_URL}/logable/search/${email}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            const errorMessage =
              errorData.message || "User o Chairman non trovato";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: SEARCH_USER,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const deleteUser = (token, id) => {
  return (dispatch) => {
    return fetch(`${API_URL}/logable/${id}`, {
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
          type: DELETE_USER,
        });
        return { success: true };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const deleteExpiredPosts = (token) => {
  return (dispatch) => {
    return fetch(`${API_URL}/posts/cleanup`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            const errorMessage =
              errorData.message ||
              "Errore durante l'eliminazione dei post scaduti";
            throw new Error(errorMessage);
          });
        }
        dispatch({
          type: DELETE_EXPIRED_POSTS,
        });
        return { success: true };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};
