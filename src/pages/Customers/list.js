import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from 'react-icons/fi';
import { useContext, useEffect, useState } from 'react';
import { collection, getDocs, orderBy, limit, startAfter,query,getDoc, deleteDoc,doc } from 'firebase/firestore';
import { Link,useNavigate } from 'react-router-dom';
import { db } from '../../services/firebaseConnection';
import { FcAssistant } from "react-icons/fc";
import {FiUser,FiX } from "react-icons/fi";
import ModalList from '../../components/Modal-list';
import { toast } from 'react-toastify';


export default function List (){

    const navigate = useNavigate();
    const [clientes,setClientes] = useState([]);
    //saber quando ta carregando
    const [loading, setLoading] = useState(true);
    const [lastDocs, setLastDocs] = useState();
    //usar para o buscando
    const [loadingMore, setLoadingMore] = useState(false);

    const [isEmpty, setIsEmpty] = useState(false);

    //modal
    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();
    
    const listRef = collection(db, "customers");
    useEffect( () => {
        async function loadClientes(){
            
            //query que pegara os dados da tabela chamados limitado em 5 chamados
            const q = query(listRef, limit(5))

            const querySnapshot = await getDocs(q)
            setClientes([]);
            await updateState(querySnapshot)
            setLoading(false);
        }
        loadClientes();

        return () => {

        }

   },[])

   async function updateState(querySnapshot){
    //verificar se a collection ta vazia
    const isCollectionEmpty = querySnapshot.size === 0;

    if(!isCollectionEmpty){
        let lista = [];
        querySnapshot.forEach((doc) =>{
            lista.push({
                id: doc.id,
                cnpj: doc.data().cnpj,
                endereco: doc.data().endereco,
                nomeFantasia: doc.data().nomeFantasia,
            })
        })
        //pegando o ultimo item
        const lastDoc = querySnapshot.docs[querySnapshot.docs.length -1]

        //mantendo os que possuir e buscando a mais
        setClientes(clientes => [...clientes, ...lista])
        setLastDocs(lastDoc);
    }else{
        //lista vazia
        setIsEmpty(false)
    }
    setLoadingMore(false);
   }

   function toggleModal(item){
    //inverte, se tiver true vai pra false, se tiver false vai pra true
     setShowPostModal(!showPostModal)

     setDetail(item)
   }

   async function handleMore(){
    setLoadingMore(true);

    const q = query(listRef, startAfter(lastDocs), limit(5));
    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot);
 }

   async function deleteCustomer(id){
        await deleteDoc(doc(db,"customers",id))
        .then(()=>{
            toast.success("Cliente removido com sucesso!")
            window.location.reload(false);
        })
        .catch(() =>{
            toast.error("Erro ao excluir cliente!")
        })
   }
   

   if(loading){
    return(
        <div>
            <Header/>

            <div className="content">
                <Title name="Clientes" >
                  <FiMessageSquare size={25}/>
                </Title>

                <div className="container dashboard">
                    <span>Buscando clientes...</span>
                </div>
            </div>
        </div>
    )
   }
        return(
            <div>
                  <Header/>

            <div className="content">
                <Title name="Clientes" >
                  <FiUser size={25}/>
                </Title>
           
             <>

             {clientes.length === 0 ? (
                            <div className="container dashboard">
                                <span>Nenhum cliente registrado...</span>
                                <FcAssistant className="svg-chamado" size={45}/>
                                <Link to="/customers" className="new">
                                <FiPlus color="#FFF" size={25}/>
                                Novo Cliente
                                </Link>
                            </div>
                        ) : (
                            <>
                            <Link to="/customers" className="new">
                            <FiPlus color="#FFF" size={25}/>
                           Novo Cliente
                            </Link>
                         <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">CNPJ</th>
                                        <th scope="col">Endereço</th>
                                        <th scope="col">#</th>
                        
                                    </tr>
                                </thead>

                                <tbody>
                                    {clientes.map((item,index) =>{
                                        return(
                                        <tr key={index}>
                                            <td data-label="nomeFantasia">{item.nomeFantasia}</td>
                                            <td data-label="CNPJ">{item.cnpj}</td>
                                            <td data-label="Endereco">{item.endereco}</td>
                                            <td data-label="#">
                                                <button className="action" style={{backgroundColor: '#3583f6' }} onClick={() => toggleModal(item)} >
                                                <FiSearch color="#FFF" size={17}/>
                                                </button>
    
                                                <Link to={`/customers/${item.id}`} className="action" style={{backgroundColor: '#f6a935' }}>
                                                <FiEdit2 color="#FFF" size={17} />
                                                </Link>

                                                <button className="action" style={{backgroundColor: '#FF0505'}} onClick={() => deleteCustomer(item.id)}>
                                                <FiX color="#FFF" size={17}/>
                                                </button>
                                            </td>
                                        </tr>
                                        )
                                    })}
                      
                                </tbody>
                            </table>
                            {loadingMore && <h3>Buscando mais...</h3>}
                            {!loadingMore && !isEmpty && <button onClick={handleMore} className="btn-more">Buscar mais</button>}
                            </>
                            )}
                                                       
               </>
                </div>
                {showPostModal && (
                  <ModalList
                    conteudo={detail}
                    close={ () => setShowPostModal(!showPostModal)}
                  
                  />
              )}
            </div>
        )
}