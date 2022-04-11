import React, {useContext, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {AuthContext} from "../context/AuthContext";
import axios from "axios";

function Profile() {
    const [content, setContent] =useState();
    const {user} = useContext(AuthContext);

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getPrivateData(){
            const token = localStorage.getItem("token");
            try{
                const result = await axios.get(`http://localhost:3000/660/private-content`, {headers:{
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }}, {cancelToken: source.token});
                setContent(result.data);
            }catch(e){
                console.error(e);
            }
        }

        getPrivateData()
        return function cleanup() {
            source.cancel();
        }
    }, []);



    return (
        <>
            <h1>Profielpagina</h1>
            <section>
                <h2>Gegevens</h2>
                <p><strong>Gebruikersnaam:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </section>
            <section>
                {content &&
                <>
                    <h2>{content.title}</h2>
                    <p>{content.content}</p>
                </>
                }
            </section>
            <p>Terug naar de <Link to="/">Homepagina</Link></p>
        </>
    );
}

export default Profile;