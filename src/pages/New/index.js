import './new.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle} from 'react-icons/fi';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';


export default function New(){
    const { user } = useContext(AuthContext)
    const navigate = useNavigate();

    const { id } = useParams();
    //vai buscar do banco e por isso começa vazio
    const [customers, setCustomers] = useState([]);
    //começa sempre carregando
    const [loadCustomer, setLoadCustomer] = useState(true);

    //estado para atualizar o /new/:id
    const [idCustomer, setIdCustomer] = useState(false); 

    const [customerSelected, setCustomerSelected] = useState(0)

    const [complemento, setComplemento] = useState('');
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');

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
        const docRef = doc(db,"chamados",id);
        await getDoc(docRef)
        .then((snapshot) =>{
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento);

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
            setCustomerSelected(index);
            setIdCustomer(true);
        })
        .catch((error) =>{
            console.log(error)
            setIdCustomer(false);
        })
    }

    function handleOptionChange(e){
        //recebe o valor do evento do Status
        setStatus(e.target.value);
    }

    function handleChangeSelect(e){
        //toda vez que trocar o option, ele recebe o value
        setAssunto(e.target.value)
    }

    function handleChangeCustomer(e){
        setCustomerSelected(e.target.value)
    }

    async function handleRegister(e){
        e.preventDefault();
        
        //Atualizar chamado
        if(idCustomer){
            const docRef = doc(db, "chamados", id)
            await updateDoc(docRef,{
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid,
            })
            .then(() =>{
                toast.info("Chamado atualizado!")
                setCustomerSelected(0);
                setComplemento('');
                navigate('/dashboard');
            })
            .catch(()=>{
                toast.error("Erro ao atualizar!")
            })

            return;
        }

        //registrar chamado
        await addDoc(collection(db, "chamados"),{
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid,
        })
        .then(() => {
            toast.success("Chamado registrado!");
            setComplemento('');
            setCustomerSelected(0);
        })
        .catch(() => {
            toast.error("Ops! Houve algum erro!");
        })

    }
    return(
        <div>
            <Header/>
            <div className="content">
                <Title name={id ? "Editando chamado" : "Novo chamado"}>
                    <FiPlusCircle size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>

                        <label>Clientes</label>
                            {
                              loadCustomer ? (
                                <input type="text" disabled={true} value="Carregando..."/>
                              ) : (
                                <select value={customerSelected} onChange={handleChangeCustomer}>
                                    {customers.map((item,index) => {
                                        return(
                                            <option key={index} value={index}>
                                                {item.nomeFantasia}
                                            </option>
                                        )

                                    })}
                                </select>
                              )
                            }

                        
                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Técnica</option>
                            <option value="Financeiro">Financeiro</option>                     
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input
                            type="radio"
                            name="radio"
                            value="Aberto"
                            onChange={handleOptionChange}
                            checked={ status === 'Aberto'}
                            />
                            <span>Em Aberto</span>

                            <input
                            type="radio"
                            name="radio"
                            value="Progresso"
                            onChange={handleOptionChange}
                            checked={ status === 'Progresso'}
                            />
                            <span>Progresso</span>

                            <input
                            type="radio"
                            name="radio"
                            value="Atendido"
                            onChange={handleOptionChange}
                            checked={ status === 'Atendido'}
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea 
                        type="text" 
                        placeholder="Descreva seu problema.."
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                        />

                        {id ? <button className="att-btn" type="submit">Atualizar</button> :<button type="submit">Registrar</button>}

                    </form>

                </div>
            </div>
        </div>
    )
}