import { useState } from "react";
import { Card, Modal, Button } from "react-bootstrap";
import { GeoAltFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ChatModal from "./ChatModal";
import { ChatDotsFill } from 'react-bootstrap-icons';


const CardPost = ({ post }) => {
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const navigate = useNavigate();

  const subGuests = (post) => {
    setSelectedPost(post);
    setShowGuestsModal(true);
  };
  const closeGuests = () => {
    setShowGuestsModal(false);
    setSelectedPost(null);
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
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <img
              src={post.author.avatar}
              alt={`avatar`}
              className="rounded-circle me-2 "
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/profile/${post.author.username}`)}
            />
            <div>
              <Card.Title
                className="mb-1 text-orange fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/profile/${post.author.username}`)}>
                {post.author.dogName}
              </Card.Title>
              <Card.Subtitle
                className="text-muted"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/profile/${post.author.username}`)}>
                @{post.author.username}
              </Card.Subtitle>
            </div>
   <Button 
  className="ms-auto rounded-5 d-flex align-items-center bg-orange-btn"
  size="sm"
  onClick={() => setShowChat(true)}
>
   Chat<ChatDotsFill size={16} className="ms-2" /> 
</Button>

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
       
        </Card.Body>
      </Card>

      <Modal show={showGuestsModal} onHide={closeGuests} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-orange">Partecipanti</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dott">
          {selectedPost?.guests && selectedPost.guests.length > 0 ? (
            <div>
              {selectedPost.guests.map((guest) => (
                <div
                  key={guest.id}
                  className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <img
                    src={guest.avatar}
                    alt={`avatar`}
                    className="rounded-circle me-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
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

      <ChatModal 
  show={showChat}
  onHide={() => setShowChat(false)}
  postId={post.id}
  token={token}
/>
    </>
  );
};
export default CardPost;
