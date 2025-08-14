// @ts-nocheck
/* Este arquivo contém interceptores para o Knex.ts 
que permitem o registro detalhado de consultas SQL, 
incluindo tempo de execução, tipo de operação e informações 
adicionais sobre os resultados. 
utilize KNEX_LOG_ENABLED=TRUE para ativar os interceptores.
*/

import { performance } from 'perf_hooks';
import { format } from 'sql-formatter';

export function setupKnexInterceptors(knex, { enable, options }) {
    if (!enable) { return; }
    const {
        errorsOnly = false,
        logTypes = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
        showFullSQL = true,
        beatifySQL = true,
        showResultTable = { enabled: false, maxRows: 5, maxColumns: 5 }, // Show result table in logs
    } = options;

    const queryTimers = new Map();

    function shouldLogQuery(sql) {
        if (!sql) return false;
        const upperSql = sql.trim().toUpperCase();
        // Verificar comandos de transação
        if (upperSql === 'BEGIN;') {
            console.log('\x1b[36m------------ BEGIN TRANSACTION ------------\x1b[0m');
            return;
        } else if (upperSql === 'COMMIT;') {
            console.log('\x1b[34m------------ COMMIT TRANSACTION ------------\x1b[0m');
            return;
        } else if (upperSql === 'ROLLBACK') {
            console.log('\x1b[31m------------ ROLLBACK TRANSACTION ------------\x1b[0m');
            return;
        } return logTypes.some(type => upperSql.startsWith(type));
    }

    const test = true;
    function formatValue(val) {
        if (val === null) return `\x1b[34mNULL\x1b[0m`; // Blue
        if (typeof val === 'string') return `\x1b[38;2;206;145;120m'${val.replace(/'/g, "''").replace(/\\/g, "\\\\").replace(/\n/g, "\\n")}'\x1b[0m`; // RGB(206, 145, 120)
        if (typeof val === 'boolean') return `\x1b[33m${val ? 'TRUE' : 'FALSE'}\x1b[0m`; // yelow
        if (val instanceof Date) {
            const pad = n => n.toString().padStart(2, '0');
            const formatted = `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())} ${pad(val.getHours())}:${pad(val.getMinutes())}:${pad(val.getSeconds())}`;
            return `\x1b[35m'${formatted}'\x1b[0m`; // Magenta
        }
        return `\x1b[38;2;181;206;137m${val}\x1b[0m`; // 36 is Cyan
    }

    function formatQueryWithValuesColors(query, values) {
        if (!query) return '';


        if (beatifySQL) {
            query = format(query, {
                // params: values,
                language: 'mysql',
                indentStyle: 'tabularLeft',
                keywordCase: 'upper',
            });
            // Remove todos os backticks
            query = query.replace(/`/g, '');
        } else {
            // Remove apenas quebras de linha no início e fim
            query = query.replace(/^\s*\n|\n\s*$/g, '');
        }

        if (!values || values.length === 0) return query;

        let i = 0;
        const formattedQuery = query.replace(/\?/g, () => formatValue(values[i++]));
        return formattedQuery;
    }

    function getTimeColor(duration) {
        if (duration <= 200) return '\x1b[32m'; // Green
        if (duration <= 500) return '\x1b[33m'; // Yellow
        return '\x1b[31m'; // Red
    }

    function logQueryDetails(type, response, queryData, duration) {
        const ms = duration.toFixed(0);
        const timeColor = getTimeColor(duration);
        const resetColor = '\x1b[0m';
        const formattedQuery = showFullSQL ? '\n' + formatQueryWithValuesColors(queryData.sql, queryData.bindings) : '';

        let additionalInfo = '';

        if (type === 'SELECT') {
            const rows = Array.isArray(response) && Array.isArray(response[0]) ? response[0] : response;
            const rowCount = Array.isArray(rows) ? rows.length : 0;
            const columnCount = rowCount > 0 && typeof rows[0] === 'object' ? Object.keys(rows[0]).length : 0;
            if (rowCount === 1 && columnCount === 1) {
                const value = rows[0][Object.keys(rows[0])[0]];
                const truncatedValue = typeof value === 'string' && value.length > 20 ? value.substring(0, 20) + '...' : value;
                additionalInfo = `[Rows: ${rowCount}, Columns: ${columnCount}, Value: ${truncatedValue}]`;
            } else {
                additionalInfo = `[Rows: ${rowCount}, Columns: ${columnCount}]`;
            }
        } else if (type === 'INSERT' || type === 'UPDATE' || type === 'DELETE') {
            const isReturning = queryData.returning && Array.isArray(queryData.response) && typeof queryData.response[0] === 'object';
            let detailsInfo = isReturning
                ? `[Affected: ${queryData.response.length} Returning Columns:${queryData.returning.length}]`
                : `${JSON.stringify(queryData.response) || null}`;
            additionalInfo = `${detailsInfo}`;
        }

        const tablename = `\x1b[35m${extractTableName(queryData.sql) || 'unknown'}\x1b[0m`;
        const modeInfo = queryData.method === 'raw' ? '\x1b[33m raw\x1b[0m' : '';

        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0]; // hh:mm:ss
        console.log(`${timeColor}[${timeStr}] ${ms}ms ${type}${resetColor} ${tablename} ${modeInfo}${timeColor}${additionalInfo}${resetColor} ${formattedQuery}`);

    }

    function extractTableName(sql) {
        if (!sql) return null;

        // Regex pega o nome da tabela após INSERT INTO, UPDATE ou FROM
        const match = sql.match(/(?:FROM|INTO|UPDATE)\s+`?(\w+)`?/i);
        return match ? match[1] : null;
    }

    knex.on('query', (queryData) => {
        if (!shouldLogQuery(queryData.sql)) return;
        queryTimers.set(queryData.__knexQueryUid, performance.now());
    });

    knex.on('query-response', (response, queryData) => {
        if (!shouldLogQuery(queryData.sql)) return;

        const queryId = queryData.__knexQueryUid;
        const startTime = queryTimers.get(queryId);
        queryTimers.delete(queryId);
        if (!startTime) return;

        const duration = performance.now() - startTime;
        if (!errorsOnly) {
            const upperSql = queryData.sql.trim().toUpperCase();
            const queryType = logTypes.find(type => upperSql.startsWith(type)) || 'QUERY';
            logQueryDetails(queryType, response, queryData, duration);

            if (showResultTable.enabled && ['SELECT', 'UPDATE', 'INSERT'].includes(queryType) && Array.isArray(response) && response.length > 0 && typeof response[0] === 'object') {
                printTableLimited(response, showResultTable.maxRows, showResultTable.maxColumns);
            }
        }
    });

    knex.on('query-error', (error, queryData) => {

        if (!queryData) {
            console.error(`\x1b[31mQuery Error\x1b[0m (no query info):`, error.message);
            return;
        }

        const queryId = queryData.__knexQueryUid;
        queryTimers.delete(queryId);

        const formattedQuery = formatQueryWithValuesColors(queryData.sql, queryData.bindings);
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0]; // hh:mm:ss
        console.error(`\x1b[31m[${timeStr}] Query Error: ${error.sqlMessage || error.message}\x1b[0m\n${formattedQuery}`);
    });

    function printTableLimited(data, rowLimit = 5, colLimit = 5) {
        const rows = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;
        if (!Array.isArray(rows) || rows.length === 0) return console.log('📤 Response:', data);

        const limitedRows = rows.slice(0, rowLimit).map(row => {
            const limitedCols = {};
            Object.entries(row).slice(0, colLimit).forEach(([k, v]) => limitedCols[k] = v);
            return limitedCols;
        });

        console.table(limitedRows);

        // Mensagens extras de truncamento
        const originalColCount = rows[0] ? Object.keys(rows[0]).length : 0;
        const colTruncated = originalColCount > colLimit;
        const rowTruncated = rows.length > rowLimit;

        const parts = [];
        if (colTruncated) parts.push(`columns (${colLimit} of ${originalColCount})`);
        if (rowTruncated) parts.push(`rows (${rowLimit} of ${rows.length})`);

        if (parts.length > 0) {
            console.log(`... truncated ${parts.join(' and ')}`);
        }
    }
}