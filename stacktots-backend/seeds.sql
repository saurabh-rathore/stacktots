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

-- Quizzes
INSERT INTO content (title, description, type, data) VALUES
('Animal Quiz', 'Test your knowledge of animals.', 'quiz', '{
  "questions": [
    {
      "question": "What is the largest land animal?",
      "options": ["Elephant", "Giraffe", "Hippo"],
      "answer": "Elephant"
    },
    {
      "question": "Which bird can fly backwards?",
      "options": ["Sparrow", "Hummingbird", "Eagle"],
      "answer": "Hummingbird"
    }
  ]
}'),
('Math Quiz', 'Solve these simple math problems.', 'quiz', '{
  "questions": [
    {
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5"],
      "answer": "4"
    },
    {
      "question": "What is 10 - 5?",
      "options": ["5", "6", "7"],
      "answer": "5"
    }
  ]
}');

-- Puzzles
INSERT INTO content (title, description, type, data) VALUES
('Jigsaw Puzzle', 'Put the pieces together to reveal the image.', 'puzzle', '{
  "image": "https://picsum.photos/400/400?random=10"
}'),
('Word Search', 'Find the hidden words in the grid.', 'puzzle', '{
  "words": ["cat", "dog", "bat", "rat"]
}');

-- Cartoons
INSERT INTO content (title, description, type, url) VALUES
('Titipo Titipo', 'A little train learning about the world.', 'cartoon', 'https://www.youtube.com/watch?v=xxxxxxxx'),
('Pororo the Little Penguin', 'Adventures of a curious little penguin.', 'cartoon', 'https://www.youtube.com/watch?v=yyyyyyyy'),
('Tayo the Little Bus', 'A friendly little bus exploring the city.', 'cartoon', 'https://www.youtube.com/watch?v=zzzzzzzz');
