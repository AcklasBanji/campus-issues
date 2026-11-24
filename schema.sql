-- Study Support Requests database table.
-- Run this file once against the PostgreSQL database.
CREATE TABLE IF NOT EXISTS records (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(80) NOT NULL,
    category VARCHAR(40) NOT NULL,
    description VARCHAR(300) NOT NULL,
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('Pending', 'In progress', 'Completed')),
    CONSTRAINT title_length CHECK (char_length(btrim(title)) BETWEEN 3 AND 80),
    CONSTRAINT category_length CHECK (char_length(btrim(category)) BETWEEN 2 AND 40),
    CONSTRAINT description_length CHECK (char_length(btrim(description)) BETWEEN 5 AND 300)
);
