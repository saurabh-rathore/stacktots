USE stacktots;

-- Stories
INSERT INTO content (title, description, type, url) VALUES
('The Lion and the Mouse', 'A classic fable about kindness.', 'story', 'https://picsum.photos/200/300?random=1'),
('The Tortoise and the Hare', 'A story about perseverance.', 'story', 'https://picsum.photos/200/300?random=2'),
('The Boy Who Cried Wolf', 'A tale about the importance of honesty.', 'story', 'https://picsum.photos/200/300?random=3');

-- Games
INSERT INTO content (title, description, type, url) VALUES
('Alphabet Matching', 'Match the letters of the alphabet.', 'game', 'https://picsum.photos/200/300?random=4'),
('Number Counting', 'Count the objects and select the correct number.', 'game', 'https://picsum.photos/200/300?random=5'),
('Shape Sorting', 'Sort the shapes into the correct boxes.', 'game', 'https://picsum.photos/200/300?random=6');

-- Rhymes
INSERT INTO content (title, description, type, url) VALUES
('Twinkle, Twinkle, Little Star', 'A classic nursery rhyme.', 'rhyme', 'https://picsum.photos/200/300?random=7'),
('Baa, Baa, Black Sheep', 'A popular nursery rhyme.', 'rhyme', 'https://picsum.photos/200/300?random=8'),
('Humpty Dumpty', 'A well-known nursery rhyme.', 'rhyme', 'https://picsum.photos/200/300?random=9');

-- Rewards
INSERT INTO rewards (name, points_cost) VALUES
('Free 1-day subscription', 100),
('Free 1-week subscription', 500),
('Unlock a special character', 200);
