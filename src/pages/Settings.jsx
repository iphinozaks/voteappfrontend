import axios from "axios";
import "../style/settings.css";
import Cookies from "js-cookie";
import { useEffect } from "react"; 
import Navbar from "../components/Navbar";
import Setting from "../components/setting";
import LeftBar from "../components/LeftBar";
import RightBar from "../components/RightBar";

const Settings = ({user,logIn,logOut,pages,setPages}) => {
    const token = Cookies.get("auth_token")
    useEffect(() => {
        axios.post("http://localhost:8000/api/user_auth_token",{auth_token: token})
        .then((user) => {
            logIn(user.data.data)
        })
        .catch(() => {
            logIn(null)
        })
    },[])
    return (
        <div className="settingsComponent">
            <div className="left-bar">
                <LeftBar user={user} setPages={setPages} logOut={logOut}/>
            </div>
            <div className="navbar-posts">
                <Navbar user={user} pages={pages}/>
                <Setting />
            </div>
            <div className="right-bar">
                <RightBar user={user} setPages={setPages}/>
            </div>
        </div>
    )
}

export default Settings;