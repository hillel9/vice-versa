const topics = ['Brands', 'Guilty pleasures', 'Things that make you cry', 'Harry Potter', 'Smells', 'SQL Clauses', 'Beatles songs','Things you would do for love','Things you would do for money', '90s villains', 'U2', 'Footabl Clubs','Disney Movies', 'Nirvana', 'Breakfast crimes', 'French desert', 'Kaltura', 'Desert island items', 'Rock bands', 'Midnight snack decisions', 'Cursed kitchen gadgets'];
const reviewers = ['Gordon Ramsay','Joe Rogan','Donald Trump', 'Nick Cave', 'Quentin Tarantino', 'Serge le mytho', 'Morgan Freeman','Homer Simpson','Victor Hugo','Schwarzie','Jim Carrey','Albert Camus','Socrates'];


const instructions = {
    objective: `Create a Konbini-style "Fast & Curious" game. Return 8 rapid-fire 'this or that' questions in JSON format. Each question should offer two interesting and contrasting options that would spark a difficult choice. Use a mix of pop culture, lifestyle, food, tech, art, and philosophical dilemmas. Options should be 3 words max.`,
    topics: "Pick a this or that option based on the following topics: ",
    format: `JSON object in the following format: {
      "set-1": {
        "option-1": "Star Wars",
        "option-2": "Star Trek"
      },
      "set-2": {
        "option-1": "Coffee at midnight",
        "option-2": "Wine at breakfast"
      }
    }
    The response must be **valid JSON only**, with no comments, no extra characters, no triple dots, no markdown.  `
  };

  const guidance = `Based on the user answers below, write a short, bold, and funny review of their personality.
  In english only. The length should be 100 words max. Keep it between 5 or 6 sentences. 
  Dont use bold or italic. Dont use markdown.
  Begin immediately with the first sentence of the review.
  Do not name specific choices the user made. Instead, interpret them to reveal underlying values, behaviors, contradictions, or quirks.
  Each sentence should pack personality but remain punchy and clear. Sprinkle in tons of humor.
  End with a killer last line.
  The tone of voice should use the following character: `