import React from 'react';

function UserDetails() {
    // o parametro deve estar igual ao parametro do router e o retorno é sempre string
    const { userId } = useParams()
    //if(!userId)
        
    //+ converte para número
    //const idUser = +userId;

    //get Api and show 
    //obs utilize Loaders igual equipamentLoader pois é a funcao que vai carregar os dados necessarios para que uma rota funcione

    const pageContainerStyle = {
        padding: '2rem',
        textAlign: 'center'
    };

    return (
        <section style={pageContainerStyle}>
            <h2>Página 1</h2>
            <p>Conteúdo da Página 1.</p>
            <h1>{userId}</h1>
        </section>
    )
}

export default UserDetails;