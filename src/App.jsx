import axios from "axios";
import "../src/style/app.css";
import Adds from "./pages/Adds";
import Cookies from "js-cookie";
import Error from './pages/Error';
import Notifs from "./pages/Notifs";
import Account from "./pages/Account";
import Details from "./pages/Details";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import Dashboard from "./pages/Dasboard";
import { useEffect, useState } from "react";
import PrivateRoutes from "./utils/ProtectRoutes";
import ValidateRoutes from "./utils/ValidateRoutes";
import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom";

const App = () => {

  let params = window.location.href.split('/');
  let active = params[params.length - 1]

  const [user,setUser] = useState(null);
  const [userCount,setUserCount] = useState(0);
  const [pages,setPages] = useState("Dashboard");

  function logIn (user) {
    setUser(user)
  }

  useEffect(() => {
    async function getCount () {
      let count = await axios.post("http://localhost:8000/api/get_user_count")
      setUserCount(count.data.count);
    }
    if(active == "addQuestion") setPages("Buat Vote")
    if(active == "dashboard") setPages("Dashboard")
    if(active == "messages") setPages("Messages")
    if(active == "notifies") setPages("Pemberitahuan")
    if(active == "settings") setPages("Pengaturan")
    if(active.includes("notifies"))setPages("Pemberitahuan")
    if(active.includes("detail_quest"))setPages("Detail Vote")
    getCount()
  },[params])

  const logOut = async () => {
      let token = Cookies.get("auth_token")
      if (token) {
        let logout = await axios.post("http://localhost:8000/api/logout",{token: token});
        if (logout.data.code == 200 && logout.data.status == "OK") {
          setPages("")
          setUser(null)
          Cookies.remove("auth_token")
          return <Navigate to="/" />
        }else {
          setPages("")
          setUser(null)
          Cookies.remove("auth_token")
          return <Navigate to="/" />
        }
      }else {
        setPages("")
        setUser(null)
        Cookies.remove("auth_token")
        return <Navigate to="/" />
      }
  };

  return (
    <Router> 
        <Routes>
            <Route path='/' element={ 
              <ValidateRoutes>
                  <Account logIn={logIn}/>
              </ValidateRoutes>
             } />
            <Route path="/dashboard" element={
              <PrivateRoutes>
                <Dashboard user={user} logIn={logIn} userCount={userCount} logOut={logOut} pages={pages} setPages={setPages}/>
              </PrivateRoutes>
            }/>
            <Route path="/detail_quest" element={
              <PrivateRoutes>
                <Details user={user} logIn={logIn} userCount={userCount} logOut={logOut} pages={pages} setPages={setPages}/>
              </PrivateRoutes>
            }/>
            <Route path="/addQuestion" element={
              <PrivateRoutes>
                <Adds user={user} logIn={logIn} logOut={logOut} pages={pages} setPages={setPages}/>
              </PrivateRoutes>
            }/>
            <Route path="/messages" element={
              <PrivateRoutes>
                <Messages user={user} logIn={logIn} logOut={logOut} pages={pages} setPages={setPages}/>
              </PrivateRoutes>
            }/>
            <Route path="/settings" element={
              <PrivateRoutes>
                <Settings user={user} logIn={logIn} logOut={logOut} pages={pages} setPages={setPages}/>
              </PrivateRoutes>
            }/>
            <Route path="/notifies" element={
              <PrivateRoutes>
                <Notifs user={user} logIn={logIn} logOut={logOut} pages={pages} setPages={setPages}/>
              </PrivateRoutes>
            }/>
            <Route path='*' element={ <Error /> }/>
        </Routes>
    </Router>
  )
}

export default App
