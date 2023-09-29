import tractor from "../../assets/tractor.png"
import { useState, useContext} from "react";
import { Link } from "react-router-dom";
import {AuthContext} from "../../contexts/auth";

export default function SignUp(){
    const [email,setEmail] = useState('');   
    const [password,setPassword] = useState('');  
    const [name,setName] = useState('');

    const { signUp, loadingAuth } = useContext(AuthContext)

    async function handleSubmit(e){
        e.preventDefault();

        if(email !== '' && password !== '' && name !== ''){
           await signUp(email,password,name)
        }

    }

    return(
        <div className="container-center">
            <div className="login">
                <div className="login-area">
                    <img src={tractor}/>
                </div>
                <form onSubmit={handleSubmit}>
                    <h1>Cadastro</h1>

                    <input 
                        type="text" 
                        placeholder="Seu nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

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
                        {loadingAuth ?  'Carregando...' : 'Cadastrar'}
                    </button>
                </form>
                <Link to="/">Possui conta?</Link>
                <h6>v1.0</h6>
            </div>
        </div>
    )
}