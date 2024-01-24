import axios from "axios";
import "../style/option.css";
import {Cridential} from "../../utils/dotenv";
import { useNavigate } from "react-router-dom";

const Option = ({setPages,userId,authorId,quest_id,notif}) => {
    const navigate = useNavigate()
    function handleMessage() {
        setPages("Pesan");
        navigate(`/messages?room_key=${userId + '%' + authorId}`)
    }
    async function handleToQuest (notif) {
        if (notif.context == "response") {
            let data = await axios.post(`${Cridential.BASE_URL}/api/get_quest_by_id`,{id: notif.quest_id})
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
        let update = await axios.post(`${Cridential.BASE_URL}/api/delete_notif`,{data: [notif._id]})
        if (update.data.code == 200 && update.data.status == "OK") {
            navigate("/notifies")
        }
    }
    return (
        <div className="optionComponent">
            <ul>
                {!notif ? "" : <li onClick={()=> handleToQuest(notif)}>detail</li>}
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