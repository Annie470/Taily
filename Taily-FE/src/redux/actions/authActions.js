export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const registerUser = (userData) => {
  return () => {
    return fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            console.log(errorData);
            //debug
            const errorMessage =
              errorData.errors && errorData.errors.length > 0
                ? errorData.errors.join(", ")
                : errorData.message || "Errore durante la registrazione";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then(() => {
        return { success: true };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const loginUser = (credentials) => {
  return (dispatch) => {
    return fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            console.log(errorData);
            const errorMessage =
              errorData.errors && errorData.errors.length > 0
                ? errorData.errors.join(", ")
                : errorData.message || "Email o password errati";
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: LOGIN,
          payload: {
            token: data.accessToken,
            role: data.role,
          },
        });
        return { success: true };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const logout = () => ({
  type: LOGOUT,
});
