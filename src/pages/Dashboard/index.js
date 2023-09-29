import './dashboard.css';
import { AuthContext } from '../../contexts/auth';
import { useContext, useEffect, useState } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FcAssistant } from "react-icons/fc";
import { collection, getDocs, orderBy, limit, startAfter,query } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { format } from 'date-fns';
import Modal from '../../components/Modal';


export default function Dashboard(){

    const { logout } = useContext(AuthContext);

    const [chamados,setChamados] = useState([]);
    
    //saber quando ta carregando
    const [loading, setLoading] = useState(true);

    //list de Ref do loadChamados
    const listRef = collection(db, "chamados");

    const [isEmpty, setIsEmpty] = useState(false);

    //buscar o ultimo renderizado para dps paginarmos
    const [lastDocs, setLastDocs] = useState();
    //usar para o buscando
    const [loadingMore, setLoadingMore] = useState(false);

    //modal
    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();

   useEffect( () => {
        async function loadChamados(){
            //query que pegara os dados da tabela chamados limitado em 5 chamados
            const q = query(listRef, orderBy('created','desc'),limit(5))

            const querySnapshot = await getDocs(q)
            setChamados([]);
            await updateState(querySnapshot)
            setLoading(false);
        }
        loadChamados();

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
                assunto: doc.data().assunto,
                cliente: doc.data().cliente,
                clienteId: doc.data().clienteId,
                created: doc.data().created,
                createdFormat: format(doc.data().created.toDate(),'dd/MM/yyyy'),
                status: doc.data().status,
                complemento: doc.data().complemento,
            })
        })
        //pegando o ultimo item
        const lastDoc = querySnapshot.docs[querySnapshot.docs.length -1]

        //mantendo os que possuir e buscando a mais
        setChamados(chamados => [...chamados, ...lista])
        setLastDocs(lastDoc);
    }else{
        //lista vazia
        setIsEmpty(false)
    }
    setLoadingMore(false);

   }

  async function handleMore(){
      setLoadingMore(true);

      const q = query(listRef,orderBy('created','desc'), startAfter(lastDocs), limit(5));
      const querySnapshot = await getDocs(q);
      await updateState(querySnapshot);
   }

   function toggleModal(item){
    //inverte, se tiver true vai pra false, se tiver false vai pra true
     setShowPostModal(!showPostModal)

     setDetail(item)
   }

   if(loading){
    return(
        <div>
            <Header/>

            <div className="content">
                <Title name="Chamados" >
                  <FiMessageSquare size={25}/>
                </Title>

                <div className="container dashboard">
                    <span>Buscando chamados...</span>
                </div>
            </div>
        </div>
    )
   }
    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Chamados" >
                    <FiMessageSquare size={25}/>
                </Title>

                <>
                        {chamados.length === 0 ? (
                            <div className="container dashboard">
                                <span>Nenhum chamado registrado...</span>
                                <FcAssistant className="svg-chamado" size={45}/>
                                <Link to="/new" className="new">
                                <FiPlus color="#FFF" size={25}/>
                                Novo Chamado
                                </Link>
                            </div>
                        ) : (
                            <>
                            <Link to="/new" className="new">
                            <FiPlus color="#FFF" size={25}/>
                            Novo Chamado
                            </Link>

                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Texto</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Cadastrado em</th>
                                        <th scope="col">Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {chamados.map((item,index) =>{
                                        return(
                                        <tr key={index}>
                                            <td data-label="Cliente">{item.cliente}</td>
                                            <td data-label="Assunto">{item.assunto}</td>
                                            <td data-label="Status">
                                                <span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td data-label="Cadastrado">{item.createdFormat}</td>
                                            <td data-label="#">
                                                <button className="action" style={{backgroundColor: '#3583f6' }} onClick={() => toggleModal(item)}>
                                                <FiSearch color="#FFF" size={17}/>
                                                </button>
    
                                                <Link to={`/new/${item.id}`} className="action" style={{backgroundColor: '#f6a935' }}>
                                                <FiEdit2 color="#FFF" size={17} />
                                                </Link>
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
                  <Modal
                    conteudo={detail}
                    close={ () => setShowPostModal(!showPostModal)}
                  
                  />
              )}
        </div>
    )
}