import {createContext, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
import verifyToken from "../helpers/verifyToken";

export const AuthContext = createContext({});

function AuthContextProvider({children}) {
    const [auth, toggleAuth] = useState({
        isAuth: false,
        user: null,
        status: "pending",
    });
    const history = useHistory();

    useEffect(() => {
        console.log("Context wordt gefresht!")
        const storageToken = localStorage.getItem("token");
        if(storageToken) {
            const decodedJwtToken = jwtDecode(storageToken);
            if(verifyToken(decodedJwtToken.exp)) {
                getUserData(decodedJwtToken.sub, storageToken);
            }else{
                history.push("/login");
            }
        }else{
            toggleAuth({
                isAuth: false,
                user: null,
                status: "done",
            })
        }}, [])

    async function getUserData(id, token) {
        try{
            const userData = await axios.get(`http://localhost:3000/600/users/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            toggleAuth({
                ...auth,
                isAuth: true,
                user: {
                    id: userData.data.id,
                    email: userData.data.email,
                    username: userData.data.username,
                },
                status: "done",
            });
            history.push("/profile");
        }catch(e){
            console.error(e);
        }
    }


    function isSignedFunction (jwtToken){
        const decodedJwtToken = jwtDecode(jwtToken);
        console.log(decodedJwtToken);
        localStorage.setItem("token", jwtToken);
        getUserData(decodedJwtToken.sub, jwtToken)
        console.log("Gebruiker is ingeloged");
        // history.push("/profile");
    }

    function isSignedOutFunction() {
        toggleAuth({
            ...auth,
            isAuth: false,
            user: null,
        });
        console.log("Gebruiker is uitgelogd");
        history.push("/");
        localStorage.clear();
    }


    const data = {
        ...auth,
        isSignedFunction: isSignedFunction,
        isSignedOutFunction: isSignedOutFunction,
    }

    return (
        <div>
            <AuthContext.Provider value={data}>
                {auth.status === "pending" ?
                    <p>Loading...</p>
                    :
                    children}
            </AuthContext.Provider>
        </div>
    )
}

export default AuthContextProvider;