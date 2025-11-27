import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Nav,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchFollowing,
  fetchFollowers,
  unfollowUser,
  fetchStats,
} from "../redux/actions/friendsActions";
import pattern from "../assets/img/svg/pattern.svg";
import { PersonDash } from "react-bootstrap-icons";
import { PuffLoader } from "react-spinners";

const Following = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { following, followers, stats } = useSelector((state) => state.profile);
  const [isLoading, setIsLoading] = useState(true);
  const [removingUser, setRemovingUser] = useState(null);
  const [activeTab, setActiveTab] = useState("following");

  useEffect(() => {
    if (token) {
      Promise.all([
        dispatch(fetchFollowing(token)),
        dispatch(fetchFollowers(token)),
        dispatch(fetchStats(token)),
      ]).then(() => {
        setIsLoading(false);
      });
    }
  }, [dispatch, token]);

  const subUnfollow = (userId) => {
      setRemovingUser(userId);
      dispatch(unfollowUser(token, userId)).then((result) => {
        setRemovingUser(null);
        if (result.success) {
          dispatch(fetchFollowing(token));
          dispatch(fetchStats(token));
        } else {
          alert(result.error || "Errore durante l'unfollow");
        }
      });
    
  };

  const friendCard = (user, showUnfollow = false) => (
    <Col key={user.id} xs={12} md={6} lg={4}>
      <Card className="h-100 shadow-sm rounded-5 border-0">
        <Card.Body className="d-flex flex-column">
          <div className="d-flex align-items-center mb-3">
            <img
              src={user.avatar}
              alt={`avatar`}
              className="rounded-circle me-2 "
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/profile/${user.username}`)}
            />
            <div>
              <Card.Title
                className="mb-1 text-orange fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/profile/${user.username}`)}>
                {user.dogName}
              </Card.Title>
              <Card.Subtitle
                className="text-muted"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/profile/${user.username}`)}>
                @{user.username}
              </Card.Subtitle>
            </div>
          </div>
          <Card.Text>
            <strong className="text-green">Taglia:</strong>{" "}
            {user.size.toLowerCase()}
          </Card.Text>
          <Card.Text>
            <strong className="text-green">Sex:</strong>{" "}
            {user.sex.toLowerCase()}
          </Card.Text>

          <Card.Text>
            <strong className="text-green">Età:</strong>{" "}
            {user.age.toLowerCase()}
          </Card.Text>

          {user.bio && (
            <p className="text-muted small mb-3 flex-grow-1">
              {user.bio.length > 80
                ? user.bio.substring(0, 80) + "..."
                : user.bio}
            </p>
          )}

          {showUnfollow && (
            <Button
              onClick={() => subUnfollow(user.id)}
              disabled={removingUser === user.id}
              className="centered light-rounded-btn">
              {removingUser === user.id ? (
                <PuffLoader color="#eeae36ff" size={30} />
              ) : (
                <>
                  <PersonDash />
                  Unfollow
                </>
              )}
            </Button>
          )}
        </Card.Body>
      </Card>
    </Col>
  );

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
         <PuffLoader color="#eeae36ff" size={30} />
      </Container>
    );
  }

  const myStats = stats.me || { following: 0, followers: 0 };
  const sectionCurr = activeTab === "following" ? following : followers;

  return (
    <Container
      fluid
      className="p-0 d-flex flex-column align-items-center pb-5 bg-orange min-vh-100"
      style={{
        backgroundImage: `url(${pattern})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}>
      <Row className="w-100 d-flex justify-content-center p-3">
        <Col xs={12} lg={10}>
          <div className="bg-white rounded-5 p-3 shadow-sm mb-4">
            <p className="text-green fw-bold mb-3 text-center fs-2">
              Amici di Zampa
            </p>
            <div className="d-flex justify-content-center gap-4">
              <div className="text-center">
                <h3 className="text-green mb-0">{myStats.following}</h3>
                <small className="text-muted">Seguiti</small>
              </div>
              <div className="text-center">
                <h3 className="text-green mb-0">{myStats.followers}</h3>
                <small className="text-muted">Follower</small>
              </div>
            </div>
          </div>
<hr className="dott"/>
          <Nav
            variant="tabs"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4 bg-white rounded-5 p-2 shadow-sm">
            <Nav.Item className="flex-grow-1">
              <Nav.Link
                eventKey="following"
                className="text-center rounded-5 text-orange-2">
                Seguiti{" "}
                <Badge pill>
                  {following.length}
                </Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="flex-grow-1">
              <Nav.Link
                eventKey="followers"
                className="text-center rounded-5 text-orange-2">
                Follower{" "}
                <Badge pill>
                  {followers.length}
                </Badge>
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {sectionCurr.length === 0 ? (
            <Card className="text-center p-5 bg-white rounded-5">
              <Card.Body>
                <p className="text-muted fs-5">
                  {activeTab === "following"
                    ? "Non stai ancora seguendo nessuno."
                    : "Nessuno ti sta seguendo ancora."}
                </p>
                <p className="text-muted">
                  {activeTab === "following"
                    ? "Esplora i profili e segui altri utenti!"
                    : "Condividi il tuo profilo per ottenere follower!"}
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-4">
              {sectionCurr.map((user) =>
                friendCard(user, activeTab === "following")
              )}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Following;