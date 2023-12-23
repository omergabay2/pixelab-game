// script.js
let game,canvas;

function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = 4 / 3; // Adjust this based on your game's design

    // Adjust the canvas size while maintaining the aspect ratio
    if (width / height > aspectRatio) {
        canvas.width = height * aspectRatio;
        canvas.height = height;
    } else {
        canvas.width = width;
        canvas.height = width / aspectRatio;
    }

    // Update game elements if the game has started
    if (game) {
        game.updateGameElementsSize();
    }
}


window.onload = function () {
    const canvas = document.getElementById('gameCanvas');
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
        resizeCanvas(); // Resize canvas when the game starts
        game = new ShootingGame(canvas, ctx, infoPanel, levelSpan, scoreSpan, moneySpan, weaponSpan, buyWeaponButton);
        game.start();

    });
};

window.addEventListener('resize', resizeCanvas);
