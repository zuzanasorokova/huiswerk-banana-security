import React, {useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import {useForm} from "react-hook-form";
import axios from "axios";


function SignUp() {
    const {register, handleSubmit} = useForm();
    const history = useHistory();

    useEffect(() => {
        const source = axios.CancelToken.source();
        sendData(source);
        return function cleanup() {
            source.cancel();
        }
    }, []);

    async function sendData(info, source) {
        try{
            await axios.post("http://localhost:3000/register",{
                email: info.email,
                password: info.password,
                username: info.username,
            }, {cancelToken: source.token});
            history.push("/signin");
            // console.log(userInfo.data.accesstoken);
            // isSignedFunction(userInfo.data.accesstoken);
        }catch(e){
            console.error(e);
        }
    }


    return (
        <>
            <h1>Registreren</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur atque consectetur, dolore eaque eligendi
                harum, numquam, placeat quisquam repellat rerum suscipit ullam vitae. A ab ad assumenda, consequuntur deserunt
                doloremque ea eveniet facere fuga illum in numquam quia reiciendis rem sequi tenetur veniam?</p>
            <form onSubmit={handleSubmit(sendData)}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    {...register("username")}
                />
                <label htmlFor="email">E-mail</label>
                <input
                    type="email"
                    id="email"
                    {...register("email")}
                />
                <label htmlFor="password">Wachtwoord</label>
                <input
                    type="password"
                    id="password"
                    {...register("password")}
                />
                <button type="submit">Register</button>
            </form>
            <p>Heb je al een account? Je kunt je <Link to="/signin">hier</Link> inloggen.</p>
        </>
    );
}

export default SignUp;