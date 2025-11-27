import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Alert,
  Form,
  Button,
} from "react-bootstrap";
import { PuffLoader } from "react-spinners";
import CardPostHome from "./CardPostHome";
import { fetchFilteredPosts } from "../redux/actions/postActions";
import { fetchProvince } from "../redux/actions/locationActions";
import pin from "../assets/img/LogoPin.png";
import pattern from "../assets/img/svg/pattern.svg";
import { Calendar } from 'react-bootstrap-icons';

const Search = () => {
  const dispatch = useDispatch();
  const city = useSelector((state) => state.location.city);
  const lat = useSelector((state) => state.location.lat);
  const lon = useSelector((state) => state.location.lon);
  const { token } = useSelector((state) => state.auth);
  const { province } = useSelector((state) => state.location);
  const { filteredPosts } = useSelector((state) => state.post);
  const [filters, setFilters] = useState({
    provincia: "",
    dateFrom: "",
    allowedSex: "",
    allowedSize: "",
    allowedAge: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchProvince(token));
    }
  }, [token, dispatch]);

 useEffect(() => {
    if (token && city && province.length > 0) {
      const provinceSigla = findProvinceByCity(city, province);
      
      if (provinceSigla) {
        setFilters(prev => ({
          ...prev,
          provincia: provinceSigla
        }));

        setLoading(true);
        dispatch(fetchFilteredPosts(token, { provincia: provinceSigla }))
          .then((result) => {
            if (!result.success) {
              setSearched(true);
            }
          })
          .catch((error) => {
            setError("Errore nel caricamento dei post...\n" + error.message);
          })
          .finally(() => {
            setLoading(false);
          });
    }}
  }, [token, city, province, dispatch]);



   const findProvinceByCity = (cityName, provinces) => {
    if (!cityName || !provinces.length) return null;
    const foundProvince = provinces.find(prov => 
      prov.denominazioneProvincia.toLowerCase().includes(cityName.toLowerCase()) ||
      cityName.toLowerCase().includes(prov.denominazioneProvincia.toLowerCase())
    );
    
    return foundProvince ? foundProvince.siglaProvincia : null;
  };

  const subSetFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const subSearch = () => {
    if (!token) return;

    setLoading(true);
    setSearched(true);
    const queryParams = {};
    if (filters.provincia) queryParams.provincia = filters.provincia;
    if (filters.dateFrom) queryParams.dateFrom = filters.dateFrom;
    if (filters.allowedSex) queryParams.allowedSex = filters.allowedSex;
    if (filters.allowedSize) queryParams.allowedSize = filters.allowedSize;
    if (filters.allowedAge) queryParams.allowedAge = filters.allowedAge;

    dispatch(fetchFilteredPosts(token, queryParams))
      .then((result) => {
        if (!result.success) {
          setSearched(true);
        }
      })
      .catch((error) => {
        setError("Errore nel caricamento dei post: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const postUpdate = () => {
    subSearch();
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Row className="d-flex justify-content-center">
          <Col xs={12}>
         <PuffLoader color="#eeae36ff" size={60} className="centered mt-5"/>
         </Col>
         <Col  xs={12}>
        <p className="mt-5 text-center text-green">Caricamento post...</p> 
          </Col>
        </Row>
       
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="w-100 d-flex justify-content-center  p-0 m-0">
        <Col
          xs={12}
          lg={3}
          className="d-flex justify-content-center align-items-center my-2">
          <img src={pin} alt="icon pin location" className="icon-pin" />
          <span className="text-green fw-bold align-self-end fs-4">
            {" "}
            {city || "Caricamento..."}
          </span>
        </Col>
      </Row>
      <Row className="w-100 d-flex justify-content-center p-0">
        <Col xs={12} className="text-center p-0">
                {lat && lon ? (
            <iframe
              className="rounded-5 ms-3"
              width="95%"
              height="350"
              src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${lat},${lon}+(My%20Business%20Name)&t=&z=15&ie=UTF8&iwloc=B&output=embed`}
              title="Google Maps"></iframe>
          ) : (
            <Alert variant="warning" className="m-3">
              Mappa non disponibile...
            </Alert>
          )}
        </Col>
      </Row>

      <Row className="mb-5 ">
        <Form className="d-flex justify-content-between flex-wrap mt-2">
          <Col xs={11} lg={2} className="m-2">
            <Form.Group className="mb-3">
              <Form.Select
                value={filters.provincia}
                onChange={(e) => {
                  subSetFilter("provincia", e.target.value);
                }}
                className="input-register-drop">
                <option value="">Seleziona una provincia</option>
                {province.map((prov) => (
                  <option key={prov.siglaProvincia} value={prov.siglaProvincia}>
                    {prov.denominazioneProvincia}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={11} lg={2} className="m-2">
            <Form.Group  className="position-relative">
              <Form.Control
                type="datetime-local"
                value={filters.dateFrom}
                onChange={(e) => subSetFilter("dateFrom", e.target.value)}
                className="input-register-drop"
              />
               {!filters.dateFrom && (
      <span className="placeholder-custom"><Calendar className="me-1" size={16} /></span>
    )}
            </Form.Group>
          </Col>
          <Col xs={11} lg={2} className="m-2">
            <Form.Group>
              <Form.Select
                value={filters.allowedSex}
                onChange={(e) => subSetFilter("allowedSex", e.target.value)}
                className="input-register-drop">
                <option value="">Qualsiasi sesso</option>
                <option value="MALE">Maschio</option>
                <option value="FEMALE">Femmina</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={11} lg={2} className="m-2">
            {" "}
            <Form.Group>
              <Form.Select
                value={filters.allowedSize}
                onChange={(e) => subSetFilter("allowedSize", e.target.value)}
                className="input-register-drop">
                <option value="">Qualsiasi taglia</option>
                <option value="SMALL">Piccola</option>
                <option value="MEDIUM">Media</option>
                <option value="LARGE">Grande</option>
                 <option value="SMALL_AND_MEDIUM">Piccola e Media</option>
      <option value="MEDIUM_AND_LARGE">Media e Grande</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={11} lg={2} className="m-2">
            <Form.Group>
              <Form.Select
                value={filters.allowedAge}
                onChange={(e) => subSetFilter("allowedAge", e.target.value)}
                className="input-register-drop">
                <option value="">Qualsiasi età</option>
                <option value="JUNIOR">Junior</option>
                <option value="ADULT">Adulto</option>
                <option value="SENIOR">Senior</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={11} className="m-2 text-center">
            <Button
              className="light-rounded-btn"
              onClick={subSearch}
              disabled={loading}>
              {loading ? "Ricerca..." : "Cerca Eventi"}
            </Button>
          </Col>
        </Form>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {searched && (!filteredPosts || filteredPosts.length === 0) ? (
        <Alert variant="danger">Nessun evento trovato.</Alert>
      ) : (
        <Row className="pb-5 gy-3 mb-5 justify-content-center rounded-5"
                    style={{
                      backgroundColor: "#e7e7e7ff",
                      backgroundImage: `url(${pattern})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}>
          {filteredPosts.map((post) => (
            <Col key={post.id}  xs={12} md={6} lg={3}>
              <CardPostHome post={post} onUpdate={postUpdate} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Search;
