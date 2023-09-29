import { FiX } from 'react-icons/fi';

export default function ModalList( {conteudo, close}){
    return(
        <div className="modal">
            <div className="container">
                <button className="close" onClick={close}>
                    <FiX size={25} color="FFF"/>
                    Fechar
                </button>

                <main>
                    <h2>Detalhes do cliente</h2>

                    <div className="row">
                        <span>
                            Cliente: <i>{conteudo.nomeFantasia}</i>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            CNPJ: <i>{conteudo.cnpj}</i>
                        </span>

                        <span>
                            Endereço: <i>{conteudo.endereco}</i>
                        </span>
                    </div>

                </main>
            </div>

        </div>
    )
}