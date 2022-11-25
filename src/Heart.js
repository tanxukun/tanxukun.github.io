const settings = {
    particles: {
        length: 500,
        duration: 2,
        velocity: 100,
        effect: -0.75,
        size: 30,
    },
};

class Heart {
    time;
    constructor (canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.width = canvas.width;
        this.height = canvas.height;
        this.particles = new ParticlePool(settings.particles.length);
        this.particleRate = settings.particles.length / settings.particles.duration;
        this.image = this.getStarImage();
    }

    getStarImage () {
        const canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');
        canvas.width = settings.particles.size;
        canvas.height = settings.particles.size;
        const half = canvas.width / 2;
        const gradient2 = context.createRadialGradient(half, half, 0, half, half, half);
        gradient2.addColorStop(0.025, "#CCC");
        gradient2.addColorStop(0.1, "hsl(217, 61%, 33%)");
        gradient2.addColorStop(0.25, "hsl(217, 64%, 6%)");
        gradient2.addColorStop(1, "transparent");

        context.fillStyle = gradient2;
        context.beginPath();
        context.arc(half, half, half, 0, Math.PI * 2);
        context.fill();
        var image = new Image();
        image.src = canvas.toDataURL();
        return image;
    }

    render = () => {
        requestAnimationFrame(this.render);

        const newTime = new Date().getTime() / 1000,
            deltaTime = newTime - (this.time || newTime);
        this.time = newTime;

        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        var amount = this.particleRate * deltaTime;
        for (let i = 0; i < amount; i++) {
            const pos = this.pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
            const dir = pos.clone().getLength(settings.particles.velocity);
            this.particles.add(this.canvas.width / 2 + pos.x, this.canvas.height / 2 - pos.y, dir.x, -dir.y);
        }

        this.particles.update(deltaTime);
        this.particles.draw(this.context, this.image);
    }

    pointOnHeart (t) {
        return new Point(
            160 * Math.pow(Math.sin(t), 3),
            130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
        );
    }
}

class Point {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    clone () {
        return new Point(this.x, this.y);
    }

    getLength (length) {
        if (typeof length == 'undefined')
            return Math.sqrt(this.x * this.x + this.y * this.y);
        this.normalize();
        this.x *= length;
        this.y *= length;
        return this;
    }

    normalize () {
        const length = this.getLength();
        this.x /= length;
        this.y /= length;
        return this;
    }
}

class Particle {
    constructor () {
        this.position = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();
    }

    init (x, y, dx, dy) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.acceleration.x = dx * settings.particles.effect;
        this.acceleration.y = dy * settings.particles.effect;
        this.age = 0;
    }
    
    update (deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.age += deltaTime;
    }

    draw (context, image) {
        const size = image.width * this.ease(this.age / settings.particles.duration);
        context.globalAlpha = 1 - this.age / settings.particles.duration;
        context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
    }

    ease (t) {
        return (--t) * t * t + 1;
    }
}

class ParticlePool {
    particles = [];
    firstActive = 0;
    firstFree = 0;
    duration = settings.particles.duration;

    constructor (length) {
        this.particles = new Array(length);
        for (var i = 0; i < this.particles.length; i++)
            this.particles[i] = new Particle();
    }

    add (x, y, dx, dy) {
        this.particles[this.firstFree].init(x, y, dx, dy);

        this.firstFree++;
        if (this.firstFree == this.particles.length) this.firstFree = 0;
        if (this.firstActive == this.firstFree) this.firstActive++;
        if (this.firstActive == this.particles.length) this.firstActive = 0;
    }

    update (deltaTime) {
        let i;

        if (this.firstActive < this.firstFree) {
            for (i = this.firstActive; i < this.firstFree; i++)
                this.particles[i].update(deltaTime);
        }
        if (this.firstFree < this.firstActive) {
            for (i = this.firstActive; i < this.particles.length; i++)
                this.particles[i].update(deltaTime);
            for (i = 0; i < this.firstFree; i++)
                this.particles[i].update(deltaTime);
        }

        while (this.particles[this.firstActive].age >= this.duration && this.firstActive != this.firstFree) {
            this.firstActive++;
            if (this.firstActive == this.particles.length) this.firstActive = 0;
        }
    }

    draw (context, image) {
        let i;

        if (this.firstActive < this.firstFree) {
            for (i = this.firstActive; i < this.firstFree; i++)
                this.particles[i].draw(context, image);
        }
        if (this.firstFree < this.firstActive) {
            for (i = this.firstActive; i < this.particles.length; i++)
                this.particles[i].draw(context, image);
            for (i = 0; i < this.firstFree; i++)
                this.particles[i].draw(context, image);
        }
    }
}