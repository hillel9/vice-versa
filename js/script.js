    console.clear();
    console.log("Starting script");

    const screen1 = document.getElementById('screen-1');
    const screen2 = document.getElementById('screen-2');
    const screen3 = document.getElementById('screen-3');
    const screen4 = document.getElementById('screen-4');
    const screen5 = document.getElementById('screen-5');
    const screen6 = document.getElementById('screen-6');
    const screen7 = document.getElementById('screen-7');
    const continueBtn2 = document.getElementById('continue-btn-2');
    const continueBtn3 = document.getElementById('continue-btn-3');
    const continueBtn = document.getElementById('continue-btn');
    const tagsContainer = document.querySelector('#screen-2 .tags-container');
    const reviewerTagsContainer = document.querySelector('#screen-3 .tags-container');
    const submitYesBtn = document.getElementById('submit-yes');
    const submitNoBtn = document.getElementById('submit-no');
    const responseMessage = document.getElementById('response-message');
    const finalResponseContainer = document.getElementById('final-response-container');

   let countdownInterval;
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
        window.scrollTo(0, 0);
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
        responseMessage.textContent = "Loading... Be prepared to be roasted.";

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
                <div class="timer">
                    <span class="timer-countdown">- 05</span>
                </div>
                <div class="option" data-option="option-2">${option2Text}</div>
            `;

            slatesContainer.appendChild(slate);
        });

        addSlateEventListeners();

        const firstSlate = slatesContainer.querySelector('.slate.current');
        if (firstSlate) {
            startCountdown(firstSlate);
        }
    }

    function addSlateEventListeners() {
        const options = document.querySelectorAll('#screen-6 .option');
        options.forEach(option => {
            option.addEventListener('click', handleOptionClick);
        });
    }

    async function handleOptionClick(e) {
        clearInterval(countdownInterval); // User made a choice, so stop the timer.

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
            startCountdown(nextSlate); // Start the timer for the new slate
        } else {
            // Last slate
            await endActivity();
        }
    }

    function startCountdown(slate) {
        clearInterval(countdownInterval); // Clear any previous interval

        const timerDisplay = slate.querySelector('.timer-countdown');
        let seconds = 10;

        const updateTimerDisplay = () => {
            const formattedSeconds = String(seconds).padStart(2, '0');
            timerDisplay.textContent = `${formattedSeconds}`;
        };

        updateTimerDisplay(); // Initial display

        countdownInterval = setInterval(() => {
            seconds--;
            updateTimerDisplay();

            if (seconds < 0) { // Use < 0 to allow the "00" to be displayed for one second
                clearInterval(countdownInterval);
                // Programmatically click the first option to move to the next slate
                const firstOption = slate.querySelector('[data-option="option-1"]');
                if(firstOption) {
                    firstOption.click();
                }
            }
        }, 1000);
    }

    async function endActivity() {
        if (countdownInterval) clearInterval(countdownInterval); // Ensure no timers are left running

        console.log('All choices made. The final data object is available in `userData`:', userData);
        
        // Transition to the final screen
        screen6.classList.remove('active');
        screen7.classList.add('active');
        const finalResponseMessage = document.getElementById('final-response-loading');
        finalResponseMessage.textContent = 'Analyzing your choices...';

        const shareBtn = document.getElementById('share-btn');
        shareBtn.style.display = 'none';

        // Properly stringify the choices object to be included in the prompt
        const choicesText = JSON.stringify(userData.choices, null, 2); // Using JSON.stringify for a clean format
        const finalPrompt = {
            title: guidance.title + userData.honestReviewer,
            body: guidance.body + userData.honestReviewer + "\n\n" + choicesText,
        }
        console.log(finalPrompt);

        try {
            // Send the collected data as a structured object
            const finalResponse = await sendResultsToWebhook(finalPrompt);
            // Assuming the response is JSON with a 'message' field to display
            console.log(finalResponse.title);

            finalResponseMessage.style.display = 'none';
            finalResponseContainer.style.display = 'block';
            shareBtn.style.display = 'block';

            // Create title element
            const reviewerName = document.createElement('h2');
            reviewerName.textContent = userData.honestReviewer;
            reviewerName.classList.add('reviewer-name'); // optional styling class

            // Create review title
            const reviewTitle = document.createElement('h3');
            reviewTitle.textContent = finalResponse.title;
            reviewTitle.classList.add('review-title'); // optional styling class

            // Create review body
            const reviewBody = document.createElement('p');
            reviewBody.textContent = finalResponse.body;
            reviewBody.classList.add('review-body'); // optional styling class

            // Append to the screen
            const reviewHeader = document.getElementById('review-header');
            const reviewBodyContainer = document.getElementById('review-body-container');
            
            reviewHeader.appendChild(reviewTitle);
            reviewHeader.appendChild(reviewerName);
            reviewBodyContainer.appendChild(reviewBody);
            

        } catch (error) {
            console.error('Error sending final results:', error);
            finalResponseMessage.textContent = `An error occurred while sending your results: ${error.message}`;
        }
    }

    document.getElementById('share-btn').addEventListener('click', () => {
        const responseContainer = document.getElementById('final-response-container');
        html2canvas(responseContainer, {
            // Options to improve image quality
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff' // Match the container background
        }).then(canvas => {
            // Create a link to download the image
            const link = document.createElement('a');
            link.download = 'vice-versa-review.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
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
            console.error("Failed to parse JSON. The server responded with:", responseData);
            throw new Error(`The server response was not valid JSON. Please check the 'Webhook Response' module in your Make.com scenario. Response: "${JSON.stringify(responseData)}"`);
        }
    }

    async function sendResultsToWebhook(data) {
       
        const webhookURL = 'https://hook.eu2.make.com/dci9m7jp6ybja4gbpcign5j72t2jobbr';

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

        return response.json();
    } 