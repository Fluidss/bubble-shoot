class Enemies {
    constructor(x, y, velocity, radius, color = '#ffffff', lineWidth = 0) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.lineWidth = lineWidth;

        this.angle = 0;
        this.rotationSpeed = Math.random() * 0.05 - 0.025;
        this.pulseSpeed = Math.random() * 0.05 + 0.02;
        this.pulseSize = 0;
        this.glowIntensity = 0;
        this.glowSpeed = Math.random() * 0.05 + 0.02;
        
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        const pulseFactor = Math.sin(this.pulseSize) * 3;
        const glowFactor = Math.sin(this.glowIntensity) * 10;

        // Внешнее свечение
        const gradient = ctx.createRadialGradient(0, 0, this.radius, 0, 0, this.radius * 1.5);
        gradient.addColorStop(0, `rgba(255, 213, 128, ${0.5 + glowFactor * 0.05})`);
        gradient.addColorStop(1, 'rgba(127, 255, 212, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 2, 0, 2 * Math.PI);
        ctx.fill();

        // Основной круг
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = '#7fffd4';
        ctx.fillStyle = this.color;
        ctx.arc(0, 0, this.radius + pulseFactor, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Внутренние кольца
        for (let i = 0.8; i > 0.2; i -= 0.2) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * i, 0, 2 * Math.PI);
            ctx.strokeStyle = `rgba(255, 255, 255, ${i * 0.5})`;
            ctx.stroke();
        }

        // "Глаза"
        // const eyeAngle = Math.sin(this.pulseSize * 2) * 0.5;
        // ctx.fillStyle = '#ff0000';
        // ctx.beginPath();
        // ctx.arc(Math.cos(eyeAngle) * this.radius * 0.3, -this.radius * 0.2, this.radius * 0.15, 0, 2 * Math.PI);
        // ctx.arc(-Math.cos(eyeAngle) * this.radius * 0.3, -this.radius * 0.2, this.radius * 0.15, 0, 2 * Math.PI);
        // ctx.fill();

        // Энергетические частицы
        for (let i = 0; i < 5; i++) {
            const particleAngle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.radius;
            ctx.beginPath();
            ctx.arc(
                Math.cos(particleAngle) * distance,
                Math.sin(particleAngle) * distance,
                2,
                0,
                2 * Math.PI
            );
            ctx.fillStyle = `rgba(127, 255, 212, ${Math.random() * 0.5 + 0.5})`;
            ctx.fill();
        }

        ctx.restore();
    }
    update(ctx) {

        this.angle += this.rotationSpeed;
        this.pulseSize += this.pulseSpeed;
        this.glowIntensity += this.glowSpeed;
        this.draw(ctx);
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

export { Enemies }; 