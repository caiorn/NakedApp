import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const newSocket = io('http://localhost:3003');

export default function StatusAndIncrement() {
    const [status, setStatus] = useState(false);
    const [counter, setCounter] = useState(0);
    const socketRef = useRef(null);


    useEffect(() => {
        newSocket.on('connect', () => {
            console.log('✅ Conectado ao servidor:', newSocket.id);
        });

        // Escuta o evento 'itemToggled' do servidor
        newSocket.on('sample:itemToggled', (boolStatus) => {
            console.log('receive server', boolStatus);
            setStatus(boolStatus); // Atualiza o estado com os dados recebidos        
        });

        newSocket.on('sample:counterIncremented', (newCounter) => {
            console.log('receive count:', newCounter);
            setCounter(newCounter); // Atualiza o contador com os dados recebidos
        });

        socketRef.current = newSocket;

        // Limpa a conexão ao desmontar o componente
        return () => {
            console.log('✅ Desconectando do servidor:', newSocket.id);
            newSocket.disconnect();
        }
    }, []);

    const handleStatusChange = () => {
        const boolNewStatus = !status;
        //setStatus(boolNewStatus); // servidor atualizar o estado para todos

        if (socketRef.current) {
            socketRef.current.emit('sample:toggle', boolNewStatus);
            console.log('send server:', boolNewStatus);
        }
    };

    // Função para alternar o status
    const handleIncrement = () => {
        setCounter((prevCounter) => {
            const newCounter = prevCounter + 1;
            if (socketRef.current) {
                socketRef.current.emit('sample:increment', newCounter);
                console.log('send counter:', newCounter);
            }
            return newCounter;
        });
    };

    return (
        <>
            <h1>Teste</h1>
            <div>
                <p>Status atual: {status ? '✅ Ativado' : '❌ Desativado'}</p>
            </div>
            <input
                type="checkbox"
                checked={status}
                onChange={handleStatusChange}
                className="toggle-button"
            />
            <hr />
            <p>Contador: {counter}</p>
            <input
                type="button"
                value={`Incrementar contador: ${counter}`}
                onClick={handleIncrement}
            />
        </>
    );
}