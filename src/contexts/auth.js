import { useState, createContext, useEffect } from "react";
import { auth, db } from "../services/firebaseConnection";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {  toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    //verificando se o user ta logado
    useEffect(() => {

        async function loadUser(){
            const storageUser = localStorage.getItem('@tickets')

            if(storageUser){
                setUser(JSON.parse(storageUser))
                setLoading(false);
            }
            setLoading(false);
        }
        loadUser();
    },[])

    //funcao assincrona usando funcao do firebase
    async function signIn(email,password){
        setLoadingAuth(true);

        await signInWithEmailAndPassword(auth, email, password)
        .then( async (value) => {
           let uid = value.user.uid;

           const docRef = doc(db, "users", uid);
           const docSnap = await getDoc(docRef)
           let data = {
                uid: uid,
                nome: docSnap.data().nome,
                email: value.user.email,
                avatarUrl: docSnap.data().avatarUrl,
           }
            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success("Bem-vindo ao Sistema");
            navigate("/dashboard");
        })
        .catch((error) => {
            console.log(error);
            setLoadingAuth(false);
            toast.error("Error 404");
        })
    }

    //funcao assincrona usando funcao do firebase
    async function signUp(email,password,name){
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
        .then( async (value) => {
            let uid = value.user.uid;

            await setDoc(doc(db, "users", uid),{
                nome: name,
                avatarUrl: null,
            })
            .then(() =>{
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null,
                };
                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success("Bem-vindo ao Sistema");
                navigate("/dashboard");
            })

        })
        .catch ((error)=>{
            console.log(error);
            setLoadingAuth(false);
        })
    }

    //guardar informaçoes do usuario no localstorage
    function storageUser(data){
        localStorage.setItem('@tickets', JSON.stringify(data));
    }

    //funcao assincrona deslogar e removendo do localstorage os dados e setando usuario pra null
    async function logout(){
        await signOut(auth);
        localStorage.removeItem('@tickets');
        setUser(null);
    }

    return(
        <AuthContext.Provider 
            value={{
                signed: !!user, //false
                user,
                signIn,
                signUp,
                logout,
                loadingAuth,
                loading,
                storageUser,
                setUser,

        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
