
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
    ('Admin Principal', 'admin@examhub.com', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ', 'admin', TRUE),
    ('Rakoto Jean', 'rakoto.jean@examhub.com', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ', 'etudiant', TRUE),
    ('Rasoa Marie', 'rasoa.marie@examhub.com', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ', 'etudiant', TRUE);

INSERT INTO courses (code, name, description) VALUES
    ('PRO042', 'Développement Web', 'Introduction au développement web : HTML, CSS et bases du JavaScript.');

INSERT INTO exams (course_id, title, description, starts_at, ends_at) VALUES
    ((SELECT id FROM courses WHERE code = 'PRO042'),
     'Quiz HTML de base',
     'Répondez aux 2 questions. Une seule réponse est correcte par question.',
     NOW() - INTERVAL '1 day',
     NOW() + INTERVAL '7 days');

INSERT INTO questions (exam_id, statement, points, position) VALUES
    ((SELECT id FROM exams WHERE title = 'Quiz HTML de base'),
     'Que signifie HTML ?', 2, 1),
    ((SELECT id FROM exams WHERE title = 'Quiz HTML de base'),
     'Quelle balise HTML permet de créer un lien vers une autre page ?', 3, 2);

INSERT INTO choices (question_id, text, is_correct) VALUES
    ((SELECT id FROM questions WHERE statement = 'Que signifie HTML ?'),
     'HyperText Markup Language', TRUE),
    ((SELECT id FROM questions WHERE statement = 'Que signifie HTML ?'),
     'High Tech Modern Language', FALSE),
    ((SELECT id FROM questions WHERE statement = 'Que signifie HTML ?'),
     'Home Tool Markup Language', FALSE),
    ((SELECT id FROM questions WHERE statement = 'Que signifie HTML ?'),
     'Hyperlinks and Text Markup Language', FALSE);

INSERT INTO choices (question_id, text, is_correct) VALUES
    ((SELECT id FROM questions WHERE statement = 'Quelle balise HTML permet de créer un lien vers une autre page ?'),
     '<a>', TRUE),
    ((SELECT id FROM questions WHERE statement = 'Quelle balise HTML permet de créer un lien vers une autre page ?'),
     '<link>', FALSE),
    ((SELECT id FROM questions WHERE statement = 'Quelle balise HTML permet de créer un lien vers une autre page ?'),
     '<href>', FALSE),
    ((SELECT id FROM questions WHERE statement = 'Quelle balise HTML permet de créer un lien vers une autre page ?'),
     '<page>', FALSE);

INSERT INTO attempts (student_id, exam_id, score, submitted_at) VALUES
    ((SELECT id FROM users WHERE email = 'rakoto.jean@examhub.com'),
     (SELECT id FROM exams WHERE title = 'Quiz HTML de base'),
     5,
     NOW() - INTERVAL '2 hours');

INSERT INTO answers (attempt_id, question_id, choice_id) VALUES
    ((SELECT id FROM attempts
        WHERE student_id = (SELECT id FROM users WHERE email = 'rakoto.jean@examhub.com')
          AND exam_id = (SELECT id FROM exams WHERE title = 'Quiz HTML de base')),
     (SELECT id FROM questions WHERE statement = 'Que signifie HTML ?'),
     (SELECT id FROM choices WHERE text = 'HyperText Markup Language')),

    ((SELECT id FROM attempts
        WHERE student_id = (SELECT id FROM users WHERE email = 'rakoto.jean@examhub.com')
          AND exam_id = (SELECT id FROM exams WHERE title = 'Quiz HTML de base')),
     (SELECT id FROM questions WHERE statement = 'Quelle balise HTML permet de créer un lien vers une autre page ?'),
     (SELECT id FROM choices WHERE text = '<a>'));