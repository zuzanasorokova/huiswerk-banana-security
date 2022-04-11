import React, {useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from "../context/AuthContext";
import {useForm} from "react-hook-form";
import axios from "axios";

function SignIn() {
    const {isSignedFunction} = useContext(AuthContext);
    const {register, handleSubmit} = useForm();


    useEffect(() => {
        const source = axios.CancelToken.source();
        sendData(source)
        return function cleanup() {
            source.cancel();
        }
    }, []);

    async function sendData(info, source) {
        try{
            const result = await axios.post("http://localhost:3000/login",{
                email: info.email,
                password: info.password,
            },
                {cancelToken: source.token},
                );
            // console.log(result.data.accessToken);
            isSignedFunction(result.data.accessToken);
        }catch(e){
            console.error(e);
        }
    }

    return (
        <>
            <h1>Inloggen</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias cum debitis dolor dolore fuga id molestias qui quo unde?</p>

            <form onSubmit={handleSubmit(sendData)}>
                <label htmlFor="email">E-mail</label>
                <input
                    type="email"
                    id="signin-email"
                    {...register("email")}
                />
                <p>Wachtwoord</p>
                <input
                    type="password"
                    id="signin-password"
                    {...register("password")}
                />

                <button type="submit">Inloggen</button>
            </form>

            <p>Heb je nog geen account? <Link to="/signup">Registreer</Link> je dan eerst.</p>
        </>
    );
}

export default SignIn;