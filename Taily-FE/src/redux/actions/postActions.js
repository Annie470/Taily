export const CREATE_POST = "CREATE_POST";
export const FETCH_USER_POSTS = "FETCH_USER_POSTS";
export const DELETE_POST = "DELETE_POST";
export const REMOVE_GUEST = "REMOVE_GUEST";
export const ADD_GUEST = "ADD_GUEST";
export const FETCH_FILTERED_POSTS = "FETCH_FILTERED_POSTS";
export const DELETE_POST_BY_ADMIN = "DELETE_POST_BY_ADMIN";
export const FIND_POST = "FIND_POST";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const createPost = (token, postData) => {
  return (dispatch) => {
    return fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            const errorMessage =
              errorData.errors && errorData.errors.length > 0
                ? errorData.errors.join(", ")
                : errorData.message || "Errore durante la creazione del post";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: CREATE_POST,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const fetchUserPosts = (token) => {
  return (dispatch) => {
    return fetch(`${API_URL}/posts`, {
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
              errorData.message || "Errore nel caricamento dei post";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: FETCH_USER_POSTS,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const deletePost = (token, postId) => {
  return (dispatch) => {
    return fetch(`${API_URL}/posts/${postId}`, {
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
              errorData.message || "Errore durante l'eliminazione del post";
            throw new Error(errorMessage);
          });
        }
        dispatch({
          type: DELETE_POST,
          payload: postId,
        });
        return { success: true };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const removeGuest = (token, postId) => {
  return (dispatch) => {
    return fetch(`${API_URL}/posts/${postId}/guests`, {
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
              "Errore durante la rimozione dalla lista partecipanti";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: REMOVE_GUEST,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const addGuest = (token, postId) => {
  return (dispatch) => {
    return fetch(`${API_URL}/posts/${postId}/guests`, {
      method: "POST",
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
              "Errore durante l'aggiunta alla lista partecipanti";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: ADD_GUEST,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const fetchFilteredPosts = (token, queryParams = {}) => {
  return (dispatch) => {
    let url = `${API_URL}/posts/search`;
    let hasParams = false;

    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key]) {
        url += `${hasParams ? "&" : "?"}${key}=${encodeURIComponent(
          queryParams[key]
        )}`;
        hasParams = true;
      }
    });

    return fetch(url, {
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
              errorData.message || "Errore nel caricamento dei post";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: FETCH_FILTERED_POSTS,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const deletePostByAdmin = (token, postId) => {
  return (dispatch) => {
    return fetch(`${API_URL}/posts/admin/${postId}`, {
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
              errorData.message || "Errore durante l'eliminazione del post";
            throw new Error(errorMessage);
          });
        }
        dispatch({
          type: DELETE_POST_BY_ADMIN,
          payload: postId,
        });
        return { success: true };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const findPostById = (token, postId) => {
  return (dispatch) => {
    return fetch(`${API_URL}/posts/${postId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`Errore ${res.errorMessage}`);
        }
      })
      .then((data) => {
        dispatch({
          type: FIND_POST,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};
