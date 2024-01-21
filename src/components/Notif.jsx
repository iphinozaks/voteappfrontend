import axios from "axios";
import moment from "moment";
import "../style/notif.css";
import io from "socket.io-client";
import Option from "../components/Option";
import { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";

const Notif = ({user,setPages}) => {

    const {state}  = useLocation();
    const navigate = useNavigate();
    const [all,setAll] = useState(true);
    const [del,setDelete] = useState([]);
    const [show,setShow] = useState(false);
    const [hide,setHide] = useState(false);
    const [notif,setNotif] = useState([]);
    const [notifies,setNotifies] = useState([]);
    const [isOption,setIsOption] = useState(false)
    const [filters,setDataFilters] = useState(false);
    
    const socketClient = io.connect("http://localhost:8000");

    useEffect(() => {
        socketClient.on("pushNotif", (data) => {
            if (data && data.to == user._id) { 
                if (notifies.length) {
                    let array = []
                    array.push(data)
                    let baru = array.concat(notifies)
                    setNotifies(baru)
                }else {
                    setNotifies(data)
                }   
            }else {
                data = undefined;
            }
        })
    },[socketClient])

    useEffect(() => {
        async function getNotif() {
            let notif = await axios.post("http://localhost:8000/api/getNotif", {user_id: user._id})
            let reverse = notif.data.data.reverse();
            setNotifies(reverse);
        }
        getNotif()
    },[user])

    useEffect(() => {
        async function update () {
            let update = await axios.post("http://localhost:8000/api/update_notif",{data: state})
            if (update.data.code == 200 && update.data.status == "OK") {
                let notifi = []
                notifies.map((notif) => {
                    if (notif._id !== update.data.data._id) {
                        notifi.push(notif)
                    }else {
                        notifi.push(update.data.data)
                    }
                })
                setNotifies(notifi)
            }
        }
        update();
    },[state])

    async function handleSowNotif (notif) {
        setPages("Pemberitahuan");
        if (notif.context == "response") {
            let data = await axios.post("http://localhost:8000/api/get_quest_by_id",{id: notif.quest_id})
            navigate(`/notifies?notif_id=${notif._id}`,{
                state: {
                    notif: notif,
                    quest: data.data.quest[0]
                }
            })
        }else {
            navigate(`/notifies?notif_id=${notif._id}`,{
                state: {
                    notif: notif
                }
            })
        }
    }

    function setFilters (data) {
        if (data == "all") {
            setAll(true)
            setShow(false)
            setHide(false)
            setDataFilters(false);
        }else if(data == "show") {
            setShow(true)
            setAll(false)
            setHide(false)
            let data = []
            notifies.map((notif) => {
                if (notif.status == true) {
                    data.push(notif)
                }
            })
            setDataFilters(data)
        }else if(data == "hide") {
            setHide(true)
            setAll(false)
            setShow(false)
            let data = []
            notifies.map((notif) => {
                if (notif.status == false) {
                    data.push(notif)
                }
            })
            setDataFilters(data)
        }else {
            let allNotifies = notifies;
            let notifi = []
            if (data.target.value == "all") {
                setDataFilters(false);
            }else {
                allNotifies.map((notif) => {
                    if (data.target.value == "to day") {
                        if(moment(new Date(notif.created_at).getTime()).fromNow().indexOf("hours ago") > 0 ||
                           moment(new Date(notif.created_at).getTime()).fromNow().indexOf("few seconds") > 0 ||
                           moment(new Date(notif.created_at).getTime()).fromNow().indexOf("minutes ago") > 0){
                            notifi.push(notif)
                        }
                    }if (data.target.value == "a day ago") {
                        if(moment(new Date(notif.created_at).getTime()).fromNow().split(" ")[0] < 7 && moment(new Date(notif.created_at).getTime()).fromNow().indexOf("days ago") > 0){
                            notifi.push(notif)
                        }
                    }else if (data.target.value == "a week ago") {
                        if (moment(new Date(notif.created_at).getTime()).fromNow().split(" ")[0] == 7 && moment(new Date(notif.created_at).getTime()).fromNow().indexOf("days ago") > 0) {
                            notifi.push(notif)
                        }
                    }else if(data.target.value == "a month ago") {
                        if (moment(new Date(notif.created_at).getTime()).fromNow() == "a month ago") {
                            notifi.push(notif)
                        }
                    }else if (data.target.value == "2 month ago") {
                        if (moment(new Date(notif.created_at).getTime()).fromNow() == "2 months ago") {
                            notifi.push(notif)
                        }
                    }else if (data.target.value == "4 month ago") {
                        if (moment(new Date(notif.created_at).getTime()).fromNow() == "4 months ago") {
                            notifi.push(notif)
                        }
                    }
                })
                setDataFilters(notifi)
            }
        }
    }

    function changeDelete (e) {
        if (e.target.checked) {
            setDelete((prev) => [...prev,e.target.value]);
        }else {
            var array = del;
            var index = array.indexOf(e.target.value);
            array.splice(index, 1);
            setDelete(array);
        }
    }

    async function handleDelete () {
        if (del.length > 0) {
            let update = await axios.post("http://localhost:8000/api/delete_notif",{data: del})
            if (update.data.code == 200 && update.data.status == "OK") {
                del.map((d) => {
                    var array = notifies;
                    var index = array.indexOf(d);
                    array.splice(index, 1);
                    setDelete(array);
                    setDelete(false);
                })
                navigate("/notifies")
            }
        }
    }

    function handleIsOption (notif) {
        if (isOption) {
            setIsOption(false)
        }else {
            setIsOption(notif._id)
        }
       setNotif(notif)
    }

    return (
        <div className="notifComponent">
            {state &&
                <div className="detail">
                    <div className="isi-notif">
                        {state.notif.context == "response" ?
                                    <svg xmlns="http://www.w3.org/2000/svg" width="55" height="65" fill="currentColor" className="bi bi-person-check" viewBox="0 0 16 16">
                                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                        <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                                    </svg>
                                :   
                                    <svg xmlns="http://www.w3.org/2000/svg" width="55" height="65" fill="currentColor" class="bi bi-chat-dots" viewBox="0 0 16 16">
                                        <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                                        <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2"/>
                                    </svg>
                        }
                        <div className="isi">
                            <div>
                                <b><p>{state.notif.message}</p></b>
                                <small>{moment(new Date(state.notif.created_at).getTime()).fromNow()}</small>
                            </div>
                            <strong className="arrow" onClick={()=> handleIsOption(state.notif)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                </svg>
                            </strong>
                            {isOption == state.notif._id && 
                                <Option notif={notif} setPages={setPages}/>
                            }
                            <div>
                                {state.notif.context == "response" ?
                                    <>
                                        <p>pertanyaan anda: <b>{state.quest.question}</b></p>
                                        <p>jawaban {state.notif.username} : <b>{state.notif.answer}</b></p>
                                    </>
                                :
                                    <>
                                        <p>dari: <b>{state.notif.message.split(" ")[0]}</b></p>
                                        <p>pesan: <b>{state.notif.answer}</b></p>
                                    </>
                                }
                                {state.notif.comment &&
                                    <p>alasannya: <b>{state.notif.comment}</b></p>
                                }
                            </div>
                        </div>
                    </div>  
                </div>
            }
            <div className="filter">
                <div>
                    <label for="cars">Filter: </label>
                    <select id="cars" onChange={(e)=> setFilters(e)}>
                    <option value="all">semua</option>
                    <option value="to day">hari ini</option>
                    <option value="a day ago">beberapa hari lalu</option>
                    <option value="a week ago">1 minggu ini</option>
                    <option value="a month ago">1 bulan lalu</option>
                    <option value="2 month ago">2 bulan lalu</option>
                    <option value="4 month ago">4 bulan lalu</option>
                    </select> 
                </div>
                <div>
                    <input type="checkbox" name="all" id="all" onChange={(e) => setFilters("all")} checked={all && !show && !hide ? true : false}/>
                    <label htmlFor="all">semua</label>
                </div>
                <div>
                    <input type="checkbox" name="dilihat" id="dilihat" onChange={(e) => setFilters("show")} checked={!all && show && !hide ? true : false}/>
                    <label htmlFor="dilihat">sudah dibuka</label>
                </div>
                <div>
                    <input type="checkbox" name="belum" id="belum" onChange={(e) => setFilters("hide")} checked={!all && !show && hide ? true : false}/>
                    <label htmlFor="belum">belum dibuka</label>
                </div>
                {del.length ?
                    <div>
                        <button onClick={()=> handleDelete()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </button>
                    </div>
                    : ""
                }
            </div>
            <div className="notif-contain">
            {notifies && !filters && notifies.map((notif) => (
                <div className="isi-notif">
                    <input type="checkbox" name={notif.context} id={notif._id} value={notif._id} onChange={(e)=> changeDelete(e)}/>
                    {notif.context == "response" ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="55" height="65" fill="currentColor" className="bi bi-person-check" viewBox="0 0 16 16">
                                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                    <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                                </svg>
                            :   
                                <svg xmlns="http://www.w3.org/2000/svg" width="55" height="65" fill="currentColor" class="bi bi-chat-dots" viewBox="0 0 16 16">
                                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2"/>
                                </svg>
                            }   
                    <div className="isi" onClick={()=> handleSowNotif(notif)}>
                        <b><p>{notif.message}</p></b>
                        <small>
                            {moment(new Date(notif.created_at).getTime()).fromNow()}
                        </small>
                    </div>
                    {notif.status ? "" : <button className="new"></button>}
                </div>
            ))}
            {filters && filters.map((notif) => (
                <div className="isi-notif">
                    <input type="checkbox" name={notif.context} id={notif._id} value={notif._id} onChange={(e)=> changeDelete(e)}/>
                    {notif.context == "response" ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="55" height="65" fill="currentColor" className="bi bi-person-check" viewBox="0 0 16 16">
                                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                    <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                                </svg>
                            :   
                                <svg xmlns="http://www.w3.org/2000/svg" width="55" height="65" fill="currentColor" class="bi bi-chat-dots" viewBox="0 0 16 16">
                                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2"/>
                                </svg>
                    }   
                    <div className="isi" onClick={()=> handleSowNotif(notif)}>
                        <b><p>{notif.message}</p></b>
                        <small>
                            {moment(new Date(notif.created_at).getTime()).fromNow()}
                        </small>
                    </div>
                    {notif.status ? "" : <button className="new"></button>}
                </div>
            ))}
            </div>
        </div>
    )
}

export default Notif;