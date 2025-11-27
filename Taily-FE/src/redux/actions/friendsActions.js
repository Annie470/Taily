export const FETCH_FOLLOWING = "FETCH_FOLLOWING";
export const FETCH_FOLLOWERS = "FETCH_FOLLOWERS";
export const FOLLOW_USER = "FOLLOW_USER";
export const UNFOLLOW_USER = "UNFOLLOW_USER";
export const CHECK_FOLLOWING = "CHECK_FOLLOWING";
export const FETCH_STATS = "FETCH_STATS";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const fetchFollowing = (token) => {
  return (dispatch) => {
    return fetch(`${API_URL}/friends/following`, {
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
              errorData.message ||
              "Errore nel caricamento degli utenti seguiti";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: FETCH_FOLLOWING,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const fetchFollowers = (token) => {
  return (dispatch) => {
    return fetch(`${API_URL}/friends/followers`, {
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
              errorData.message || "Errore nel caricamento dei follower";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: FETCH_FOLLOWERS,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const followUser = (token, userId) => {
  return (dispatch) => {
    return fetch(`${API_URL}/friends/${userId}`, {
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
              errorData.message || "Errore durante il follow";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: FOLLOW_USER,
          payload: userId,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const unfollowUser = (token, userId) => {
  return (dispatch) => {
    return fetch(`${API_URL}/friends/${userId}`, {
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
              errorData.message || "Errore durante l'unfollow";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: UNFOLLOW_USER,
          payload: userId,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const checkFollowing = (token, userId) => {
  return (dispatch) => {
    return fetch(`${API_URL}/friends/check/${userId}`, {
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
              errorData.message || "Errore nella verifica del follow";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: CHECK_FOLLOWING,
          payload: { userId, isFollowing: data.isFollowing },
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const fetchStats = (token, userId = null) => {
  const endpoint = userId
    ? `${API_URL}/friends/stats/${userId}`
    : `${API_URL}/friends/stats`;

  return (dispatch) => {
    return fetch(endpoint, {
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
              errorData.message || "Errore nel caricamento delle statistiche";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: FETCH_STATS,
          payload: { userId: userId || "me", stats: data },
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};
