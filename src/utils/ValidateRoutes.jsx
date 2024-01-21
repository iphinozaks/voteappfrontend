import axios from 'axios'
import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'

const ValidateRoutes = ({children}) => {
    let token = Cookies.get("auth_token")
    let auth = {'token': token}

    if (auth.token) {
        axios.post("http://localhost:8000/api/user_auth_token",{auth_token: auth.token})
        .then((user) => {
            if (user.data.code == 200 && user.data.status == "OK") {
                auth = {'token': true}
            }else {
                Cookies.remove("auth_token")
                auth = {'token': false}
            }
        })
        .catch(() => {
            Cookies.remove("auth_token")
            auth = {'token': false}
        })
    }else {
        auth = {'token': false}
    }

    return(
        !auth.token ? children : <Navigate to="/dashboard"/>
    )
}

export default ValidateRoutes;