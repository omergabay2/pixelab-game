// script.js
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


    let game;

    startButton.addEventListener('click', () => {
        gameContainer.classList.remove('hidden');
        startButton.style.display = 'none'; // Hide the start button
        menu.style.display = 'none'; // Hide the game title
        game = new ShootingGame(canvas, ctx, infoPanel, levelSpan, scoreSpan, moneySpan, weaponSpan, buyWeaponButton);
        game.start();

    });
};