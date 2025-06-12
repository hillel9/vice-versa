    console.clear();
    console.log("Starting script");

    const screen1 = document.getElementById('screen-1');
    const screen2 = document.getElementById('screen-2');
    const screen3 = document.getElementById('screen-3');
    const screen4 = document.getElementById('screen-4');
    const screen5 = document.getElementById('screen-5');
    const screen6 = document.getElementById('screen-6');
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
        honestReviewer: "",
        choices: []
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
        responseMessage.textContent = 'Ok I send your request to the AI... Hopefully I will get a valid json response... god knows...';

        try {
            // Build the prompt right before sending
            const prompt = instructions.objective + instructions.topics + userData.tags.join(', ') + ". " + instructions.format;
            
            const dataToSend = {
                request: prompt,
                honestReviewer: userData.honestReviewer
            };

            const data = await sendToWebhook(dataToSend);
            
            buildSlates(data);

            // Display the title from the response
            // responseMessage.textContent = data['set-1']['option-1'] + " vs " + data['set-1']['option-2'];
            screen5.classList.remove('active');
            screen6.classList.add('active');

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

    function buildSlates(data) {
        const slatesContainer = document.getElementById('slates-container');
        slatesContainer.innerHTML = '';
        userData.choices = [];

        const sets = Object.keys(data);

        sets.forEach((setKey, index) => {
            const slate = document.createElement('div');
            slate.classList.add('slate');
            if (index === 0) {
                slate.classList.add('current');
            }
            slate.dataset.setKey = setKey;

            const options = data[setKey];
            const option1Text = options['option-1'];
            const option2Text = options['option-2'];

            slate.innerHTML = `
                <div class="option" data-option="option-1">${option1Text}</div>
                <div class="option" data-option="option-2">${option2Text}</div>
            `;

            slatesContainer.appendChild(slate);
        });

        addSlateEventListeners();
    }

    function addSlateEventListeners() {
        const options = document.querySelectorAll('#screen-6 .option');
        options.forEach(option => {
            option.addEventListener('click', handleOptionClick);
        });
    }

    function handleOptionClick(e) {
        const clickedOption = e.target;
        const slate = clickedOption.closest('.slate');
        const nextSlate = slate.nextElementSibling;
        const setKey = slate.dataset.setKey;

        const option1Text = slate.querySelector('[data-option="option-1"]').textContent;
        const option2Text = slate.querySelector('[data-option="option-2"]').textContent;
        const selectedAnswer = clickedOption.textContent;

        userData.choices.push({
            set: setKey,
            'option-1': option1Text,
            'option-2': option2Text,
            selected: selectedAnswer
        });

        if (nextSlate && nextSlate.classList.contains('slate')) {
            slate.classList.remove('current');
            slate.classList.add('previous');
            nextSlate.classList.add('current');
        } else {
            // Last slate
            console.log('All choices made. The final data object is available in `userData`:', userData);
            // What to do next? For now, we can just log it.
            // Maybe go to a "Thank you" screen.
            setTimeout(() => {
                screen6.classList.remove('active');
                // For now, let's just clear the screen. A new "thank you" screen would be better.
                 document.body.innerHTML = '<h1 style="color:#000; text-align:center; margin-top: 50vh; transform: translateY(-50%);">Thank you for your submission!</h1>';
            }, 500);
        }
    }

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