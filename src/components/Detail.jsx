import axios from "axios";
import moment from "moment";
import "../style/detail.css";
import { useEffect, useState } from "react";
import {Cridential} from "../../utils/dotenv";
import { useLocation,useNavigate } from "react-router-dom";

const Detail = ({user,setPages,userCount}) => {
    const navigate = useNavigate();
    const {state}  = useLocation();
    const [data,setData] = useState();
    const [com,setCom] = useState(false);
    const [idAnsw,setIdAnsw] = useState("");
    const [choose,setChoose] = useState("");
    const [answers,setAnswer] = useState([]);
    const [comValue,setComValue] = useState("");
    let params = window.location.href.split("=")[1];
    
    useEffect(() => {
        state.map((ste) => {
            if (ste._id == params) {
                let data = ste.answers.sort((i, j) => { return j.ans_count - i.ans_count});
                ste.answers = data;
                setData(ste)
            }
        })
        axios.post(`${Cridential.BASE_URL}/api/get_ans_by_params`,{params})
        .then((result) => {
            setAnswer(result.data.data);
        })
    },[params])

    function handleChoose (ans) {
        setIdAnsw(ans.ans_id);
        setChoose(ans.answer);
    }

    const handleAddVote = async (e) => {
        e.preventDefault();
        let req = {
            quest_id: data._id,
            ans_id: idAnsw,
            choose: choose,
            user_id: user._id,
            comment: comValue,
            author_id: data.author_id,
            username: user.username,
        }
        let add = await axios.post(`${Cridential.BASE_URL}/api/add_answer`,{req})
        if (add.data.code == 200 && add.data.status == "OK") {
            setIdAnsw("");
            setChoose("");
            setComValue("")
            setPages("Dashboard")
            navigate("/dashboard")
        }else {
            setIdAnsw("");
            setChoose("");
            setComValue("")
            setPages("Dashboard")
            navigate("/dashboard")
        }
    }

    function handleCom () {
        setCom(!com)
        setComValue("")
    }

    return (
        <div className="detailComponent">
            {data &&    
                <div className="voteCard" key={data._id}>
                    <div className="prof">
                        <div>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                </svg>
                                <h5>{data.username}</h5>
                            </button>
                        </div>
                        <div className="option">
                            <font size="2">{moment(new Date(data.created_at).getTime()).fromNow()}</font>
                        </div>
                    </div>
                    <div className="question">
                        pertanyaan:
                        <div className="quest">
                            <h4>{data.question}</h4>
                        </div>
                    </div>
                    <div className="ansContain">
                        {data.answers && data.answers.map((ans) => (
                            <div className="ans" key={ans.ans_id}>
                                <div className="count">
                                    <button className="tot">{ans.ans_count}</button>
                                    <div className="persen">
                                        <small>{Math.ceil((ans.ans_count / 1) * 100 / userCount)} %</small>
                                        <div className="progres" style={{height: Math.ceil((ans.ans_count / 1) * 100 / userCount) + "%"}}></div>
                                    </div>
                                    <small>{ans.answer}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="vote">
                        pilihan:
                        {data.answers && data.answers.map((ans) => (
                            <button className={choose == ans.answer ? "celected" : ""} type="button" onClick={()=> handleChoose(ans)}>
                                <label htmlFor="choose">{ans.answer}</label>
                            </button>
                        ))}
                    </div>
                    <div className="responseComment">
                        tanggapan:
                        {answers.length &&
                            <div className="comments">
                                {answers.map((com) => (
                                    <div className="coms" key={com._id}>
                                        <div className="headCom">
                                            <button>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                                    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                                </svg>
                                                <small>{com.username}</small>
                                            </button>
                                            <small>{moment(new Date(com.created_at).getTime()).fromNow()}</small>
                                        </div>
                                        <div>
                                            <small><b>jawaban : </b></small>
                                            <small><b>{com.answer}</b></small>
                                        </div>
                                        {com.comment &&
                                            <div className="bodyCom">
                                                <small><b>alasan : </b></small>
                                                <small>{com.comment}</small>
                                            </div>
                                        }
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                    <div className="submit">
                        <input type="text" value={comValue} placeholder="alasan..." onChange={(e)=> setComValue(e.target.value)}
                        disabled={com ? false : true}/>
                        <button onClick={()=> handleCom()}>
                            {com ?
                                <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                                </svg>
                                urungkan
                                </>
                                : 
                                <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                                alasan
                                </>
                            }
                        </button>
                        <button onClick={(e)=> handleAddVote(e)}>voteing</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Detail;