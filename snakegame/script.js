const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const gameWidth = game.clientWidth;
const gameHeight = game.clientHeight;
const gridSize = 20;
let score = 0;

class Snake {
    constructor() {
        this.body = [{x: gridSize * 5, y: gridSize * 5}];
        this.direction = {x: 1, y: 0};
        this.newSegments = 0;

        this.body.forEach(segment => {
            const element = document.createElement('div');
            element.className = 'snake';
            element.style.left = `${segment.x}px`;
            element.style.top = `${segment.y}px`;
            game.appendChild(element);
        });
    }

    update() {
        const inputDirection = this.getInputDirection();
        const newHead = {
            x: this.body[0].x + inputDirection.x * gridSize,
            y: this.body[0].y + inputDirection.y * gridSize
        };

        this.body.unshift(newHead);

        if (this.newSegments > 0) {
            this.newSegments--;
        } else {
            this.body.pop();
        }

        if (this.checkCollision(newHead)) {
            this.reset();
        }
    }

    draw() {
        game.querySelectorAll('.snake').forEach(segment => segment.remove());

        this.body.forEach(segment => {
            const element = document.createElement('div');
            element.className = 'snake';
            element.style.left = `${segment.x}px`;
            element.style.top = `${segment.y}px`;
            game.appendChild(element);
        });
    }

    getInputDirection() {
        return this.direction;
    }

    setDirection(newDirection) {
        this.direction = newDirection;
    }

    expand(amount) {
        this.newSegments += amount;
    }

    checkCollision(position) {
        return (
            position.x < 0 || position.x >= gameWidth ||
            position.y < 0 || position.y >= gameHeight ||
            this.body.slice(1).some(segment => segment.x === position.x && segment.y === position.y)
        );
    }

    reset() {
        alert(`Game Over! Your score was: ${score}`);
        score = 0;
        scoreDisplay.textContent = score;
        this.body = [{x: gridSize * 5, y: gridSize * 5}];
        this.direction = {x: 1, y: 0};
        this.newSegments = 0;
    }
}

class Food {
    constructor() {
        this.position = this.randomPosition();
        this.element = document.createElement('div');
        this.element.className = 'food';
        this.updatePosition();
        game.appendChild(this.element);
    }

    updatePosition() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }

    randomPosition() {
        let x, y;
        do {
            x = Math.floor(Math.random() * (gameWidth / gridSize)) * gridSize;
            y = Math.floor(Math.random() * (gameHeight / gridSize)) * gridSize;
        } while (snake.body.some(segment => segment.x === x && segment.y === y));
        return {x, y};
    }

    reposition() {
        this.position = this.randomPosition();
        this.updatePosition();
    }
}

const snake = new Snake();
const food = new Food();

function update() {
    snake.update();
    if (snake.body[0].x === food.position.x && snake.body[0].y === food.position.y) {
        snake.expand(1);
        food.reposition();
        score++;
        scoreDisplay.textContent = score;
    }
    snake.draw();
}

function gameLoop() {
    setTimeout(() => {
        update();
        requestAnimationFrame(gameLoop);
    }, 100);
}

document.addEventListener('keydown', event => {
    const inputDirection = snake.getInputDirection();
    switch (event.key) {
        case 'ArrowUp':
            if (inputDirection.y === 0) snake.setDirection({x: 0, y: -1});
            break;
        case 'ArrowDown':
            if (inputDirection.y === 0) snake.setDirection({x: 0, y: 1});
            break;
        case 'ArrowLeft':
            if (inputDirection.x === 0) snake.setDirection({x: -1, y: 0});
            break;
        case 'ArrowRight':
            if (inputDirection.x === 0) snake.setDirection({x: 1, y: 0});
            break;
    }
});

gameLoop();
