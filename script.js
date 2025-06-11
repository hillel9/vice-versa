document.getElementById('sendButton').addEventListener('click', function() {
    const textToSend = document.getElementById('textInput').value;
    // TODO: Replace with your Make.com webhook URL
    const webhookURL = 'YOUR_MAKE_COM_WEBHOOK_URL';

    if (!textToSend) {
        alert('Please enter some text.');
        return;
    }
    
    if (webhookURL === 'YOUR_MAKE_COM_WEBHOOK_URL') {
        alert('Please replace "YOUR_MAKE_COM_WEBHOOK_URL" with your actual webhook URL in the script.');
        return;
    }

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "text": textToSend })
    })
    .then(response => {
        if (response.ok) {
            alert('Text sent successfully!');
            document.getElementById('textInput').value = ''; // Clear input field
        } else {
            response.text().then(text => alert('Failed to send text: ' + text));
        }
    })
    .catch(error => {
        console.error('Error sending text:', error);
        alert('An error occurred while sending the text.');
    });
}); 