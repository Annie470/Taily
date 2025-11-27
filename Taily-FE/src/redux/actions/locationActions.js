export const SET_CITY = "SET_CITY";
export const FETCH_PROVINCE = "FETCH_PROVINCE";
export const FETCH_COMUNI = "FETCH_COMUNI";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
export const fetchLocationGeo = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = new Error("Geolocalizzazione non supportata dal browser");
        console.error(error);
        reject(error);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lon } = position.coords;
          console.log(`Coordinate: ${lat}, ${lon}`);
          daCoordACity(lat, lon)
            .then((cityName) => {
              dispatch({
                type: SET_CITY,
                payload: {
                  city: cityName,
                  lat: lat,
                  lon: lon,
                },
              });
              console.log({ city: cityName, lat, lon });
              resolve({
                success: true,
                city: cityName,
                lat: lat,
                lon: lon,
              });
            })
            .catch((error) => {
              console.error(error);
              reject(error);
            });
        },
        (error) => {
          console.error(error);
          let errorMessage = "Errore nella geolocalizzazione";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permesso di geolocalizzazione negato";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Posizione non disponibile";
              break;
            case error.TIMEOUT:
              errorMessage = "Timeout esaurito";
              break;
            default:
              errorMessage = "Errore default nella geolocalizzazione";
          }

          reject(new Error(errorMessage));
        },
        {
          timeout: 10000,
        }
      );
    });
  };
};

// per nome città
const daCoordACity = (lat, lon) => {
  return fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=it`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Errore nel recupero dati di geolocalizzazione");
      }
      return response.json();
    })
    .then((data) => {
      return data.city || data.locality || "Posizione sconosciuta";
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

// Fallback vecchia api
export const fetchLocationByIP = () => {
  return (dispatch) => {
    return fetch("https://api.ipify.org?format=json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nel recupero dell'IP");
        }
        return response.json();
      })
      .then((data) => {
        return fetch(`http://ip-api.com/json/${data.ip}`);
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nella geolocalizzazione utente");
        }
        return response.json();
      })
      .then((geoData) => {
        dispatch({
          type: SET_CITY,
          payload: {
            city: geoData.city,
            lat: geoData.lat,
            lon: geoData.lon,
          },
        });

        return {
          success: true,
          city: geoData.city,
          lat: geoData.lat,
          lon: geoData.lon,
        };
      })
      .catch((error) => {
        return { success: false, error: error.message };
      });
  };
};

export const fetchProvince = (token) => {
  return (dispatch) => {
    return fetch(`${API_URL}/location/province`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Errore nel caricamento delle province");
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: FETCH_PROVINCE,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};

export const fetchComuni = (token, siglaProvincia) => {
  return (dispatch) => {
    return fetch(
      `${API_URL}/location/comuni?siglaProvincia=${siglaProvincia}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Errore nel caricamento dei comuni");
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: FETCH_COMUNI,
          payload: data,
        });
        return { success: true, data };
      })
      .catch((err) => {
        return { success: false, error: err.message };
      });
  };
};
