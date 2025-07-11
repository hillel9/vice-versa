const topics = ['Brands', 'Guilty pleasures', 'Harry Potter', 'Smells', 'SQL Clauses', 'Beatles songs','Things you\'d do for love','Things you\'d do for money','Fears', '90s villains','Alter egos', 'U2','TV Shows','Memes', 'Football Clubs','Disney Movies', 'Nirvana', 'Breakfast crimes', 'French patisserie', 'Kaltura', 'Desert island items', 'Rock bands', 'Midnight snack', 'Kitchen gadgets','CSS properties'];
const reviewers = ['Gordon Ramsay','Joe Rogan','Donald Trump','Yoda','Phoebe Buffay', 'Nick Cave','The Dude', 'Quentin Tarantino', 'Serge le mytho', 'Morgan Freeman','Homer Simpson','Victor Hugo','Schwarzie','Jim Carrey','Albert Camus','Socrates'];


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

  const guidance = {
    title: `Write an impactful and funny short title of the following review. 
    Keep it under 6 words. 
    It should feel personal, funny, or strange — not corporate or generic. 
    Use the tone of voice and style of: `,
    titleFormat: `The title should be a string, with no comments, no extra characters, no triple dots, no markdown.`,
    body: `Based on the user answers below, write a short, bold, and funny review of their personality.
  In english only. The length should be 100 words max. Keep it between 5 or 6 sentences. 
  Dont use bold or italic. Dont use markdown.
  Begin immediately with the first sentence of the review.
  Do not name specific choices the user made. Instead, interpret them to reveal underlying values, behaviors, contradictions, or quirks.
  Each sentence should pack personality but remain punchy and clear. Sprinkle in tons of humor. Use maximum 5 emojis.
  End with a killer last line.
  The tone of voice should use the following character: `
  }