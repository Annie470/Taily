import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Conditions = () => {
  const navigate = useNavigate();

  const tornaIndietro = () => {
    navigate(-1);
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center align-items-center vh-100">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h2 className="text-tail">Termini e Condizioni</h2>
              <p className="text-muted">
                Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
              </p>

              <h5 className="text-dark mb-3">Condizioni di Utilizzo</h5>

              <h6 className="text-orange">Comportamento dell'Utente</h6>
              <p className="text-muted">
                L'utente si impegna a mantenere un comportamento non provocatorio e consono
                allo spirito della community di Taily. Si impegnerà a creare un ambiente
                rispettoso per tutti i membri.
              </p>

              <h6 className="text-orange">Linguaggio Appropriato</h6>
              <p className="text-muted">
                È severamente vietato utilizzare un linguaggio inappropriato,
                offensivo o discriminatorio. 
              </p>

              <h6 className="text-orange">Requisiti di Età</h6>
              <p className="text-muted">
                Per utilizzare l'applicazione è necessario essere maggiorenni.
                L'accesso è consentito solo a utenti che abbiano compiuto i 18
                anni di età.
              </p>

               <h6 className="text-orange">Privacy e Dati</h6>
              <p className="text-muted">
                I dati di registrazione non verranno mai utilizzati per fini
                commerciali. La tua privacy è importante per noi e i tuoi dati
                personali sono protetti.
              </p>

              <h6 className="alert-heading text-dark">⚠️ Importante</h6>
              <p className="mb-0 text-muted small">
                La violazione di questi termini potrebbe comportare la
                sospensione o la cancellazione del proprio account.
              </p>

              <Button
                onClick={tornaIndietro}
                className="green-rounded-btn mt-5 centered">
                Torna Indietro
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Conditions;
