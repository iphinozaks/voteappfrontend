import axios from "axios";
import "../style/dashboard.css";
import Cookies from "js-cookie";
import Alert from "../components/Alert";
import Posts from "../components/Posts";
import Navbar from "../components/Navbar";
import { useEffect, useState} from "react";
import LeftBar from "../components/LeftBar";
import RightBar from "../components/RightBar";
import { useLocation } from "react-router-dom";

const Dashboard = ({user,logIn,logOut,pages,setPages,userCount}) => {
    const {state}  = useLocation();
    const [alert,setAlert] = useState(false)
    const token = Cookies.get("auth_token")
    useEffect(() => {
        if (state) {
            setAlert(true)
        }
        axios.post("http://localhost:8000/api/user_auth_token",{auth_token: token})
        .then((user) => {
            logIn(user.data.data)
        })
        .catch(() => {
            logIn(null)
        })
    },[])
    return (
        <div className="dashboardComponent">
            {alert && <Alert status={state.status} mssg={state.mssg} setAlert={setAlert}/>}
            <div className="left-bar">
                <LeftBar user={user} setPages={setPages} logOut={logOut}/>
            </div>
            <div className="navbar-posts">
                <Navbar user={user} pages={pages}/>
                <Posts user={user} setPages={setPages} userCount={userCount}/>
            </div>
            <div className="right-bar">
                <RightBar user={user} setPages={setPages}/>
            </div>
        </div>
    )
}

export default Dashboard;