DROP TABLE IF EXISTS pokemon;

CREATE TABLE pokemon
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(225),
  UNIQUE (name)
);

DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(225),
  password VARCHAR(225),
  UNIQUE (name)
);
