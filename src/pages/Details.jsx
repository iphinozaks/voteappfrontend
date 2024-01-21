import "../style/details.css";
import Detail from "../components/Detail";
import Navbar from "../components/Navbar";
import LeftBar from "../components/LeftBar";
import RightBar from "../components/RightBar";

const Details = ({user,pages,setPages,logOut,userCount}) => {
    return (
        <div className="detailsComponent">
            <div className="left-bar">
                <LeftBar user={user} setPages={setPages} logOut={logOut}/>
            </div>
            <div className="navbar-posts">
                <Navbar user={user} pages={pages}/>
                <Detail user={user} setPages={setPages} userCount={userCount}/>
            </div>
            <div className="right-bar">
                <RightBar user={user} setPages={setPages}/>
            </div>
        </div>
    )
}

export default Details;