import axios from "axios";
import "../style/messages.css";
import Cookies from "js-cookie";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Message from "../components/Message";
import LeftBar from "../components/LeftBar";
import RightBar from "../components/RightBar";

const Messages = ({user,logIn,logOut,pages,setPages}) => {
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
        <div className="messagesComponent">
            <div className="left-bar">
                <LeftBar user={user} setPages={setPages} logOut={logOut}/>
            </div>
            <div className="navbar-posts">
                <Navbar user={user} pages={pages}/>
                <Message user={user} pages={pages} setPages={setPages}/>
            </div>
            <div className="right-bar">
                <RightBar user={user} setPages={setPages}/>
            </div>
        </div>
    )
}

export default Messages;