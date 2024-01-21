import moment from 'moment'
import "../style/navbar.css";

const Navbar = ({user,pages}) => {
    
    const dateTime = new Date()

    return (
        <div className="navbarComponent">
            <div className="great">
                <h2>{pages}</h2>
                <div>
                    <p>{moment(dateTime).format('ll')}</p>
                    {pages == "Dashboard" &&
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </button>
                    }
                </div>
            </div>
            {pages == "Dashboard" &&
                <div className="search">
                    <div>
                        <h4>Hi, { user ? user.username : "" } selamat datang kembali</h4>
                        <p>Ajukan pertanyaan dan temukan jawaban apa yang anda inginkan hari ini !!</p>
                    </div>
                    <div className='img'>
                        <img src="http://localhost:3000/voter.png" alt="vote" />
                    </div>
                </div>
            }
        </div>
    )
}

export default Navbar;