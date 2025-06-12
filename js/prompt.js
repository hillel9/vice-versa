const instructions = {
    objective: `Create a Konbini-style "Fast & Curious" game. Return 10 rapid-fire 'this or that' questions in JSON format. Each question should offer two interesting and contrasting options that would spark a difficult choice. Use a mix of pop culture, lifestyle, food, tech, art, and philosophical dilemmas. Options should be short and concise.`,
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