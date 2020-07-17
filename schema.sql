CREATE DATABASE reviews_database;

USE reviews_database;

DROP TABLE IF EXISTS reviews;
CREATE TABLE IF NOT EXISTS events(
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT,
  date DATE,
  summary VARCHAR(256),
  body VARCHAR(4096) CHARACTER SET utf8 COLLATE utf8_general_ci,
  recommend VARCHAR(5),
  reported VARCHAR(5),
  reviewer_name VARCHAR(64),
  reviewer_email VARCHAR(64),
  response VARCHAR(4096),
  helpfulness INT
);