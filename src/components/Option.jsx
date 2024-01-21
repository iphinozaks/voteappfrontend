import axios from "axios";
import "../style/option.css";
import { useNavigate } from "react-router-dom";

const Option = ({setPages,posts,userId,authorId,quest_id,notif}) => {
    const navigate = useNavigate()
    function handleDetail() {
        setPages("Detail Vote")
        navigate(`/detail_quest?quest_id=${quest_id}`,{
            state: posts
        })
    }
    function handleMessage() {
        setPages("Pesan");
        navigate(`/messages?room_key=${userId + '%' + authorId}`)
    }
    async function handleToQuest (notif) {
        if (notif.context == "response") {
            let data = await axios.post("http://localhost:8000/api/get_quest_by_id",{id: notif.quest_id})
            setPages("Detail Vote")
            navigate(`/detail_quest?quest_id=${notif.quest_id}`,{
                state: data.data.quest
            })
        }else {
            setPages("Pesan");
            navigate(`/messages?room_key=${notif.chat_key}`)
        }
    }
    async function handleHapusNotif(notif) {
        let update = await axios.post("http://localhost:8000/api/delete_notif",{data: [notif._id]})
        if (update.data.code == 200 && update.data.status == "OK") {
            navigate("/notifies")
        }
    }
    return (
        <div className="optionComponent">
            <ul>
                {!notif ? <li onClick={()=> handleDetail()}>voteing</li> : <li onClick={()=> handleToQuest(notif)}>detail</li>}
                {!notif ? 
                    <>
                        {userId == authorId ?
                            <li>profile</li>
                            : 
                            <>
                            <li>profile</li>
                            <li onClick={()=> handleMessage()}>kirim pesan</li>
                            </>
                        }
                    </>
                    :
                    <li onClick={()=> handleHapusNotif(notif)}>hapus</li>
                }
            </ul>
        </div>
    )
}

export default Option;