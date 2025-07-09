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
        <div
            style={{
  				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'aquamarine',
            }}
        >
            <form onSubmit={handleSubmit}>
                <h2>{isEditing ? 'Editar Usuário' : 'Criar Usuário'}</h2>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        style={{ width: '100%' }}
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </label>
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
                <label>
                    <input
                        type="checkbox"
                        name="isFirstAccess"
                        checked={formData.isFirstAccess}
                        onChange={handleChange}
                    />
                    Primeiro Acesso?
                </label>
                <button type="submit">
                    {isEditing ? 'Atualizar' : 'Cadastrar'}
                </button>
            </form>
        </div>
    )
}

export default UserForm
