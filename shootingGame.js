class ShootingGame {
    constructor(canvas, ctx, infoPanel, levelSpan, scoreSpan, moneySpan, weaponSpan, buyWeaponButton) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.infoPanel = infoPanel;
        this.buyWeaponButton = buyWeaponButton;
        if (this.canvas) {
            this.canvas.addEventListener('mousemove', this.movePlayer.bind(this));
            this.canvas.addEventListener('click', this.shoot.bind(this));
        } else {
            console.error('Canvas not found.');
        }
        this.player = {
            x: canvas.width / 2,
            y: canvas.height - 50,
            width: 50,
            height: 50,
            image: new Image(),
            health: 100,
            money: 0,
            weapon: 1,
        };

        this.enemyTypes = ['basic', 'fast', 'tank'];
        this.enemyImages = {
            basic: new Image(),
            fast: new Image(),
            tank: new Image(),
        };
        this.enemyImages.basic.src = 'basic.png';
        this.enemyImages.fast.src = 'fast.png';
        this.enemyImages.tank.src = 'tank.png';

        this.waveNumber = 1;
        this.enemiesRemaining = 0;
        document.getElementById('waveValue').textContent = this.waveNumber;
        document.getElementById('enemiesRemainingValue').textContent = this.enemiesRemaining;
        
        

        this.loadImages(); // Load player and enemy images


        this.backgroundImage = new Image();
        this.backgroundImage.src = 'background.jpg'; // Provide the path to your image

        this.levels = [
            { enemyCount: 5, enemySpeed: 2, enemyHealth: 20 },
            { enemyCount: 8, enemySpeed: 2, enemyHealth: 30 },
            { enemyCount: 12, enemySpeed: 3, enemyHealth: 40 },
            { enemyCount: 15, enemySpeed: 3, enemyHealth: 50 },
            { enemyCount: 18, enemySpeed: 4, enemyHealth: 60 },
            { enemyCount: 20, enemySpeed: 4, enemyHealth: 70 },
            { enemyCount: 22, enemySpeed: 5, enemyHealth: 80 },
            { enemyCount: 25, enemySpeed: 5, enemyHealth: 90 },
            { enemyCount: 28, enemySpeed: 6, enemyHealth: 100 },
            { enemyCount: 30, enemySpeed: 6, enemyHealth: 110 },
            { enemyCount: 32, enemySpeed: 7, enemyHealth: 120 },
            { enemyCount: 35, enemySpeed: 7, enemyHealth: 130 },
            { enemyCount: 38, enemySpeed: 8, enemyHealth: 140 },
            { enemyCount: 40, enemySpeed: 8, enemyHealth: 150 },
            { enemyCount: 42, enemySpeed: 9, enemyHealth: 160 },
            { enemyCount: 45, enemySpeed: 9, enemyHealth: 170 },
            { enemyCount: 48, enemySpeed: 10, enemyHealth: 180 },
            { enemyCount: 50, enemySpeed: 10, enemyHealth: 190 },
            { enemyCount: 52, enemySpeed: 11, enemyHealth: 200 },
            { enemyCount: 55, enemySpeed: 11, enemyHealth: 210 },
            { enemyCount: 58, enemySpeed: 12, enemyHealth: 220 },
            { enemyCount: 60, enemySpeed: 12, enemyHealth: 230 },
            { enemyCount: 62, enemySpeed: 13, enemyHealth: 240 },
            { enemyCount: 65, enemySpeed: 13, enemyHealth: 250 },
            { enemyCount: 68, enemySpeed: 14, enemyHealth: 260 },
            { enemyCount: 70, enemySpeed: 14, enemyHealth: 270 },
            { enemyCount: 72, enemySpeed: 15, enemyHealth: 280 },
            { enemyCount: 75, enemySpeed: 15, enemyHealth: 290 },
            { enemyCount: 78, enemySpeed: 16, enemyHealth: 300 },
        ];


        this.currentLevel = 0;
        this.score = 0;
        this.money = 0;
        this.enemies = [];
        this.bullets = [];
        this.isGameOver = false;
        this.isGamePaused = false;
        this.powerUps = [];

        document.addEventListener('keydown', (event) => {
            if (event.key === 'p' || event.key === 'P') {
                this.togglePause();
            }
        });
        this.canvas.addEventListener('mousemove', this.movePlayer.bind(this));
        this.canvas.addEventListener('click', this.shoot.bind(this));
        this.buyWeaponButton.addEventListener('click', this.buyWeapon.bind(this));
    }
    loadImages() {
        // Load player image
        this.player.image.src = 'player.png'; // Replace with the actual file path
        const enemyType = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
        const enemyImage = this.enemyImages[enemyType];
        enemyImage.src = `${enemyType}.png`;
    }

    updateGameElementsSize() {
        // Update player size and position
        this.player.width = this.canvas.width * 0.05; // Example scaling
        this.player.height = this.canvas.height * 0.05;
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height - this.player.height - 10;
    }
    
    start() {
        this.gameInterval = setInterval(() => {
            this.gameLoop();
        }, 16);
        this.startLevel();
    }

    startLevel() {
        this.bullets = [];
        this.enemies = [];
        this.isGameOver = false;

        const currentLevelInfo = this.levels[this.currentLevel];
        for (let i = 0; i < currentLevelInfo.enemyCount; i++) {
            setTimeout(() => this.spawnEnemy(), i * 500);
        }
    }

    spawnEnemy() {
        const enemyType = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
        const enemyImage = this.enemyImages[enemyType];
        const enemy = {
            x: Math.random() * (this.canvas.width - 30),
            y: 0,
            width: 30,
            height: 30,
            type: enemyType,
            image: enemyImage,
            speed: this.levels[this.currentLevel].enemySpeed + Math.random() * 2,
            health: this.levels[this.currentLevel].enemyHealth,
            damage: 40,
        };
        


        this.enemies.push(enemy);
    }

    togglePause() {
        this.isGamePaused = !this.isGamePaused;

        if (this.isGamePaused) {
            clearInterval(this.gameInterval);
        } else {
            this.gameInterval = setInterval(() => this.gameLoop(this.ctx), 16);
        }
    }


    checkLevelCompletion() {
        if (this.enemies.length === 0 && !this.isGameOver) {
            this.currentLevel++;

            if (this.currentLevel < this.levels.length) {
                // Move to the next level if available
                this.money += 30; // Reward for completing the level
                this.startLevel();
            } else {
                // Player completed all levels
                this.gameOver(true);
            }
        }
    }

    gameLoop(ctx) {
        if (!this.isGameOver && !this.isGamePaused) {
            this.drawBackground();
            this.drawPlayer();
            this.drawEnemies();
            this.drawPowerUps();
            this.drawScore();
            this.drawHealth();
            this.drawMoney();
            this.drawWeapon();
            this.drawLevel();
            this.moveBullets(ctx);
            this.moveEnemies();
            this.movePowerUps();
            this.drawBullets();
            this.detectCollisions();
            this.checkLevelCompletion(); // Move this check here

        } else if (this.isGamePaused) {
            this.drawPauseScreen();
        }
    }

    drawBackground() {
        // Draw the background image
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }
    movePlayer(event) {
        if (!this.isGameOver) {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width; // Scale factor for X

            this.player.x = (event.clientX - rect.left) * scaleX - this.player.width / 2;

            this.player.x = Math.max(0, Math.min(this.player.x, this.canvas.width - this.player.width));

        }
    }

    shoot() {
        if (!this.isGameOver) {
            const bullet = {
                x: this.player.x + this.player.width / 2 - 5,
                y: this.player.y - 10,
                width: 10,
                height: 10,
                damage: 5 * this.player.weapon,
            };

            this.bullets.push(bullet);
        }
    }

    buyWeapon() {
        if (!this.isGameOver && this.money >= this.player.weapon * 10) {
            this.money -= this.player.weapon * 10;
            this.player.weapon++;
        }
    }

    moveBullets() {
        this.bullets.forEach(bullet => {
            bullet.y -= 5;
        });

        this.bullets = this.bullets.filter(bullet => bullet.y > 0);
    }
    movePowerUps() {
        this.powerUps.forEach((powerUp, index) => {
            powerUp.y += 3;

            // Remove power-ups that go beyond the canvas
            if (powerUp.y > this.canvas.height) {
                this.powerUps.splice(index, 1);
            }

            // Check for collisions with the player
            if (
                this.player.x < powerUp.x + powerUp.width &&
                this.player.x + this.player.width > powerUp.x &&
                this.player.y < powerUp.y + powerUp.height &&
                this.player.y + this.player.height > powerUp.y
            ) {
                this.applyPowerUp(powerUp.type);
                this.powerUps.splice(index, 1);
            }
        });
    }

    moveEnemies() {
        this.enemies.forEach(enemy => {
            enemy.y += enemy.speed;
        });

        this.enemies = this.enemies.filter(enemy => enemy.y < this.canvas.height);
    }

    detectCollisions() {
        this.bullets.forEach(bullet => {
            this.enemies.forEach(enemy => {
                if (
                    bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y
                ) {
                    enemy.health -= bullet.damage;
    
                    if (enemy.health <= 0) {
                        this.score += 10;
                        this.money += 10;
                        this.enemies = this.enemies.filter(e => e !== enemy);
                    }
    
                    this.bullets = this.bullets.filter(b => b !== bullet);
                }
            });
        });
        this.enemies.forEach(enemy => {
            if (
                this.player.x < enemy.x + enemy.width &&
                this.player.x + this.player.width > enemy.x &&
                this.player.y < enemy.y + enemy.height &&
                this.player.y + this.player.height > enemy.y
            ) {
                this.player.health -= enemy.damage;
        
                if (this.player.health <= 0) {
                    this.gameOver();
                }
        
                if (enemy.type === 'basic') {
                    // Handle basic enemy behavior
                } else if (enemy.type === 'fast') {
                    // Handle fast enemy behavior
                } else if (enemy.type === 'tank') {
                    // Handle tank enemy behavior
                }
        
                this.enemies = this.enemies.filter(e => e !== enemy);
            }
        });
    }

    spawnPowerUp() {
        const powerUp = {
            x: Math.random() * (this.canvas.width - 20),
            y: 0,
            width: 20,
            height: 20,
            type: 'health', // You can have different types of power-ups
        };

        this.powerUps.push(powerUp);
    }
    applyPowerUp(type) {
        switch (type) {
            case 'health':
                this.player.health = Math.min(100, this.player.health + 20); // Increase health, capped at 100
                break;
            // Add more power-up types and effects as needed
            default:
                break;
        }
    }

    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '36px Arial';
        this.ctx.fillText('Game Paused', this.canvas.width / 2 - 120, this.canvas.height / 2 - 18);
    }

    drawPowerUps() {
        this.ctx.fillStyle = '#FFD700'; // Gold color for power-up

        this.powerUps.forEach((powerUp, index) => {
            this.ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        });
    }
    drawHealth() {
        document.getElementById('healthValue').textContent = this.player.health;
    }

    drawScore() {
        const scoreValueElement = document.getElementById('scoreValue');
        if (scoreValueElement) {
            // Change this.player.score to this.score
            scoreValueElement.textContent = this.score;
        } else {
            console.error('ScoreValue element not found.');
        }
    }

    drawPlayer() {
        this.ctx.drawImage(this.player.image, this.player.x, this.player.y, this.player.width, this.player.height);
    }

    drawMoney() {
        document.getElementById('moneyValue').textContent = this.money;
    }
    

    drawBullets(ctx) {
        // Draw bullets on the canvas with animation
        ctx.fillStyle = 'white';
    
        this.bullets.forEach(bullet => {
            // Add a simple animation effect for bullets
            bullet.y -= 10;
    
            // Draw the bullet as a rectangle
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        this.bullets = this.bullets.filter(bullet => bullet.y > 0);
    }

    drawWeapon() {
        document.getElementById('weaponValue').textContent = this.player.weapon;
 
    }

    drawEnemies() {
        this.enemies.forEach(enemy => {
            this.ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }
    drawLevel() {
        document.getElementById('levelValue').textContent = this.currentLevel + 1;
    }

    gameOver() {
        // Handle game over logic
        this.isGameOver = true;
        clearInterval(this.gameInterval);
    
        // Display game over screen
        const gameOverScreen = document.getElementById('gameOverScreen');
        gameOverScreen.style.display = 'block';
    
        // Show final score
        document.getElementById('finalScore').textContent = `Your Score: ${this.score}`;
    
        // Restart button
        const restartButton = document.getElementById('restartButton');
        restartButton.addEventListener('click', () => {
            location.reload(); // Reload the page to restart the game
        });
    }
}