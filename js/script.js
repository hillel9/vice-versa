    console.clear();
    console.log("Starting script");

    const screen1 = document.getElementById('screen-1');
    const screen2 = document.getElementById('screen-2');
    const screen3 = document.getElementById('screen-3');
    const screen4 = document.getElementById('screen-4');
    const screen5 = document.getElementById('screen-5');
    const continueBtn2 = document.getElementById('continue-btn-2');
    const continueBtn3 = document.getElementById('continue-btn-3');
    const continueBtn = document.getElementById('continue-btn');
    const tagsContainer = document.querySelector('#screen-2 .tags-container');
    const reviewerTagsContainer = document.querySelector('#screen-3 .tags-container');
    const submitYesBtn = document.getElementById('submit-yes');
    const submitNoBtn = document.getElementById('submit-no');
    const responseMessage = document.getElementById('response-message');

    const topics = ['U2', 'Tarantino', 'Tennis', 'Whiskey', 'Harry Potter', 'SQL Clauses', 'Philosopher with a mustache', 'Nirvana', 'Italian food', 'French desert', 'Kaltura', 'Red hot chili peppers', 'Jim Carrey', 'Pokemons', 'Video codecs'];
    const reviewers = ['Bono', 'Serge', 'Michel'];
    const userData = {
        tags: [],
        honestReviewer: ""
    };
    // Continue to the next screen
    continueBtn.addEventListener('click', () => {
        screen1.classList.remove('active');
        screen2.classList.add('active');
    });

    // Populate tags
    topics.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        tagElement.textContent = tag;
        tagElement.dataset.tag = tag;
        tagsContainer.appendChild(tagElement);
    });

    // Populate reviewers
    reviewers.forEach(reviewer => {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        tagElement.textContent = reviewer;
        tagElement.dataset.reviewer = reviewer;
        reviewerTagsContainer.appendChild(tagElement);
    });

    // Handle tag selection
    tagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag')) {
            const tagEl = e.target;
            const tagName = tagEl.dataset.tag;

            tagEl.classList.toggle('selected');

            if (tagEl.classList.contains('selected')) {
                userData.tags.push(tagName);
            } else {
                userData.tags = userData.tags.filter(t => t !== tagName);
            }
            console.log('User data:', userData);
        }
    });

    // Handle reviewer selection
    reviewerTagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag')) {
            const clickedTag = e.target;
            const reviewerName = clickedTag.dataset.reviewer;
            const currentlySelectedTag = reviewerTagsContainer.querySelector('.tag.selected');

            if (currentlySelectedTag && currentlySelectedTag !== clickedTag) {
                currentlySelectedTag.classList.remove('selected');
            }

            clickedTag.classList.toggle('selected');

            if (clickedTag.classList.contains('selected')) {
                userData.honestReviewer = reviewerName;
            } else {
                userData.honestReviewer = "";
            }
        }
    });

    // Go to the final confirmation screen
    continueBtn2.addEventListener('click', () => {
        // Go to the final confirmation screen
        screen2.classList.remove('active');
        screen3.classList.add('active');
    });

    continueBtn3.addEventListener('click', () => {
        // Go to the final confirmation screen
        screen3.classList.remove('active');
        screen4.classList.add('active');
    });

    // Send the data to the webhook and get a response
    submitYesBtn.addEventListener('click', async () => {
        console.log("Sending data to webhook");
        // Switch to the final waiting screen
        screen4.classList.remove('active');
        screen5.classList.add('active');
        responseMessage.textContent = 'Waiting for response...';

        try {
            // Build the prompt right before sending
            const prompt = instructions.objective + instructions.topics + userData.tags.join(', ') + ". " + instructions.format;
            
            const dataToSend = {
                request: prompt,
                honestReviewer: userData.honestReviewer
            };

            const data = await sendToWebhook(dataToSend);
            
            // Display the title from the response
            responseMessage.textContent = data['set-1']['option-1'] + " vs " + data['set-1']['option-2'];
            


        } catch (error) {
            console.error('Error:', error);
            responseMessage.textContent = `An error occurred: ${error.message}`;
        }
    });

    submitNoBtn.addEventListener('click', () => {
        // Go back to the tag selection screen
        screen3.classList.remove('active');
        screen2.classList.add('active');
    });


async function sendToWebhook(data) {
    const webhookURL = 'https://hook.eu2.make.com/u3p5qrumv6aawha7nmg9kfypjmielamt';

    const response = await fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }
    
    // Get the response as JSON
    const responseData = await response.json();

    try {
        // Try to parse the text as JSON
        //return JSON.parse(responseText);
        return responseData;
    } catch (error) {
        // If parsing fails, it's not valid JSON.
        console.error("Failed to parse JSON. The server responded with:", responseText);
        throw new Error(`The server response was not valid JSON. Please check the 'Webhook Response' module in your Make.com scenario. Response: "${responseText}"`);
    }
} 