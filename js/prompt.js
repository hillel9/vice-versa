const topics = ['U2', 'Tarantino', 'Guilty pleasures', 'Things that make you cry', 'Harry Potter', 'SQL Clauses', '90s villains', 'Nirvana', 'Breakfast crimes', 'French desert', 'Kaltura', 'Red hot chili peppers', 'Jim Carrey', 'Pokemons', 'Video codecs'];
const reviewers = ['Gordon Ramsay', 'Nick Cave', 'Quentin Tarantino','Socrates', 'Morgan Freeman','Homer Simpson','Victor Hugo','Jim Carrey','Albert Camus','Joe Rogan','Donald Trump'];


const instructions = {
    objective: `Create a Konbini-style "Fast & Curious" game. Return 3 rapid-fire 'this or that' questions in JSON format. Each question should offer two interesting and contrasting options that would spark a difficult choice. Use a mix of pop culture, lifestyle, food, tech, art, and philosophical dilemmas. Options should be 3 words max.`,
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

  const guidance = "Based on the user answers below, write a short, bold, and funny review of their personality. The length should be 100 words max. Avoid dry analysis, cookie-cuttered summaries. The tone of voice should use the following character: "