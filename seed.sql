-- Fictional demonstration records for Activity 7.
-- Run after schema.sql. ON CONFLICT makes repeated runs safe for these titles.
INSERT INTO records (title, category, description, status)
SELECT seed.title, seed.category, seed.description, seed.status
FROM (VALUES
  ('Understanding Java arrays', 'Programming', 'I need help understanding how arrays are declared, initialised and accessed in Java.', 'Pending'),
  ('Differentiation practice', 'Mathematics', 'I would like guidance on applying the product rule and chain rule to differentiation questions.', 'In progress'),
  ('Database normalisation', 'Databases', 'Please explain the differences between first, second and third normal forms with examples.', 'Completed'),
  ('HTML forms and validation', 'Web Development', 'I need assistance creating an HTML form and validating user input with JavaScript.', 'Pending'),
  ('IP addressing exercises', 'Networking', 'I need help solving subnetting exercises and understanding CIDR notation.', 'In progress'),
  ('Operating system processes', 'Computer Systems', 'Please help me understand process scheduling and the main scheduling algorithms.', 'Completed'),
  ('Java methods and parameters', 'Programming', 'I am struggling with method parameters, return values and method overloading.', 'Pending'),
  ('SQL joins revision', 'Databases', 'I need examples showing how INNER JOIN and LEFT JOIN work across two tables.', 'In progress')
) AS seed(title, category, description, status)
WHERE NOT EXISTS (
  SELECT 1 FROM records existing WHERE existing.title = seed.title
);
