import './assets/style/style.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginChoice from './components/LoginChoice';
import Register from './components/Register';
import Login from './components/Login';
import Conditions from './components/Conditions';
import HomeContainer from './components/HomeContainer';
import PageNotFound from './components/PageNotFound';

function App() {
  return (
    <>
      <BrowserRouter>
     
            <Routes>
              <Route path="/" element={<LoginChoice/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/conditions" element={<Conditions/>} />
              <Route path="/*" element={<HomeContainer/>} />
               <Route path="/404" element={<PageNotFound/>} />
              <Route path="*" element={<PageNotFound/>} />
            </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;