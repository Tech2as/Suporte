import "./signin.css";
import tractor from "../../assets/tractor.png";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {AuthContext} from "../../contexts/auth";

export default function SignIn(){
    const [email,setEmail] = useState('');   
    const [password,setPassword] = useState('');  

    const { signIn, loadingAuth } = useContext(AuthContext);

    function handleSignIn(e){
        e.preventDefault();

        if(email !== '' && password !== ''){
            signIn(email,password)
        }

    }

    return(
        <div className="container-center">
            <div className="login">
                <div className="login-area">
                    <img src={tractor}/>
                </div>
                <form onSubmit={handleSignIn}>
                    <h1>Entrar</h1>
                    <input 
                        type="text" 
                        placeholder="Seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="*****"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">
                        {loadingAuth ? 'Carregando...' : 'Login'}
                    </button>
                </form>
                <Link to="/register">Cadastre-se</Link>
            </div>
        </div>
    )
}