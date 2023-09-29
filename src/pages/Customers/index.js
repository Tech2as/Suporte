import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { db } from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore';

export default function Customers(){

    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    //vai buscar do banco e por isso começa vazio
    const [customers, setCustomers] = useState([]);
    //começa sempre carregando
    const [loadCustomer, setLoadCustomer] = useState(true);

      //estado para atualizar o /customers/:id
      const [idCustomer, setIdCustomer] = useState(false); 

      const [customerSelected, setCustomerSelected] = useState(0);

      useEffect(() =>{
        async function loadCustomers(){
            const listRef = collection(db, "customers");
            const querySnapshot = await getDocs(listRef)
            .then( (snapshot) => {
                let lista = [];
                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia,
                        cnpj: doc.data().cnpj,
                        endereco: doc.data().endereco,
                    })
                })
                
                //tentou buscar mas encontrou nada
                if(snapshot.docs.size === 0){
                    console.log("Erro ao encontrar empresa")
                    setCustomers([ { id: '1', nomeFantasia: 'Error'} ])
                    setLoadCustomer(false);
                    return;
                }

                setCustomers(lista);
                setLoadCustomer(false);

                if(id){
                    loadId(lista);
                }

            })
            .catch((error) => {
                console.log("Erro ao buscar os clientes",error)
                setLoadCustomer(false);
                setCustomers([ { id: '1', nomeFantasia: 'Error'} ])
            })

        }
        loadCustomers();
    },[id])
  

      async function loadId(lista){
        const docRef = doc(db,"customers",id);
        await getDoc(docRef)
        .then((snapshot) =>{
            setNome(snapshot.data().nomeFantasia)
            setCnpj(snapshot.data().cnpj)
            setEndereco(snapshot.data().endereco);

            let index = lista.findIndex(item => item.id === item.id);
            setCustomerSelected(index);
            setIdCustomer(true);
        })
        .catch((error) =>{
            console.log(error)
            setIdCustomer(false);
        })
    }

    async function handleRegister(e){
        e.preventDefault();

        if(idCustomer){
            const docRef = doc(db, "customers", id)
            await updateDoc(docRef,{
                nomeFantasia: nome,
                cnpj:cnpj,
                endereco:endereco,
            })
            .then(() =>{
                toast.info("Cliente atualizado!")
                setCustomerSelected(0);
                navigate('/list');
            })
            .catch(()=>{
                toast.error("Erro ao atualizar!")
            })

            return;
        }

        if(nome !== '' &&  cnpj !== '' && endereco !== ''){
            await addDoc(collection(db,"customers"), {
                nomeFantasia: nome,
                cnpj: cnpj,
                endereco: endereco,
            })
            .then(() => {
                setNome('');
                setCnpj('');
                setEndereco('');
                toast.success("Registrado com sucesso!");
                navigate('/list');
            })
            .catch(() =>{
                toast.error("Erro ao cadastrar!");
            })
            
        }else{
            toast.error("Erro ao cadastrar!");
        }
    }

    function handleNome(e){
        setNome(e.target.value);
    }

    function handleCnpj(e){
        setCnpj(e.target.value);
    }

    function handleEndereco(e){
        setEndereco(e.target.value);
    }
    return (
        <div>
            <Header/>

            <div className="content">
                <Title name={id ? "Editando cliente" : "Novo cliente"}>
                    <FiUser size={25}/>
                </Title>

                <div className="container">
           
                    <form className="form-profile" onSubmit={handleRegister}>

                        <label>Nome fantasia:</label>
                        <input
                          type="text"
                          value={nome}
                          onChange={handleNome} 
                        />

                        <label>CNPJ:</label>
                        <input
                          type="text"
                          value={cnpj}
                          onChange={handleCnpj} 
                        />

                        <label>Endereço:</label>
                        <input
                          type="text"
                          value={endereco}
                          onChange={handleEndereco} 
                        />

                    {id ? <button className="att-btn" type="submit">Atualizar</button> :<button type="submit">Registrar</button>}
                    </form>
                </div>

            </div>

        </div>
    )
}