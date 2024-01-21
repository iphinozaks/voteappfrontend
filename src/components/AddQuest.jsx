import "../style/add.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"

const AddQuest = ({user,setPages}) => {
    const navigate = useNavigate();
    const [ans,setAns] = useState(2);
    const [quest,setQuest] = useState("");
    const [answer,setAnswer] = useState({
        ansSatu: "",
        ansDua: "",
        ansTiga: "",
        ansEmpat: "",
        ansLima: "",
    })

    function increment () {
        if (ans < 5) {
            setAns(ans + 1)
        }
    }
    function decrement () {
        if (!ans <= 2) {
            setAns(ans - 1)
        }
    }
    const handleUnggahVote = async () => {
        const add = await axios.post("http://localhost:8000/api/createQuest",{author_id: user._id,username: user.username,quest: quest,answer: answer})
        if (add.data.code == 200 && add.data.status =="OK") {
            setPages("Dashboard")
            navigate("/dashboard")
        }else {
            navigate("/addQuestion")
        }
    }
    return (
        <div className="addQuestComponent">
            <div className="user-prof">
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-check" viewBox="0 0 16 16">
                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                        <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                    </svg>
                    <h4>{ user ? user.username : "" }</h4>
                </button>
            </div>
            <div className="questForm">
                <label htmlFor="quest">Pertanyaan:</label>
                <textarea name="quest" id="quest" rows="9" placeholder="tanyakan sesuatu..." onChange={(e) => setQuest(e.target.value)}/>
            </div>
            <div className="add-ans">
                <button onClick={() => increment()}>
                    Tambah Jawaban
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                </button>
                {ans >= 3 &&
                    <button onClick={() => decrement()}>
                        Kurangi Jawaban
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash" viewBox="0 0 16 16">
                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                        </svg>
                    </button>
                }
            </div>
            <div className="ans">
                <div>
                    <label htmlFor="ans1">jawaban 1:</label>
                    <input type="text" id="ans1" placeholder="jawaban 1" onChange={(e) => setAnswer(prevState => ({
                        ...prevState,
                        ansSatu: e.target.value
                    }))}/>
                </div>
                <div>
                    <label htmlFor="ans2">jawaban 2:</label>
                    <input type="text" id="ans2" placeholder="jawaban 2" onChange={(e) => setAnswer(prevState => ({
                        ...prevState,
                        ansDua: e.target.value
                    }))}/>
                </div>
                {ans >= 3 &&
                    <div>
                        <label htmlFor="ans3">jawaban 3:</label>
                        <input type="text" id="ans3" placeholder="jawaban 3" onChange={(e) => setAnswer(prevState => ({
                        ...prevState,
                        ansTiga: e.target.value
                    }))}/>
                    </div>
                }
                {ans >= 4 &&
                    <div>
                        <label htmlFor="ans4">jawaban 4:</label>
                        <input type="text" id="ans4" placeholder="jawaban 4" onChange={(e) => setAnswer(prevState => ({
                        ...prevState,
                        ansEmpat: e.target.value
                    }))}/>
                    </div>
                }
                {ans >= 5 &&
                    <div>
                        <label htmlFor="ans5">jawaban 5:</label>
                        <input type="text" id="ans5" placeholder="jawaban 5" onChange={(e) => setAnswer(prevState => ({
                        ...prevState,
                        ansLima: e.target.value
                    }))}/>
                    </div>
                }
            </div>
            <div className="btn-add">
                <button onClick={() => handleUnggahVote()}>Unggah Vote</button>
            </div>
        </div>
    )
}

export default AddQuest;