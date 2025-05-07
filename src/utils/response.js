/**
   * Método para criar uma resposta de sucesso padronizada
   * @param {Object} data - Dados que devem ser enviados na resposta
   * @param {String} message - Mensagem informativa sobre o sucesso
   * @returns {Object} Objeto da resposta padronizada
   */
function successResponse(data = null, message = 'Operação realizada com sucesso', meta = {}) {
    return {
        success: true,
        message,
        data,
        meta: {
            timestamp: new Date().toISOString(),
            ...meta
        }
    };
}

module.exports = { successResponse };

/* 
    Porque campo meta? 
    meta é para dados auxiliares para permitir expansão futura
        Paginação (page, limit, total)
        Metadados adicionais (ex: timestamp, executionTime)
        Contexto para debug (requestId, environment)
        Localização de mensagens (messageKey, locale)
        Avisos ou sugestões (warnings, nextActions)

Ex: de Uso
  reply.send(ResponseUtils.success({
    message: 'Usuários encontrados',
    data: users,
    meta: { pagination: { page: 1, total: 100 } }
}));


 Ex: de Retorno:
    {
        "success": true,
        "message": "Listagem de usuários realizada com sucesso",
        "data": [{ "id": 1, "name": "João" }],
        "meta": {
            "pagination": {
            "page": 1,
            "limit": 10,
            "total": 42
            },
            "timestamp": "2025-05-07T20:15:30.000Z"
        }
        }
*/

