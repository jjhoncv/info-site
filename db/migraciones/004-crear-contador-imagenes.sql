-- Imágenes subidas desde la última restauración (tope de la demo: 30). Una sola fila; el tope se
-- aplica con un UPDATE atómico, porque Netlify corre varias funciones a la vez.
CREATE TABLE upload_counter (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  total INT UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO upload_counter (id, total) VALUES (1, 0);
