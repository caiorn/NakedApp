import React, { useState, useEffect } from 'react'

function UserForm({ initialData, userId, createUser, updateUser }) {
    // Detect edit mode
    const isEditing = !!initialData

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        isFirstAccess: false,
    })

    // Load initial data when editing
    useEffect(() => {
        if (isEditing) {
            setFormData({
                username: initialData.username || '',
                email: initialData.email || '',
                isFirstAccess: initialData.isFirstAccess || false,
            })
        }
    }, [initialData, isEditing])

    // Generic change handler
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    // Submit handler
    const handleSubmit = (e) => {
        e.preventDefault()
        if (isEditing) {
            updateUser(userId, formData)
        } else {
            createUser(formData)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{isEditing ? 'Editar Usuário' : 'Criar Usuário'}</h2>

            <div>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <div>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        name="isFirstAccess"
                        checked={formData.isFirstAccess}
                        onChange={handleChange}
                    />
                    Primeiro Acesso?
                </label>
            </div>

            <button type="submit">
                {isEditing ? 'Atualizar' : 'Cadastrar'}
            </button>
        </form>
    )
}

export default UserForm
