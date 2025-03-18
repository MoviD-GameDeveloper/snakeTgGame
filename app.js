// Функция для определения типа устройства
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Настройка размеров игры
let gameWidth, gameHeight;

if (isMobileDevice()) {
    // На мобильных устройствах игра занимает весь экран
    gameWidth = window.innerWidth;
    gameHeight = window.innerHeight;
} else {
    // На компьютерах и планшетах фиксированное разрешение 720x1280
    gameWidth = 720;
    gameHeight = 1280;
}

const config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    backgroundColor: '#000',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

let snake;
let food;
let cursors;
let score = 0;
let scoreText;
let gameOver = false;
let startX, startY;  // Начальные координаты касания

function preload() {
    // Загружаем изображения
    this.load.image('body', 'assets/body.png');  // Сегмент змейки
    this.load.image('food', 'assets/food.png');  // Еда
}

function create() {
    // Масштабирование игры
    this.scale.setGameSize(gameWidth, gameHeight);
    this.scale.refresh();

    // Создаем змейку
    snake = this.physics.add.group({
        key: 'body',
        frameQuantity: 3,
        setXY: { x: gameWidth / 2, y: gameHeight / 2, stepX: 20 }
    });

    // Создаем еду
    food = this.physics.add.sprite(Phaser.Math.Between(0, gameWidth), Phaser.Math.Between(0, gameHeight), 'food');

    // Настройка столкновений
    this.physics.add.collider(snake, snake, () => {
        gameOver = true;
        this.physics.pause();
        scoreText.setText(`Игра окончена! Счет: ${score}`);
    });

    // Настройка столкновений змейки с едой
    this.physics.add.overlap(snake, food, () => {
        food.setPosition(Phaser.Math.Between(0, gameWidth), Phaser.Math.Between(0, gameHeight));
        const newSegment = this.physics.add.sprite(0, 0, 'body');
        snake.add(newSegment);
        score += 10;
        scoreText.setText(`Счет: ${score}`);
    });

    // Управление с клавиатуры (для компьютеров)
    cursors = this.input.keyboard.createCursorKeys();

    // Управление свайпами (для мобильных устройств)
    this.input.on('pointerdown', (pointer) => {
        startX = pointer.x;
        startY = pointer.y;
    });

    this.input.on('pointerup', (pointer) => {
        const endX = pointer.x;
        const endY = pointer.y;

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Горизонтальный свайп
            if (deltaX < 0) {
                // Свайп влево
                if (snake.getChildren()[0].body.velocity.x !== 20) {
                    snake.getChildren()[0].setVelocity(-20, 0);
                }
            } else {
                // Свайп вправо
                if (snake.getChildren()[0].body.velocity.x !== -20) {
                    snake.getChildren()[0].setVelocity(20, 0);
                }
            }
        } else {
            // Вертикальный свайп
            if (deltaY < 0) {
                // Свайп вверх
                if (snake.getChildren()[0].body.velocity.y !== 20) {
                    snake.getChildren()[0].setVelocity(0, -20);
                }
            } else {
                // Свайп вниз
                if (snake.getChildren()[0].body.velocity.y !== -20) {
                    snake.getChildren()[0].setVelocity(0, 20);
                }
            }
        }
    });

    // Текст счета
    scoreText = this.add.text(16, 16, 'Счет: 0', { fontSize: '32px', fill: '#fff' });

    // Кнопка "Закрыть" для Telegram Mini App
    const tg = window.Telegram.WebApp;
    tg.MainButton.show();
    tg.MainButton.setText("Закрыть");
    tg.MainButton.onClick(() => tg.close());
}

function update() {
    if (gameOver) return;

    // Движение змейки (для компьютеров)
    const head = snake.getChildren()[0];

    if (cursors.left.isDown && head.body.velocity.x !== 20) {
        head.setVelocity(-20, 0);
    } else if (cursors.right.isDown && head.body.velocity.x !== -20) {
        head.setVelocity(20, 0);
    } else if (cursors.up.isDown && head.body.velocity.y !== 20) {
        head.setVelocity(0, -20);
    } else if (cursors.down.isDown && head.body.velocity.y !== -20) {
        head.setVelocity(0, 20);
    }

    // Перемещение сегментов змейки
    Phaser.Actions.ShiftPosition(snake.getChildren(), head.x, head.y, 1);
}