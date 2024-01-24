import axios from "axios";
import moment from "moment";
import "../style/message.css";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import {Cridential} from "../../utils/dotenv";
import { useNavigate } from "react-router-dom";
import { Cridential } from "../../utils/dotenv";

const Message = ({user,setPages}) => {
    let key;
    const navigate = useNavigate();
    const [active,setActive] = useState(false)
    const [listChat,setListChat] = useState([]);
    const [inputVal,setInputVal] = useState("");
    const [filterChats,setFilterChat] = useState([])
    let params = window.location.href.split('=')[1];
    if (params) {
        key = params.split('%');
    }
    const pusher = new Pusher(Cridential.API_KEY, {
        cluster: Cridential.CLUSTER
    });
    
    const channel = pusher.subscribe('voteChat'); 

    useEffect(() => {
        channel.bind("pushChat",data => {
            let index = data.result[0].users.findIndex(object => {
                return object._id == user._id
            })
            if (data && data.result[0].users[index]._id == user._id) {
                let array = listChat
                const index = array.findIndex(object => {
                    return object.room_key == data.result[0].room_key;
                })
                array.splice(index, 1)
                array.push(data[0])
                array.reverse()
                setListChat(array)
                if (active) {
                    if (data.result[0].users[index]._id == user._id) {
                        setActive(false)
                        setActive(data[0])
                    }
                }
            }else {
                data = undefined
            }
        })
    },[channel])

    useEffect(() => {
        async function getChatList () {
            let data = await axios.post(`${Cridential.BASE_URL}/api/get_chat_list`,{id: user._id})
            if (data.data.code == 200 && data.data.status == "OK") {
                setListChat(data.data.data);
            }
        }
        getChatList();
    },[params,user])

    useEffect(() => {
        if (key) {
            async function add_room () {
                let  add = await axios.post(`${Cridential.BASE_URL}/api/add_chat_room`,{key: key})
                if(add.data.code == 200 && add.data.status == "OK"){
                    setActive(add.data.data[0])
                }
            }
            add_room();
        }else {
            setActive(false)
        }
        if (key) {
            let navbar = document.getElementsByClassName("navbarComponent")[0]
            let chat = document.getElementsByClassName("chat-active")[0]
            let daftarChat = document.getElementsByClassName("daftar-chat")[0]
            let width = document.getElementsByClassName("navbar-posts")[0].clientWidth
            if (width <= 769) {
                daftarChat.style.display = "none"
                chat.style.display = "inherit"
                navbar.style.display = "none"
            }
        }
    },[params])

    function handleActive (authorId) {
        let index = authorId.findIndex((prev) => prev._id !== user._id)
        setPages("Pesan");
        navigate(`/messages?room_key=${user._id + '%' + authorId[index]._id}`)
    }

    async function handleHideActve () {
        if (active.messages.length < 1) {
           let del = await axios.post(`${Cridential.BASE_URL}/api/delete_room`,{key: active.room_key})
           if (del.data.code == 200 && del.data.status == "OK") {
                let array = listChat
                const index = array.findIndex(object => {
                    return object.room_key == active.room_key;
                })
                array.splice(index, 1)
                setListChat(array)
                key = false
                setActive(false);
                navigate("/messages")
           }
        }else {
            let navbar = document.getElementsByClassName("navbarComponent")[0]
            let chat = document.getElementsByClassName("chat-active")[0]
            let daftarChat = document.getElementsByClassName("daftar-chat")[0]
            let width = document.getElementsByClassName("navbar-posts")[0].clientWidth
            if (width <= 769) {
               daftarChat.style.display = "inherit" 
               chat.style.display = "none"
               navbar.style.display = "inherit"
               key = false
               setActive(false)
               navigate("/messages")
            }else {
                key = false
                setActive(false)
                navigate("/messages")
            }
        }
    }

    const handleAddChat = async (toId) => {
        let index = toId.findIndex((prev) => prev._id !== user._id)
        let data = {
            to: toId[index]._id,
            toUser: toId[index].username,
            from: user._id,
            fromUser: user.username,
            text: inputVal,
            room_key: active.room_key,
            created_at: moment().format(),
            update_at: moment().format()
        }
        let addChat = await axios.post(`${Cridential.BASE_URL}/api/push_chat`,{data})
        if (addChat.data.code == 200 && addChat.data.status == "OK") {
            let array = listChat
            const index = array.findIndex(object => {
                return object.room_key == addChat.data.data[0].room_key;
            })
            array.splice(index, 1)
            array.push(addChat.data.data[0])
            array.reverse()
            setListChat(array)
            setInputVal("");
            setActive(addChat.data.data[0])
        }
    }

    function searchChats(e) {
        if (e.target.value) {
            listChat.map((chat) => {
                chat.users.map((use) => {
                    if(use.username.includes(e.target.value)){
                        setFilterChat([chat])
                    }
                })
            })
        }else {
            setFilterChat([])
        }
    }

    return (
        <div className="messageComponent">
            <div className="daftar-chat">
                <div className="head">
                    <input type="text" placeholder="cari pesan..." onChange={(e)=> searchChats(e)}/>
                    <strong>daftar pesan :</strong>
                </div>
                <div className="daftar">
                    {filterChats.map((list) => (
                        <div className="isi" onClick={()=> handleActive(list.users)}>
                            {list.users.map((use) => (
                                <>
                                    {use._id !== user._id &&
                                        <div className="head-user">
                                            <button>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="45" fill="currentColor" className="bi bi-person-check" viewBox="0 0 16 16">
                                                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                                    <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                                                </svg>
                                            </button>
                                            <div>
                                            <p>{ use.username }</p>
                                            <small>{list.messages.length ? list.messages[list.messages.length -1].text : "draf"}</small>
                                            </div>
                                        </div>
                                    }
                                </>
                            ))}
                        </div>
                    ))}
                    {!filterChats.length && listChat.map((list) => (
                        <div className="isi" onClick={()=> handleActive(list.users)}>
                                {list.users.map((use) => (
                                    <>
                                        {use._id !== user._id &&
                                            <div className="head-user">
                                                <button>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="45" fill="currentColor" className="bi bi-person-check" viewBox="0 0 16 16">
                                                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                                        <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                                                    </svg>
                                                </button>
                                                <div>
                                                <p>{ use.username }</p>
                                                <small>{list.messages.length ? list.messages[list.messages.length -1].text : "draf"}</small>
                                                </div>
                                            </div>
                                        }
                                    </>
                                ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="chat-active">
                {active &&
                    <div className="isi-chats">
                        <div className="head-active">
                            {active.users.map((use) => (
                                <>
                                    {use._id !== user._id &&
                                        <div>
                                            <button>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="45" fill="currentColor" className="bi bi-person-check" viewBox="0 0 16 16">
                                                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                                    <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                                                </svg>
                                            </button>
                                            <div>
                                                <strong>{use.username}</strong>
                                                <small>aktif</small>
                                            </div>
                                        </div>
                                    }
                                </>
                            ))}
                            <font size="5" onClick={() => handleHideActve()}>x</font>
                        </div>
                        <div className="chats">
                            {active && active.messages.map((mssg) => (
                                <div className={mssg.from == user._id ? "kanan" : "kiri"}>
                                    <div>
                                        <button>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="15" fill="currentColor" className="bi bi-person-check" viewBox="0 0 16 16">
                                                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                                <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                                            </svg>
                                        </button>
                                        <p>{mssg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="kirim">
                            <input type="text" value={inputVal} placeholder="tulis pesan..." onChange={(e)=> setInputVal(e.target.value)}/>
                            <button onClick={()=> handleAddChat(active.users)}>Kirim</button>
                        </div>
                    </div>
                }
                {!active &&  
                    <div className="not-found">
                        <h3>belum ada pesan aktif !!!</h3>
                    </div>
                }
            </div>
        </div>
    )
}

export default Message;