class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.angel = 0;
        this.velocity = 1;
    }
    draw(ctx) {

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5;
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'yellow';
        ctx.fillStyle = this.color;
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();


        // Добавляем индикатор направления
        ctx.beginPath();
        ctx.moveTo(0 + this.radius, 0);
        ctx.lineTo(this.radius * 2, 0);
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 12;
        ctx.stroke();
        ctx.restore();

    }
    update(ctx, mouseX, mouseY) {
        // Вычисляем угол между игроком и мышью
        this.angle = Math.atan2(mouseY - this.y, mouseX - this.x);
        this.draw(ctx);
    }
}

export { Player };