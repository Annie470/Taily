import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Modal, Button, Form} from "react-bootstrap";
import { PuffLoader } from "react-spinners";
import { GeoAltFill} from "react-bootstrap-icons";
import { addGuest, removeGuest } from "../redux/actions/postActions";
import pawFill from "../assets/img/svg/pratecipa-evento.svg";
import paw from "../assets/img/svg/pratecipa-evento-non-attivo.svg";
import flag from "../assets/img/svg/report.svg";
import { createReport } from "../redux/actions/reportActions";
import { useNavigate } from "react-router-dom";

const CardPostHome = ({ post, onUpdate }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { data: user } = useSelector((state) => state.profile);

  const navigate = useNavigate();

  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isUserGuest = post.guests?.find((guest) => guest.id === user?.id);
  const isAuthor = post.author?.id === user?.id;

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const [isReportLoading, setIsReportLoading] = useState(false);

  /*const profileState = useSelector((state) => state.profile);
console.log('profileState:', profileState);
console.log('profileState.user:', profileState.user);
console.log('profileState.data:', profileState.data); DEBUG */

  const subGuests = () => {
    setShowGuestsModal(true);
  };

  const closeGuests = () => {
    setShowGuestsModal(false);
  };

  const subAddGuest = () => {
    if (isLoading) return;
    setIsLoading(true);

    dispatch(addGuest(token, post.id))
      .then((result) => {
        if (result.success) {
          if (onUpdate) {
            onUpdate();
          }
        } else {
          alert(
            result.error || "Errore durante l'aggiunta alla partecipazione"
          );
        }
      })
      .catch((error) => {
        alert("Errore: " + error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const subRemoveGuest = () => {
    if (isLoading) return;
    setIsLoading(true);

    dispatch(removeGuest(token, post.id))
      .then((result) => {
        if (result.success) {
          if (onUpdate) {
            onUpdate();
          }
        } else {
          alert(
            result.error || "Errore durante la rimozione dalla partecipazione"
          );
        }
      })
      .catch((error) => {
        alert("Errore: " + error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const dataFormatter = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

   const openReportModal = () => {
    setShowReportModal(true);
    setReportText("");
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setReportText("");
  };

   const subReport = () => {
    if (!reportText.trim()) {
      alert("La motivazione è obbligatoria per effettuare la segnalazione!");
      return;
    }
    if (reportText.length > 500) {
      alert("Non superare i 500 caratteri");
      return;
    }
    setIsReportLoading(true);
    const reportData = {
      text: reportText,
      postId: post.id,
    };
    dispatch(createReport(token, reportData))
      .then((result) => {
        if (result.success) {
          closeReportModal();
        } else {
          alert(result.error || "Errore durante l'invio della segnalazione");
        }
      })
      .catch((error) => {
        alert("Errore: " + error.message);
      })
      .finally(() => {
        setIsReportLoading(false);
      });
  };

    const sizeFormatter = (size) => {
    const sizeMap = {
      SMALL: "Piccola",
      MEDIUM: "Media",
      LARGE: "Grande",
      SMALL_AND_MEDIUM: "Piccola e Media",
      MEDIUM_AND_LARGE: "Media e Grande"
    };
    return sizeMap[size];
  };

   const sexFormatter = (sex) => {
    const sexMap = {
      MALE: "Maschio",
      FEMALE: "Femmina"
    };
    return sexMap[sex];
  };

  const ageFormatter = (age) => {
    const ageMap = {
      JUNIOR: "Junior",
      ADULT: "Adulto",
      SENIOR: "Senior"
    };
    return ageMap[age];
  };

  return (
    <>
      <Card className="h-100 shadow-sm rounded-5">
        <Card.Body className="position-relative">
          <div className="d-flex align-items-center mb-3 position-relative">
            <img
              src={post.author.avatar}
              alt={`avatar`}
              className="rounded-circle me-2"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
               cursor: "pointer" }} 
               onClick={() => navigate(`/profile/${post.author.username}`)}
            />
            <div>
              <Card.Title className="mb-1 text-orange fw-bold"  style={{ cursor: "pointer" }} 
                onClick={() => navigate(`/profile/${post.author.username}`)}>
                {post.author.dogName}
              </Card.Title>
              <Card.Subtitle className="text-muted" style={{ cursor: "pointer" }} 
                onClick={() => navigate(`/profile/${post.author.username}`)} >
                @{post.author.username}
              </Card.Subtitle>
            </div>

            <div className="ms-auto pb-3">           
 {!isAuthor && (isLoading ? (
  <PuffLoader color="#eeae36ff" size={30} />
) : isUserGuest ? (
  <img
    src={paw}
    alt="icon event active"
    onClick={subRemoveGuest}
    className="icon-paw-active"
    style={{ cursor: isLoading ? "not-allowed" : "pointer", zIndex: 10 }}
  />
) : (
  <img
    src={pawFill}
    alt="icon event"
    onClick={subAddGuest}
    className="icon-paw"
    style={{ cursor: isLoading ? "not-allowed" : "pointer", zIndex: 10 }}
  />
))}
            </div>
          </div>

          <Card.Text className="border-top pt-2">
            <strong className="text-green">Data e ora:</strong>{" "}
            {dataFormatter(post.date)}
          </Card.Text>

          <Card.Text className="d-flex align-items-center">
            <GeoAltFill size={20} className="text-green me-1" />
            {post.street}, {post.district.denominazioneIta},{" "}
            {post.district.provincia.siglaProvincia}
          </Card.Text>

         {post.allowedSize && (
            <Card.Text>
              <strong className="text-green">Taglia ammessa:</strong>{" "}
              {sizeFormatter(post.allowedSize)}
            </Card.Text>
          )}
          {post.allowedSex && (
            <Card.Text>
              <strong className="text-green">Sesso ammesso:</strong>{" "}
              {sexFormatter(post.allowedSex)}
            </Card.Text>
          )}
          {post.allowedAge && (
            <Card.Text>
              <strong className="text-green">Età ammessa:</strong>{" "}
              {ageFormatter(post.allowedAge)}
            </Card.Text>
          )}

          {post.note && (
            <Card.Text>
              <strong className="text-green">Note:</strong> {post.note}
            </Card.Text>
          )}
          <Card.Text>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                subGuests(post);
              }}
              className="text-decoration-none text-orange">
              Lista partecipanti ({post.guests?.length || 0})
            </a>
          </Card.Text>  
            <img
    src={flag}
    alt="icon event"
    onClick={openReportModal}
    className="icon-flag"
  /> 
        </Card.Body>
      </Card>

      <Modal show={showGuestsModal} onHide={closeGuests} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-orange">Partecipanti</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dott">
          {post.guests && post.guests.length > 0 ? (
            <div>
              {post.guests.map((guest) => (
                <div
                  key={guest.id}
                  className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <img
                    src={guest.avatar}
                    alt={`Avatar di ${guest.dogName}`}
                    className="rounded-circle me-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                     cursor: "pointer" }} 
                onClick={() => navigate(`/profile/${guest.username}`)}
                  />
                  <div>
                    <p className="mb-0 fw-bold">{guest.dogName}</p>
                    <p className="mb-0 text-muted">@{guest.username}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">
              Nessun partecipante al momento...
            </p>
          )}
        </Modal.Body>
      </Modal>

       <Modal show={showReportModal} onHide={closeReportModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-orange fw-bold">Segnala Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dott">
          <Form>
            <Form.Group>
              <Form.Label className="text-green">Motivazione della segnalazione *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Descrivi il motivo o il bug riscontrato..."
                maxLength={500}
                className="input-register"
                disabled={isReportLoading}
              />
              <Form.Text className="text-muted">
                {reportText.length}/500 caratteri
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="dott py-3">
          <Button
            className="light-rounded-btn centered"
            onClick={subReport}
            disabled={isReportLoading || !reportText.trim()}
          >
            {isReportLoading ? (
              <>
                Invio...
              </>
            ) : (
              "Invia"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CardPostHome;
