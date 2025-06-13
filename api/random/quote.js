module.exports = {
  name: "Quote",
  desc: "Get a random inspirational quote",
  category: "Random",
  async run(req, res) {
    try {
      logRequest(req.path);
      
      const quotes = [
        {
          "quote": "The only way to do great work is to love what you do.",
          "author": "Steve Jobs",
        },
        {
          "quote": "Life is what happens when you're busy making other plans.",
          "author": "John Lennon",
        },
        {
          "quote": "The future belongs to those who believe in the beauty of their dreams.",
          "author": "Eleanor Roosevelt",
        },
        {
          "quote": "In the end, it's not the years in your life that count. It's the life in your years.",
          "author": "Abraham Lincoln",
        },
        {
          "quote": "The purpose of our lives is to be happy.",
          "author": "Dalai Lama",
        },
        {
          "quote": "Get busy living or get busy dying.",
          "author": "Stephen King",
        },
        {
          "quote": "You only live once, but if you do it right, once is enough.",
          "author": "Mae West",
        },
        {
          "quote":
            "Many of life's failures are people who did not realize how close they were to success when they gave up.",
          "author": "Thomas A. Edison",
        },
        {
          "quote": "If you want to live a happy life, tie it to a goal, not to people or things.",
          "author": "Albert Einstein",
        },
        {
          "quote": "Never let the fear of striking out keep you from playing the game.",
          "author": "Babe Ruth",
        },
        {
          "quote": "Your time is limited, don't waste it living someone else's life.",
          "author": "Steve Jobs",
        },
        {
          "quote": "The best way to predict the future is to create it.",
          "author": "Peter Drucker",
        },
        {
          "quote": "The journey of a thousand miles begins with one step.",
          "author": "Lao Tzu",
        },
        {
          "quote": "The only impossible journey is the one you never begin.",
          "author": "Tony Robbins",
        },
        {
          "quote": "The mind is everything. What you think you become.",
          "author": "Buddha",
        },
        {
          "quote": "Power comes in response to a need, not a desire. You have to create that need.",
          "author": "Goku (Dragon Ball Z)"
        },
        {
          "quote": "A lesson without pain is meaningless. That's because you can't gain something without sacrificing something else.",
          "author": "Edward Elric (Fullmetal Alchemist: Brotherhood)"
        },
        {
          "quote": "Hard work betrays none, but dreams betray many.",
          "author": "Hachiman Hikigaya (Oregairu)"
        },
        {
          "quote": "Fear is not evil. It tells you what your weakness is. And once you know your weakness, you can become stronger as well as kinder.",
          "author": "Gildarts Clive (Fairy Tail)"
        },
        {
          "quote": "A person grows up when he's able to overcome hardships. Protection is important, but there are some things a person must learn on his own.",
          "author": "Jiraiya (Naruto)"
        },
        {
          "quote": "The world isn’t perfect. But it’s there for us, doing the best it can… that’s what makes it so damn beautiful.",
          "author": "Roy Mustang (Fullmetal Alchemist: Brotherhood)"
        },
        {
          "quote": "I want to be the kind of person who can reach out and take what I want with my own hands.",
          "author": "Misaki Ayuzawa (Kaichou wa Maid-sama!)"
        },
        {
          "quote": "Do not pray for an easy life, pray for the strength to endure a difficult one.",
          "author": "Bruce Lee"
        },
        {
          "quote": "The only limit to our realization of tomorrow is our doubts of today.",
          "author": "Franklin D. Roosevelt"
        },
        {
          "quote": "I have not failed. I've just found 10,000 ways that won't work.",
          "author": "Thomas Edison"
        },
        {
          "quote": "The future belongs to those who believe in the beauty of their dreams.",
          "author": "Eleanor Roosevelt"
        },
        {
          "quote": "Don’t fear failure. Not failure, but low aim, is the crime. In great attempts, it is glorious even to fail.",
          "author": "Bruce Lee"
        },
        {
          "quote": "To know sorrow is not terrifying. What is terrifying is to know you can't go back to happiness you could have.",
          "author": "Matsumoto Rangiku (Bleach)"
        },
        {
          "quote": "A lesson you learned from pain is not easily forgotten.",
          "author": "Kakashi Hatake (Naruto)"
        },
        {
          "quote": "It's not the face that makes someone a monster; it's the choices they make with their lives.",
          "author": "Naruto Uzumaki (Naruto)"
        },
        {
          "quote": "Success is not in what you have, but who you are.",
          "author": "Bo Bennett"
        },
        {
          "quote": "The harder you work for something, the greater you'll feel when you achieve it.",
          "author": "Anonymous"
        },
        {
          "quote": "Dream big and dare to fail.",
          "author": "Norman Vaughan"
        },
        {
          "quote": "Believe you can and you're halfway there.",
          "author": "Theodore Roosevelt"
        },
        {
          "quote": "A person who never made a mistake never tried anything new.",
          "author": "Albert Einstein"
        },
        {
          "quote": "Life is what we make it, always has been, always will be.",
          "author": "Grandma Moses"
        },
        {
          "quote": "Do not wait to strike till the iron is hot, but make it hot by striking.",
          "author": "William Butler Yeats"
        },
        {
          "quote": "We may encounter many defeats, but we must not be defeated.",
          "author": "Maya Angelou"
        },
        {
          "quote": "Success usually comes to those who are too busy to be looking for it.",
          "author": "Henry David Thoreau"
        },
        {
          "quote": "What you get by achieving your goals is not as important as what you become by achieving your goals.",
          "author": "Zig Ziglar"
        },
        {
          "quote": "Nothing in the world can take the place of Persistence. Talent will not; nothing is more common than unsuccessful men with talent. Genius will not; unrewarded genius is almost a proverb. Education will not; the world is full of educated derelicts. The slogan 'Press On' has solved and always will solve the problems of the human race.",
          "author": "Calvin Coolidge"
        },
        {
          "quote": "Your passion is waiting for your courage to catch up.",
          "author": "Isabelle Lafleche"
        },
        {
          "quote": "Success is the sum of small efforts, repeated day in and day out.",
          "author": "Robert Collier"
        },
        {
          "quote": "The only way to achieve the impossible is to believe it is possible.",
          "author": "Charles Kingsleigh"
        },
        {
          "quote": "Perseverance is not a long race; it is many short races one after the other.",
          "author": "Walter Elliot"
        },
        {
          "quote": "The way to get started is to quit talking and begin doing.",
          "author": "Walt Disney"
        },
        {
          "quote": "You are braver than you believe, stronger than you seem, and smarter than you think.",
          "author": "A.A. Milne"
        },
        {
          "quote": "Challenges are what make life interesting and overcoming them is what makes life meaningful.",
          "author": "Joshua J. Marine"
        },
        {
          "quote": "In the middle of every difficulty lies opportunity.",
          "author": "Albert Einstein"
        },
        {
          "quote": "It’s not whether you get knocked down, it’s whether you get up.",
          "author": "Vince Lombardi"
        },
        {
          "quote": "Everything you can imagine is real.",
          "author": "Pablo Picasso"
        },
        {
          "quote": "In the end, we only regret the chances we didn’t take.",
          "author": "Lewis Carroll"
        },
        {
          "quote": "Success is not the key to happiness. Happiness is the key to success.",
          "author": "Albert Schweitzer"
        },
        {
          "quote": "There are no shortcuts to any place worth going.",
          "author": "Beverly Sills"
        },
        {
          "quote": "The best way to predict the future is to create it.",
          "author": "Abraham Lincoln"
        },
        {
          "quote": "To be the best, you must be able to handle the worst.",
          "author": "Wilson Kanadi"
        },
        {
          "quote": "Opportunities don't happen, you create them.",
          "author": "Chris Grosser"
        },
        {
          "quote": "Don't stop when you're tired. Stop when you're done.",
          "author": "Anonymous"
        },
        {
          "quote": "Hardships often prepare ordinary people for an extraordinary destiny.",
          "author": "C.S. Lewis"
        },
        {
          "quote": "The best time to plant a tree was 20 years ago. The second best time is now.",
          "author": "Chinese Proverb"
        },
        {
          "quote": "Life isn’t about waiting for the storm to pass, it’s about learning how to dance in the rain.",
          "author": "Vivian Greene"
        },
        {
          "quote": "A person who never made a mistake never tried anything new.",
          "author": "Albert Einstein"
        },
        {
          "quote": "Power is not determined by your size, but the size of your heart and dreams.",
          "author": "Luffy (One Piece)"
        },
        {
          "quote": "A person grows when they’re able to overcome hardships. Protection is important, but there are some things a person must learn on his own.",
          "author": "Jiraiya (Naruto)"
        },
        {
          "quote": "It’s not the world that’s messed up; it’s those of us in it.",
          "author": "Johan Liebert (Monster)"
        },
        {
          "quote": "Fear is freedom! Subjugation is liberation! Contradiction is truth! These are the facts of this world!",
          "author": "Satsuki Kiryuuin (Kill la Kill)"
        },
        {
          "quote": "You should enjoy the little detours. Because that's where you'll find the things more important than what you want.",
          "author": "Ging Freecss (Hunter x Hunter)"
        },
        {
          "quote": "A lesson learned the hard way is a lesson you'll never forget.",
          "author": "Kaname Tosen (Bleach)"
        },
        {
          "quote": "A man grows up when he learns to overcome hardships.",
          "author": "Gendo Ikari (Evangelion)"
        },
        {
          "quote": "A person becomes strong when they have someone they want to protect.",
          "author": "Haku (Naruto)"
        },
        {
          "quote": "Pain is something man must endure in his heart. And since the heart feels pain so easily, some believe life is pain.",
          "author": "Jet Black (Cowboy Bebop)"
        },
        {
          "quote": "Whether a fish lives in a clear stream or a water ditch, so long as it continues swimming forward, it will grow up beautifully.",
          "author": "Koro-sensei (Assassination Classroom)"
        },
        {
          "quote": "The world isn’t perfect. That’s why it’s beautiful.",
          "author": "Roy Mustang (Fullmetal Alchemist: Brotherhood)"
        },
        {
          "quote": "No one knows what the future holds. That's why its potential is infinite.",
          "author": "Rintarou Okabe (Steins;Gate)"
        },
        {
          "quote": "The world is not beautiful. Therefore, it is.",
          "author": "Kino (Kino no Tabi)"
        },
        {
          "quote": "Even if I can’t do it now, I’ll get stronger and stronger until I can. That’s the spirit of a ninja.",
          "author": "Rock Lee (Naruto)"
        },
        {
          "quote": "Those who stand at the top determine what’s wrong and what’s right!",
          "author": "Light Yagami (Death Note)"
        },
        {
          "quote": "Power without justice is meaningless. Justice without power is weak.",
          "author": "Lelouch Lamperouge (Code Geass)"
        },
        {
          "quote": "The world is not something that is given to you, it is something you have to win.",
          "author": "Sunrise (Code Geass Subtitle Line)"
        },
        {
          "quote": "Sometimes, the questions are complicated – and the answers are simple.",
          "author": "Ginko (Mushishi)"
        },
        {
          "quote": "Even if I can’t save everyone, I want to be someone who saves people.",
          "author": "Izuku Midoriya (My Hero Academia)"
        },
        {
          "quote": "Forgetting is like a wound. The wound may heal, but it has already left a scar.",
          "author": "Monkey D. Luffy (One Piece)"
        }
      ];

      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

      return res.status(200).json({
        status: true,
        result: randomQuote,
      })
      
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message })
    }
  },
}
