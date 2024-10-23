import { mouse } from "./mouse.js";
import { Player } from "./player.js";
import { Particle } from "./particle.js";
import { Enemies } from "./enemies.js";

// window.addEventListener('mousemove', (e) => {
//     mouse.x = e.pageX;
//     mouse.y = e.pageY;
//     console.log('mouseX', mouse.x);
// })
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let canvas = document.querySelector('#canvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let ctx = canvas.getContext('2d');
const score = document.querySelector('.score');
const startBtn = document.querySelector('.startBtn');



let posX = canvas.width / 2;
let posY = canvas.height / 2;
let angle = 0;

let radius = 20;

let cx = posX + radius / 2;
let cy = posY + radius / 2;

let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.pageX;
    mouseY = e.pageY;
    angle = Math.atan2(e.y - cy, e.x - cx);
});
window.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
        case 39: {
            posX += 1;
            break;
        }
        case 37: {
            posX -= 1;
            break;
        }
    }
});


let player = new Player(canvas.width / 2, canvas.height / 2, 30, 'green');
let bullets = [];
let enemies = [];
let points = 0;
function init() {
    mouseX = 0;
    mouseY = 0;
    player = new Player(canvas.width / 2, canvas.height / 2, 30, 'green');
    bullets = [];
    enemies = [];
    points = 0;
}



ctx.beginPath();
ctx.fillStyle = "red";
ctx.arc(posX, posY, 20, 0, 2 * Math.PI);
ctx.stroke();
ctx.fill();

ctx.beginPath(); // Начинает новый путь
ctx.moveTo(posX, posY); // Передвигает перо в точку (30, 50)
ctx.lineTo(posX + mouseX * Math.cos(angle), posY + mouseY * Math.sin(angle)); // Рисует линию до точки (150, 100)
ctx.stroke(); // Отображает путь



window.addEventListener('click', (e) => {
    let x = player.x + player.radius * Math.cos(player.angle);
    let y = player.y + player.radius * Math.sin(player.angle);
    let angle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2);
    let velocity = {
        x: Math.cos(angle) * 10,
        y: Math.sin(angle) * 10,
    }
    bullets.push(new Particle(x, y, velocity, 5, 'yellow'));

});

function spawnEnemies() {
    setInterval(() => {
        let radius = random(20, 40);
        let x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        let y = Math.random() * canvas.height;
        let angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        let color = `rgba(${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)},1)`;
        let velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        }
        let lineWidth = random(0, 20);
        enemies.push(new Enemies(x, y, velocity, radius, color, lineWidth));
    }, 800);
}
let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);

    ctx.beginPath();
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 100, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, "#17002e");
    gradient.addColorStop(0.5, "#050108");
    gradient.addColorStop(1, "#050108");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    bullets.forEach((bullet, i) => {
        bullet.update(ctx);
        if (bullet.y > canvas.height || bullet.y < 0 || bullet.x > canvas.width || bullet.x < 0) {
            bullets.splice(i, 1);
        }
    });
    player.update(ctx, mouseX, mouseY);
    enemies.forEach((enemy, i) => {
        enemy.update(ctx, mouse.x, mouse.y);

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId);
            let audio = new Audio('data:audio/wav;base64,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VVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uUZFGP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
            audio.volume = 0.5;
            audio.play().then(() => {
            }).catch(error => {
                console.error("Ошибка воспроизведения аудио:", error);
            });
            startBtn.parentElement.style.display = 'flex';
        }
        bullets.forEach((bullet, bulletIndex) => {
            const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
            if (dist - enemy.radius - bullet.radius < 1) {
                enemies.splice(i, 1);
                bullets.splice(bulletIndex, 1);
                points += 1;
                score.innerHTML = `Score: ${points}`;
                let audio = new Audio('data:audio/wav;base64,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');
                audio.volume = 0.5;
                audio.play().then(() => {
                }).catch(error => {
                    console.error("Ошибка воспроизведения аудио:", error);
                });
            }
        });

    });
}
startBtn.addEventListener('click', () => {
    startBtn.parentElement.style.display = 'none';
    init();
    spawnEnemies();
    animate();
});
