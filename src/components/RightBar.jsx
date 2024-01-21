import axios from "axios";
import moment from "moment";
import "../style/rightbar.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const socketClient = io.connect("http://localhost:8000");

const RightBar = ({user,setPages}) => {

    const navigate = useNavigate();

    const [notifies,setNotifies] = useState([])
    const [topTopics,setTopTopics] = useState([])

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
            let notif = await axios.post("http://localhost:8000/api/getNewNotif", {user_id: user._id})
            let reverse = notif.data.data.reverse();
            setNotifies(reverse)
        }
        async function getTop() {
            let top = await axios.post("http://localhost:8000/api/get_top_topic");
            let data = top.data.quests
            for (let i = 0; i < data.length; i++) {
               let count = 0
               for (let j = 0; j < data[i].answers.length; j++) {
                    count += data[i].answers[j].ans_count
                    data[i].answers[j].ans_count = count
               } 
            }
            setTopTopics(data);
        }
        getTop()
        getNotif()
    },[user])

    async function handleSowNotif (notif) {
        var array = notifies;
        const index = array.findIndex(object => {
            return object._id === notif._id;
        });
        array.splice(index, 1);
        setNotifies(array);
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

    function handleDetail (topic) {
        setPages("Detail Vote")
        navigate(`/detail_quest?quest_id=${topic._id}`,{
            state: [topic]
        })
    }

    return (
        <div className="rightbarComponent">
            <div className="top-topic">
                <div className="head-topic">
                    <strong>
                        Top Topiks
                    </strong>
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" class="bi bi-fire" viewBox="0 0 16 16">
                        <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/>
                    </svg>
                </div>
                <div className="list-topic">
                    {topTopics.map((topic) => (
                        <div className="topic">
                            <p>{topic.question}</p>
                            <div className="answer">
                                {topic.answers.map((ans) => (
                                    <small>{ans.answer}</small>
                                ))}
                            </div>
                            <small>{topic.answers[topic.answers.length - 1].ans_count} <span onClick={()=> handleDetail(topic)}>tanggapan</span></small>
                        </div>
                    ))}
                </div>
            </div>
            <div className="msg">
                <div className="head-msg">
                    <strong>Pemberitahuan Baru</strong>
                    <button className="con">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
                        </svg>
                        {notifies.length ? <label className="new"></label> : ""}
                    </button>
                </div>
                <div className="notif">
                    {notifies && notifies.map((notif) => (
                        <div className="isi-notif" onClick={()=> handleSowNotif(notif)}  key={notif._id}>
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
                            <div className="isi">
                                <b><p>{notif.message}</p></b>
                                <small>
                                    {moment(new Date(notif.created_at).getTime()).fromNow()}
                                </small>
                            </div>
                            <label className="new"></label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RightBar;