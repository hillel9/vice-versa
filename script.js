document.addEventListener('DOMContentLoaded', () => {
    const screen1 = document.getElementById('screen-1');
    const screen2 = document.getElementById('screen-2');
    const screen3 = document.getElementById('screen-3');
    const continueBtn = document.getElementById('continue-btn');
    const finishBtn = document.getElementById('finish-btn');
    const tagsContainer = document.querySelector('#screen-2 .tags-container');
    const submitYesBtn = document.getElementById('submit-yes');
    const submitNoBtn = document.getElementById('submit-no');

    const availableTags = ['U2', 'Tarantino', 'Tennis', 'Whiskey', 'Harry Potter', 'SQL Clauses', 'Philosopher with a mustache', 'Nirvana', 'Italian food', 'French desert', 'Kaltura', 'Red hot chili peppers', 'Jim Carrey', 'Pokemons', 'Video codecs'];
    const userData = {
        tags: [],
        honestReviewer:""
    };

    // Populate tags
    availableTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        tagElement.textContent = tag;
        tagElement.dataset.tag = tag;
        tagsContainer.appendChild(tagElement);
    });

    continueBtn.addEventListener('click', () => {
        screen1.classList.remove('active');
        screen2.classList.add('active');
    });

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
    
    finishBtn.addEventListener('click', () => {
        // Go to the final confirmation screen
        screen2.classList.remove('active');
        screen3.classList.add('active');
    });

    submitYesBtn.addEventListener('click', () => {
        console.log('Final user data:', userData.tags);
        const plainTextData = userData.tags.join(', ');
        sendToWebhook(plainTextData);
        console.log(plainTextData); 
        alert('Data sent!'); 
        // Optional: Reset to the first screen
        // screen3.classList.remove('active');
        // screen1.classList.add('active');
    });

    submitNoBtn.addEventListener('click', () => {
        // Go back to the tag selection screen
        screen3.classList.remove('active');
        screen2.classList.add('active');
    });
});


function sendToWebhook(data) {
    // TODO: Replace with your Make.com webhook URL
    const webhookURL = 'YOUR_MAKE_COM_WEBHOOK_URL';
    
    if (webhookURL === 'YOUR_MAKE_COM_WEBHOOK_URL') {
        alert('Please replace "YOUR_MAKE_COM_WEBHOOK_URL" with your actual webhook URL in the script.');
        return;
    }

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            // Set the content type to plain text.
            'Content-Type': 'text/plain'
        },
        // Send the data as a plain text string.
        body: plainTextData
    })
    .then(response => {
        if (response.ok) {
            console.log('Data sent successfully!');
        } else {
            response.text().then(text => console.error('Failed to send data: ' + text));
        }
    })
    .catch(error => {
        console.error('Error sending data:', error);
    });
} 