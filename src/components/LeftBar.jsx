import axios from "axios";
import "../style/leftBar.css";
import { useEffect, useState } from "react";
import {Cridential} from "../../utils/dotenv";
import { useNavigate } from "react-router-dom";

const LeftBar = ({user,setPages,logOut}) => {
    
    const navigate = useNavigate()
    const [notifies,setNotifies] = useState([])
    let params = window.location.href.split('/');
    let active = params[params.length - 1]

    useEffect(() => {
        async function getNotif() {
            let notif = await axios.post(`${Cridential.BASE_URL}/api/getNewNotif`, {user_id: user._id})
            let reverse = notif.data.data.reverse();
            setNotifies(reverse)
        }
        getNotif()
    },[user])

    function handleAdd () {
        setPages("Buat Vote")
        navigate("/addQuestion")
    }
    function handleDashboard () {
        setPages("Dashboard")
        navigate("/dashboard")
    }
    function handleMessage () {
        setPages("Pesan")
        navigate("/messages")
    }
    function handleNotif () {
        setPages("Pemberitahuan")
        navigate("/notifies")
    }
    function handleSetting () {
        setPages("Pengaturan")
        navigate("/settings")
    }
    
    return (
        <div className="leftbarComponent">
            <div className="brend">
                <h1><a href="/dashboard">E-Voter</a></h1>
            </div>
            <div className="option">
                <div onClick={() => handleAdd()} className={active == "addQuestion" ? "active" : ""}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                    <p>Buat Vote</p>
                </div>
                <div onClick={() => handleDashboard()} className={active == "dashboard" ? "active" : ""}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-window-sidebar" viewBox="0 0 16 16">
                        <path d="M2.5 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1 .5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                        <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v2H1V3a1 1 0 0 1 1-1zM1 13V6h4v8H2a1 1 0 0 1-1-1m5 1V6h9v7a1 1 0 0 1-1 1z"/>
                    </svg>
                    <p>Dashboard</p>
                </div>
                <div onClick={() => handleMessage()} className={active == "messages" || active.includes("messages") ? "active" : ""}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-chat-dots" viewBox="0 0 16 16">
                        <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                        <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2"/>
                    </svg>
                    <p>Pesan</p>
                </div>
                <div onClick={() => handleNotif()} className={active == "notifies" || active.includes("notifies") ? "active" : ""}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
                    </svg>
                    <p>Pemberitahuan</p>
                    {notifies.length ? <label className="new"></label> : ""}
                </div>
                <div onClick={() => handleSetting()} className={active == "settings" ? "active" : ""}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-sliders2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
                    </svg>
                    <p>Pengaturan</p>
                </div>
            </div>
            <div className="logout">
                <small>
                    Terima kasih telah berkunjung ke situs Voter.com sampai jumpa lagi dan ingat berkunjung kembali !!!
                </small>
                <button onClick={() => logOut()}>
                    <p>out</p>
                </button>
            </div>
        </div>
    )
}

export default LeftBar;