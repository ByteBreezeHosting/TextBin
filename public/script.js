document.addEventListener('DOMContentLoaded', function () {
    const inputText = document.getElementById('inputText');
    const saveButton = document.getElementById('saveButton');
    const notification = document.getElementById('notification');

    saveButton.addEventListener('click', function (event) {

        if (inputText.value.trim() === '') {
            showNotification('Text cannot be empty');
            event.preventDefault(); 
        } else {

            saveText();
        }
    });

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(function () {
            notification.style.display = 'none';
        }, 1000);
    }

    function saveText() {
        const randomLink = generateRandomLink();
        const link = window.location.origin + '/' + randomLink;

        console.log('Your text has been saved. Share this link:', link);
    }

    function generateRandomLink() {
        return Math.random().toString(36).substring(2, 8);
    }
});

function toggleRawText() {
    const contentElement = document.getElementById('content');
    contentElement.classList.toggle('raw-mode');
}
