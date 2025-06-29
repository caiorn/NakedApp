import React, { useState } from 'react'
import UserList from './UserList'
import UserForm from './UserForm'

function UserPage() {
    const [editingUser, setEditingUser] = useState(null)

    const handleCreate = (data) => {
        console.log('Criando usuário:', data)
        // lógica de criação aqui
    }

    const handleUpdate = (id, data) => {
        console.log(`Atualizando usuário ${id}:`, data)
        // lógica de atualização aqui
        setEditingUser(null)
    }

    return (
        <div>
            {editingUser ? (
                <UserForm
                    initialData={editingUser}
                    userId={editingUser.id}
                    updateUser={handleUpdate}
                />
            ) : (
                <>
                    <UserForm createUser={handleCreate} />
                    <hr />
                    <UserList onEdit={setEditingUser} />
                </>
            )}
        </div>
    )
}

export default UserPage
