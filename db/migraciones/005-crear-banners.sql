-- Banners de la portada (módulo banners): título, frase e imagen, ordenados por posición.
CREATE TABLE banners (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  subtitle VARCHAR(160) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_alt VARCHAR(200) NOT NULL,
  position INT NOT NULL DEFAULT 0,
  visible TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NULL,
  updated_by INT UNSIGNED NULL
);
