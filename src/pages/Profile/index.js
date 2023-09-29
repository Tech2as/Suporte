import './profile.css';
import Header from "../../components/Header"
import Title from "../../components/Title"
import { FiSettings, FiUpload } from 'react-icons/fi';
import avatar from '../../assets/avatar.png'
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL} from 'firebase/storage';


export default function Profile(){

    const { user, storageUser, setUser, logout } = useContext(AuthContext);

    //avatar recebe null ou diferente de null
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);

    //armazenar o file
    const [imageAvatar, setImageAvatar] = useState(null);

    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);

    function handleFile(e){
        //se tiver uma imagem, a primeira
        if(e.target.files[0]){
            const image = e.target.files[0];

            //se a imagem for no formato relatado
            if(image === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image);
                //transformar em URL
                setAvatarUrl(URL.createObjectURL(image));
            }else{
                alert("Formatos aceitos: JPG ou PNG");
                //voltara para null
                setImageAvatar(null);
                //parar execucao do codigo
                return;
            }
        }
    }

    async function handleUpload(){
        const currentUid = user.uid;

        const uploadRef = ref(storage,`images/${currentUid}/${imageAvatar.name}`)

        const uploadTask = uploadBytes(uploadRef, imageAvatar)
        .then((snapshot) => {
            
            getDownloadURL(snapshot.ref).then( async (downloadURL) => {
                let urlFoto = downloadURL;

                const docRef = doc(db, "users", user.uid)
                await updateDoc(docRef, {
                    avatarUrl: urlFoto,
                    nome:nome,
                })
                .then(() => {
                    let data = {
                    ...user,
                    nome:nome,
                    avatarUrl: urlFoto,
                    }
                    //atualiza o user
                    setUser(data);
                    //atualiza o localstorage
                    storageUser(data);
                    toast.success("Perfil atualizado")
                })
            })
        })
    }

    async function handleSubmit(e){
        e.preventDefault();

        if(imageAvatar === null && nome !== ''){
            //atualizar apenas o nome do usuario
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef,{
                nome: nome,
            })
            .then(() => {
                let data = {
                ...user,
                nome:nome,
                }
                setUser(data);
                storageUser(data);
                toast.success("Perfil atualizado")
            })
        } else if (nome !== '' && imageAvatar !== null){
            //atualizar o nome e foto
            handleUpload()
        }
    }

    return (
        <div>
            <Header/>
            <div className="content">
                <Title name="Meu perfil">
                    <FiSettings size={25}/>
                </Title>

              <div className="container">
                <form className="form-profile" onSubmit={handleSubmit}>
                    <label className="label-avatar">
                        <span><FiUpload color="#FFF" size={25}/></span>
                        <input type="file" accept="image/*" onChange={handleFile}/><br/>
                        {avatarUrl === null ? (
                            <img src={avatar} width={250} height={250}/>
                        ):(
                            <img src={avatarUrl} width={250} height={250}/>
                        )}
                    </label>

                    <label>Nome</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value) }/>

                    <label>Email</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value) } disabled={true}/>

                    <button type="submit">Salvar</button>

                </form>
              </div>
              <div className="container">
                <button className="logout-btn" onClick={ () => logout() }>Sair</button>
              </div>
            </div>
            
        </div>
    )
}