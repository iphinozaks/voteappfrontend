import "../style/account.css";
import { useState } from "react";
import Login from "../components/Login"
import Alert from "../components/Alert"
import Daftar from "../components/Daftar"

const Account = ({logIn}) => {
    const [isLogIn,setIsLogIn] = useState(true);
    const [alert,setAlert] = useState({
        bool: false,
        status: "",
        mssg: ""
    })
    return (
        <div className="accountContainer">
            {alert.bool && <Alert status={alert.status} mssg={alert.mssg} setAlert={setAlert}/>}
            <div className="main">
                {isLogIn ?
                    <div className="masuk">
                        <Login logIn={logIn} setAlert={setAlert}/>
                    </div>
                :
                    ""
                }
                <div className="about">
                    <h1>Selamat Datang Kembali !</h1>
                    <p>
                        Kata Bob Gray, menulis dalam C atau C++ adalah seperti menggunakan gergaji mesin tanpa pengaman
                        Sulit sekali menembak diri kita sendiri di kaki, tapi kalau hal itu terjadi,
                        Kamu akan kehilangan seluruh kakimu
                    </p>
                    {isLogIn ?
                        <button onClick={() => setIsLogIn(false)}>Daftar Akun Sekarang</button>
                        :
                        <button onClick={() => setIsLogIn(true)}>Masuk Sekarang</button>
                    }
                </div>
                {!isLogIn ?
                    <div className="daftar">
                        <Daftar setIsLogIn={setIsLogIn} setAlert={setAlert}/>
                    </div>
                :
                    ""
                }
            </div>
        </div>
    )
}

export default Account;