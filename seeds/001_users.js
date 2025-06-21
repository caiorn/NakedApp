/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  await knex('users').del();
  await knex.raw(`
    INSERT INTO users (id, name, email, login, password, created_by, updated_by, deleted_by, deleted_at) VALUES
      (1, 'Alice Johnson', 'alice.johnson@example.com', 'alicej', 'password1', 'system', 'system', NULL, NULL),
      (2, 'Bob Smith', 'bob.smith@example.com', 'bobsmith', 'password2', 'system', 'system', NULL, NULL),
      (3, 'Carol White', 'carol.white@example.com', 'carolw', 'password3', 'system', 'system', NULL, NULL),
      (4, 'David Brown', 'david.brown@example.com', 'davidb', 'password4', 'system', 'system', NULL, NULL),
      (5, 'Eve Black', 'eve.black@example.com', 'eveb', 'password5', 'system', 'system', NULL, NULL),
      (6, 'Frank Green', 'frank.green@example.com', 'frankg', 'password6', 'system', 'system', NULL, NULL),
      (7, 'Grace Lee', 'grace.lee@example.com', 'gracel', 'password7', 'system', 'system', NULL, NULL),
      (8, 'Henry King', 'henry.king@example.com', 'henryk', 'password8', 'system', 'system', NULL, NULL),
      (9, 'Ivy Scott', 'ivy.scott@example.com', 'ivys', 'password9', 'system', 'system', NULL, NULL),
      (10, 'Jack Turner', 'jack.turner@example.com', 'jackt', 'password10', 'system', 'system', NULL, NULL),
      (11, 'Karen Adams', 'karen.adams@example.com', 'karena', 'password11', 'system', 'system', NULL, NULL),
      (12, 'Leo Brooks', 'leo.brooks@example.com', 'leob', 'password12', 'system', 'system', NULL, NULL),
      (13, 'Mona Clark', 'mona.clark@example.com', 'monac', 'password13', 'system', 'system', NULL, NULL),
      (14, 'Nina Diaz', 'nina.diaz@example.com', 'ninad', 'password14', 'system', 'system', NULL, NULL),
      (15, 'Oscar Evans', 'oscar.evans@example.com', 'oscare', 'password15', 'system', 'system', NULL, NULL),
      (16, 'Paula Fox', 'paula.fox@example.com', 'paulaf', 'password16', 'system', 'system', NULL, NULL),
      (17, 'Quinn Hall', 'quinn.hall@example.com', 'quinnh', 'password17', 'system', 'system', NULL, NULL),
      (18, 'Rita Irwin', 'rita.irwin@example.com', 'ritai', 'password18', 'system', 'system', NULL, NULL),
      (19, 'Sam Jones', 'sam.jones@example.com', 'samj', 'password19', 'system', 'system', NULL, NULL),
      (20, 'Tina Kim', 'tina.kim@example.com', 'tinak', 'password20', 'system', 'system', NULL, NULL)
  `);
}
