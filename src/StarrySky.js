class StarrySky {
    constructor (canvas, context, maxStars) {
        this.canvas = canvas;
        this.context = context;
        this.width = canvas.width;
        this.height = canvas.height;
        this.maxStars = maxStars;
    }

    draw () {
        this.createNewCanvas();
        this.stars = [];
        for (var i = 1; i < this.maxStars; i++) {
            const star = new Star(this.canvas, context, this.newCanvas);
            this.stars[i] = star;
        }
        this.animation();
        setTimeout(() => {
            // this.together = true;
        }, 3000)
    }

    animation = () => {
        this.context.globalCompositeOperation = "source-over";
        this.context.globalAlpha = 0.8; //尾巴
        this.context.fillStyle = "hsla(217, 64%, 6%, 2)";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // this.context.globalCompositeOperation = "lighter";
        for (let i = 1; i < this.stars.length; i++) {
            this.stars[i].draw(this.together);
        }

        window.requestAnimationFrame(this.animation);
    }

    createNewCanvas () {
        this.newCanvas = document.createElement("canvas");
        const newCtx = this.newCanvas.getContext("2d");
        this.newCanvas.width = 100;
        this.newCanvas.height = 100;
        const half = this.newCanvas.width / 2;
        const gradient2 = newCtx.createRadialGradient(half, half, 0, half, half, half);
        gradient2.addColorStop(0.025, "#CCC");
        gradient2.addColorStop(0.1, "hsl(217, 61%, 33%)");
        gradient2.addColorStop(0.25, "hsl(217, 64%, 6%)");
        gradient2.addColorStop(1, "transparent");

        newCtx.fillStyle = gradient2;
        newCtx.beginPath();
        newCtx.arc(half, half, half, 0, Math.PI * 2);
        newCtx.fill();
    }


}

class Star {

    constructor(canvas, context, newCanvas) {
        this.maxStars = 1100; //星星数量,默认1100
        this.orbitRadius = this.random(this.maxOrbit(canvas.width, canvas.height));

        this.context = context;
        this.newCanvas = newCanvas;

        this.radius = this.random(60, this.orbitRadius) / 20; //星星大小,值越大星星越小,默认8

        this.orbitX = canvas.width / 2;
        this.orbitY = canvas.height / 2;
        this.timePassed = this.random(0, this.maxStars);
        this.speed = this.random(this.orbitRadius) / 400000; //星星移动速度,值越大越慢,默认5W
        this.alpha = this.random(2, 10) / 10;
    }

    draw(together) {
        if(together) {
            this.context.drawImage(
                this.newCanvas,
                100,
                120,
                this.radius,
                this.radius
            );
            return;
        }
        const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
        const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
        let twinkle = this.random(10);

        if (twinkle === 1 && this.alpha > 0) {
            this.alpha -= 0.05;
        } else if (twinkle === 2 && this.alpha < 1) {
            this.alpha += 0.05;
        }

        this.context.globalAlpha = this.alpha;
        this.context.drawImage(
            this.newCanvas,
            x - this.radius / 2,
            y - this.radius / 2,
            this.radius,
            this.radius
        );
        this.timePassed += this.speed;
    }

    random (min, max) {
        if (arguments.length < 2) {
            max = min;
            min = 0;
        }
        if (min > max) {
            const hold = max;
            max = min;
            min = hold;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    maxOrbit(x, y) {
        const max = Math.max(x, y),
            diameter = Math.round(Math.sqrt(max * max + max * max));
        return diameter / 2;
        //星星移动范围，值越大范围越小，
    }
}