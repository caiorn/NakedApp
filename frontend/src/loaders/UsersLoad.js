/**
 * Loader functions são usadas pelo React Router para buscar dados
 * antes da renderização de uma rota. Elas permitem carregar e preparar
 * informações necessárias para o componente, melhorando a experiência do usuário
 * ao evitar carregamentos visuais (como "piscar" de conteúdo).
 *
 * As funções loader recebem um objeto com `params`, `request`, entre outros,
 * e devem retornar os dados que serão acessados com `useLoaderData()` no componente.
 */

export default function loadUser({params}) {   
    console.log("string param:" + params.equipamentId);

    //simulando resposta servidor para testar error boundary
    if(!params){
        throw new Response('404 Not found porra', {status: 404})
    }

    //retorna o parametro para poder usar em useLoadData()
    return params
}