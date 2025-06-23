import bcrypt from 'bcryptjs';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  //gerando hash da senha
  const password = '12345678'; // Senha padrão para todos os usuários
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await knex('users').del();
  await knex.raw(`
    INSERT INTO users (id, name, email, login, password, created_by, updated_by, deleted_by, deleted_at) VALUES
      (1, 'Alice Johnson', 'alice.johnson@example.com', 'alicej', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (2, 'Bob Smith', 'bob.smith@example.com', 'bobsmith', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (3, 'Carol White', 'carol.white@example.com', 'carolw', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (4, 'David Brown', 'david.brown@example.com', 'davidb', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (5, 'Eve Black', 'eve.black@example.com', 'eveb', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (6, 'Frank Green', 'frank.green@example.com', 'frankg', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (7, 'Grace Lee', 'grace.lee@example.com', 'gracel', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (8, 'Henry King', 'henry.king@example.com', 'henryk', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (9, 'Ivy Scott', 'ivy.scott@example.com', 'ivys', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (10, 'Jack Turner', 'jack.turner@example.com', 'jackt', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (11, 'Karen Adams', 'karen.adams@example.com', 'karena', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (12, 'Leo Brooks', 'leo.brooks@example.com', 'leob', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (13, 'Mona Clark', 'mona.clark@example.com', 'monac', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (14, 'Nina Diaz', 'nina.diaz@example.com', 'ninad', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (15, 'Oscar Evans', 'oscar.evans@example.com', 'oscare', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (16, 'Paula Fox', 'paula.fox@example.com', 'paulaf', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (17, 'Quinn Hall', 'quinn.hall@example.com', 'quinnh', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (18, 'Rita Irwin', 'rita.irwin@example.com', 'ritai', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (19, 'Sam Jones', 'sam.jones@example.com', 'samj', '${hashedPassword}', NULL, NULL, NULL, NULL),
      (20, 'Tina Kim', 'tina.kim@example.com', 'tinak', '${hashedPassword}', NULL, NULL, NULL, NULL)
  `);
}
