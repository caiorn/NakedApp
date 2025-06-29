import { useParams } from "react-router-dom"

export default function User(){
    // o parametro deve estar igual ao parametro do router e o retorno é sempre string
    const { userId } = useParams()
    //if(!userId)
        
    //+ converte para número
    //const idUser = +userId;

    //get Api and show 
    //obs utilize Loaders igual equipamentLoader pois é a funcao que vai carregar os dados necessarios para que uma rota funcione


    return (
        <section>
            <h1>{userId}</h1>
        </section>
    )
}