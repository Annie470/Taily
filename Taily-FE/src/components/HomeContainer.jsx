import NavbarT from "./NavbarT"
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import {  Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import Admin from "./Admin";
import Search from "./Search";
import CreatePost from "./CreatePost";
import Report from "./Report";
import OtherProfile from "./OtherProfile";
import Friends from "./Friends";
import PageNotFound from "./PageNotFound";

const HomeContainer =()=> {
     const { role } = useSelector((state) => state.auth);
    

return(
    <>
  <NavbarT userRole={role}/>
<Container fluid className="p-0 vh-100">
        <Routes>
          <Route path="/home" element={<Search />} />
          <Route path="/profile/me" element={<Profile />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/admin" element={ <Admin /> } />
          <Route path="/report" element={ <Report /> } />
          <Route path="/profile/:username" element={ <OtherProfile /> } />
          <Route path="/friends" element={ <Friends/> } />
           <Route path="*" element={<PageNotFound/>} />

        </Routes>
      </Container>
    
    </>
)
}
export default HomeContainer