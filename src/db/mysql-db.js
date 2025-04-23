import mysql from "mysql2/promise";
import { env } from "../env.js";

export const pool = mysql.createPool(
	env.DB_URL || {
		host: env.DB_HOST,
		port: env.DB_PORT,
		user: env.DB_USER,
		password: env.DB_PASS,
		database: env.DB_NAME,
	},
);

const createDbIfNotExists = async () => {
	const connection = await pool.getConnection();
	await connection
		.query(`CREATE DATABASE IF NOT EXISTS \`${env.DB_NAME}\``)
		.then(console.log("Database created or already exists"))
		.catch((err) => {
			console.error("Error creating database:", err);
		})
		.finally(() => {
			connection.release();
		});
};
