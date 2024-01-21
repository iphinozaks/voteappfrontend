import axios from "axios";
import "../style/posts.css";
import moment from "moment";
import Option from "./Option";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const socketClient = io.connect("http://localhost:8000")

const Posts = ({user,setPages,userCount}) => {
    const navigate = useNavigate();
    const [posts,setPosts] = useState([]);
    const [userId,setUserId] = useState(false);
    const [authorId,setAuthorId] = useState(false);
    const [isOption,setIsOption] = useState(false);
    const [currentPages,setCurrentPages] = useState(0);
    
    useEffect(() => {
        socketClient.on("pushAnswer", data => {
            var array = posts
            let indexQuest = array.findIndex(object => {
                return object._id == data[0].quest_id
            })
            let indexAns = array[indexQuest].answers.findIndex(object => {
                return object.ans_id == data[0].ans_id
            })
            array.map((arr) => {
                arr.answers[indexAns].ans_count = arr.answers[indexAns].ans_count + 1
            })
            setPosts(array)
        })
    },[socketClient])
    
    async function handleScroll (e) {
        const target = e.target;
        const isScrollTop = target.scrollTop;
        const isScrollToBottom = target.scrollHeight - target.scrollTop === target.clientHeight;
        if (isScrollTop > 45) {
            let img = document.getElementsByClassName("search")
            let postComponent = document.getElementsByClassName("postsComponent")
            img[0].style.display = "none";
            postComponent[0].style.height = "83.5vh";
        }else {
            let img = document.getElementsByClassName("search")
            let postComponent = document.getElementsByClassName("postsComponent")
            img[0].style.display = "inherit";
            postComponent[0].style.height = "55.5vh";
        }
        if (isScrollToBottom) {
            let paginate = await axios.post("http://localhost:8000/api/get_all_Questions",{currentPages});
            if (paginate.data.data) {
              setCurrentPages(paginate.data.data.pages)
              let array = posts
              let data = array.concat(paginate.data.data.quest).reverse()
              setPosts(data)
            }
        }
    }

    useEffect(() => {
        async function fetchData() {
            let posts = await axios.post("http://localhost:8000/api/get_all_Questions");
            if (posts.data.data.quest) {
                setCurrentPages(posts.data.data.pages)
                let reverse = posts.data.data.quest.reverse();
                setPosts(reverse);
            }
        }
        fetchData();
    },[])

    function handleIsOption (id,userId,author_id) {
        if (isOption && isOption == id) {
            setIsOption(false)
        }else {
            setIsOption(id)
            setUserId(userId)
            setAuthorId(author_id)
        }
    }

    function handleDetail(quest_id) {
        setPages("Detail Vote")
        navigate(`/detail_quest?quest_id=${quest_id}`,{
            state: posts
        })
    }

    return (
        <div className="postsComponent" onScroll={(e)=> handleScroll(e)}>
            {posts && posts.map((post) => (
                <div className="voteCard" key={post._id}>
                    <div className="prof">
                        <div>
                            <button onClick={()=> handleIsOption(post._id,user._id,post.author_id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                </svg>
                                <h5>{post.username}</h5>
                            </button>
                        </div>
                        <div className="option">
                            <font size="1">
                                {moment(new Date(post.created_at).getTime()).fromNow()}    
                            </font>
                            <p className="arrow" onClick={()=> handleIsOption(post._id,user._id,post.author_id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                </svg>
                            </p>
                            {isOption == post._id && 
                                <Option setPages={setPages} posts={posts} userId={userId} authorId={authorId} quest_id={post._id}/>
                            }
                        </div>
                    </div>
                    <div className="question">
                        pertanyaan:
                        <div className="quest">
                            <h4>{post.question}</h4>
                        </div>
                    </div>
                    <div className="ansContain">
                        {post.answers && post.answers.map((ans) => (
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
                    <div className="response">
                        <small onClick={()=> handleDetail(post._id)}>lihat tanggapan</small>
                        <div>
                            {post.answers && post.answers.map((ans,i) => (
                                <>
                                    {i % 2 == 1 ? 
                                        <button key={ans.ans_id}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" fill="currentColor" class="bi bi-person-check" viewBox="0 0 16 16">
                                                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                                <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                                            </svg>
                                        </button>
                                        :
                                        <button key={ans.ans_id}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" fill="currentColor" class="bi bi-chat-right-text" viewBox="0 0 16 16">
                                                <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                                                <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                                            </svg>
                                        </button>
                                    }
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Posts;