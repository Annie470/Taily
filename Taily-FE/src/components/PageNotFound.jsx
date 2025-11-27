import { Container, Row, Col } from "react-bootstrap";
import p4 from "../assets/img/404.png";

const PageNotFound = () => {
  return (
    <Container
      fluid
      className="d-flex  min-vh-100 justify-content-center bg-orange">
      <Row className="justify-content-center w-100 position-relative ">
        <Col xs={10} md={8} className="text-center mt-5 bg-white rounded-5 ">    
              <h1 className="display-1 fw-bold mb-3 text-orange">404</h1>
              <h2 className="h3 pb-5 text-green dott-b">Pagina non trovata...</h2>
        </Col>
        <Col xs={10} md={8} lg={3} className="position-fixed bottom-0">
        <img src={p4} alt="dog" className="w-100"/>
        </Col>
      </Row>
    </Container>
  );
};

export default PageNotFound;
