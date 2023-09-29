**<center>Projeto de Suporte com React.js + Firebase</center>**

  No projeto foram usados os já bem conhecido reacter-router-dom, toast, react-icons, o projeto foi organizado com a pasta auth.js para cadastrar, logar e verificar se o usuário está logado e usando essas funções e afins, exportando para outras páginas via AuthContext para maior facilidade de controle e desempenho do projeto, usado a pasta components para criação do Header, Modais e Titles, as rotas estão protegida pelo Private para evitar que usuários não logado possa acessar URL que somente usuários logadam podem ter acesso. Além de claro, utilizarmos o Firebase com suas funções como banco de dados do nosso projeto. Por ser um projeto de certa complexidade, pretendo conforme for ganhando mais conhecimento, atualizar para versões mais novas à partir do que eu for adquirindo de conhecimento e melhorar o desempenho do projeto. Deixarei agora algumas imagens do projeto e uma breve explicação. O projeto em suma é um sistema de suporte com chamados e CRUD de clientes.

  **<center>Tela de Login</center>**
  ![login](https://github.com/Tech2as/Suporte/assets/95533385/72b9569e-521e-40ae-8cbd-81635b73f8a7)

  **<center>Tela de Cadastro</center>**
  ![cadastro](https://github.com/Tech2as/Suporte/assets/95533385/186bb6d6-0d77-48f3-bac8-c90de610f872)

  **<center>Tela de Dashboard, o usuário será redirecionado para cá após fazer login ou cadastro, já com o toast.success("Bem-vindo ao Sistema!")</center>**
  ![dashboard](https://github.com/Tech2as/Suporte/assets/95533385/4c9aa0d9-4b33-4c4c-83df-b13aac8308d8)

  **<center>Se o usuário clicar em "Novo Chamado", seguirá para essa tela onde fará o cadastro do chamado, buscando do banco de dados no select os clientes cadastrados</center>**
  ![newchamado](https://github.com/Tech2as/Suporte/assets/95533385/8c507098-352b-49b8-bf69-7476ae25e205)

  **<center>Ao clicar na Lupinha do dashboard de Chamados, o usuário poderá ver detalhes do chamado</center>**
  ![detalhes](https://github.com/Tech2as/Suporte/assets/95533385/910515be-52cc-45cf-8042-676df7f0f433)

  **<center>Ao clicar no botão de editar, o usuário será retornado para uma tela (/new/:id), buscando o ID do chamado e retornando dados e podendo ser editado</center>**
  ![editandochamado](https://github.com/Tech2as/Suporte/assets/95533385/3ea5c612-92d0-4d9a-b517-48aae1c47a70)

  **<center>Na tela de Clientes, serão retornados os clientes cadastrados pelo usuário</center>**
  **<center>Ao clicar no botão de excluir, o cliente será excluido do banco de dados</center>**
  ![clientesdashboard](https://github.com/Tech2as/Suporte/assets/95533385/06bc97da-f861-4f1b-b60c-afd231a413a8)

  **<center>Ao clicar em Novo Cliente, o usuário será redirecionado a uma página com 3 campos a serem preenchidos</center>**
  ![newclientes](https://github.com/Tech2as/Suporte/assets/95533385/7e40c02f-b591-4546-8bfe-a89ed7f48925)

  **<center>Ao clicar na lupinha, será mostrado um modal com informações do cliente</center>**
  ![detalhescliente](https://github.com/Tech2as/Suporte/assets/95533385/22cbb95b-6b75-47fb-a3d6-52091394f0c2)

  **<center>Ao clicar no botão de editar, o usuário será redirecionado para uma tela (/customers/:id), buscando o ID do cliente e retornando e podendo ser editado</center>**
  ![editandocliente](https://github.com/Tech2as/Suporte/assets/95533385/7811035c-b9c6-4954-a4fd-35ed40faff73)

  **<center>Ao clicar em Perfil, será retornado os dados do usuário logado, podendo ser alterado o nome e a foto de perfil</center>**
  ![perfil](https://github.com/Tech2as/Suporte/assets/95533385/e38d7c45-eb4e-4db2-ad91-edab2e742316)

  **<center>Detalhes importantes a se observar: Foram feitos renderizações condicionais em várias partes do código, ao logar, o botão "Login" será mudado para "Carregando", ao dar F5 na página ou retornar a ela na parte de clientes e chamados, antes da busca ser feita (em torno de milésimos de segundos), será mostrando na tela "Buscando chamados" ou "Buscando clientes", os components Titles foram editados caso o usuário edite ou crie um chamado ou cliente, tanto para a cor do botão quanto para o nome dele, exemplo: "Atualizar", foi feita uma páginação, como demonstra no botão em chamados e clientes "Buscar mais", a query feita para buscar os chamados tem o limite de 5 chamados/clientes, ao clicar em "Buscar mais", caso haja mais que 5 chamados/clientes, aparecerá mais um retorno do registro. O projeto está bem muito organizado em relação a pastas e códigos comentados, como dito acima, conforme for aprendendo e vendo a necessidade de melhorar o projeto, assim o farei.</center>**

  





  

  


  


  


  


  



    

