-- Intentos fallidos de login (límite de 5 en 15 minutos). En la base, no en memoria:
-- Netlify corre varias funciones a la vez. attempted_at son milisegundos Unix (sin zonas horarias).
CREATE TABLE login_attempts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  attempted_at BIGINT NOT NULL,
  INDEX idx_login_attempts_user_time (username, attempted_at)
);
