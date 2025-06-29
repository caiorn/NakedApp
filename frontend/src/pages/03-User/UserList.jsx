import React, { useState } from 'react'

function UserList({ onEdit }) {
    // Dados mockados
    const [users] = useState([
        { id: 1, username: 'alice', email: 'alice@example.com', isFirstAccess: false },
        { id: 2, username: 'bob', email: 'bob@example.com', isFirstAccess: true },
        { id: 3, username: 'carol', email: 'carol@example.com', isFirstAccess: false },
        { id: 4, username: 'dave', email: 'dave@example.com', isFirstAccess: true },
        { id: 5, username: 'eve', email: 'eve@example.com', isFirstAccess: false },
    ])

    return (
        <div>
            <h2>Lista de Usuários</h2>
            <table border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuário</th>
                        <th>Email</th>
                        <th>Primeiro Acesso</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.isFirstAccess ? 'Sim' : 'Não'}</td>
                            <td>
                                <button onClick={() => onEdit(user)}>
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UserList
