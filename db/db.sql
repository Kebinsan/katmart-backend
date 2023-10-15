CREATE DATABASE katmart;

CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    fname VARCHAR(255),
    lname VARCHAR(255),
    phone VARCHAR(20),
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    UNIQUE(email)
);

CREATE TABLE products (
    prod_id BIGSERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    price decimal(12,2) NOT NULL,
    rating jsonb NOT NULL DEFAULT '{"rate": 0, "count": 0 }'::jsonb,
    image varchar(255),
    description VARCHAR
);
-- --Updates updated_at timestamp when called
-- CREATE FUNCTION update_updated_at_user_task()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = now();
--     RETURN NEW;
-- END;
-- $$ language 'plsql';

-- --Runs the update_updated_at_user_task function when triggered
-- CREATE TRIGGER update_user_task_updated_at
--     BEFORE UPDATE
--     ON
--         user_task
--     FOR EACH ROW
-- EXECUTE PROCEDURE update_updated_at_user_task();


SELECT*FROM users;

INSERT INTO users (username, email, password) VALUES ('kevin123', 'kevin123@email.com', '123456');


