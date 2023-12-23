// script.js
let game, canvas; // Declare canvas as a global variable

function resizeCanvas() {
    if (!canvas) return; // Check if canvas is initialized

    // Get the viewport dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Define the desired aspect ratio
    const aspectRatio = 4 / 3; // Example aspect ratio, adjust as needed

    // Adjust canvas size while maintaining the aspect ratio
    if (width / height > aspectRatio) {
        canvas.width = height * aspectRatio;
        canvas.height = height;
    } else {
        canvas.width = width;
        canvas.height = width / aspectRatio;
    }

    // Update game elements based on the new canvas size
    if (game) {
        game.updateGameElementsSize();
    }
}

window.onload = function () {
    canvas = document.getElementById('gameCanvas'); // Assign the global canvas variable
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const gameContainer = document.getElementById('gameContainer');
    const infoPanel = document.getElementById('infoPanel');
    const levelSpan = document.getElementById('levelValue');
    const scoreSpan = document.getElementById('scoreValue');
    const moneySpan = document.getElementById('moneyValue');
    const weaponSpan = document.getElementById('weaponValue');
    const buyWeaponButton = document.getElementById('buyWeaponButton');
    resizeCanvas();

    startButton.addEventListener('click', () => {
        gameContainer.classList.remove('hidden');
        startButton.style.display = 'none'; // Hide the start button
        menu.style.display = 'none'; // Hide the game title
        game = new ShootingGame(canvas, ctx, infoPanel, levelSpan, scoreSpan, moneySpan, weaponSpan, buyWeaponButton);
        resizeCanvas(); // Resize canvas when the game starts
        game.start();
    });
};

window.addEventListener('resize', resizeCanvas);