// 坐标
class Crood {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    setCrood(x, y) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Crood(this.x, this.y);
    }
}

// 流星
class ShootingStar {
    constructor(init = new Crood, final = new Crood, size = 3, speed = 200, onDistory = null) {
        this.init = init; // 初始位置
        this.final = final; // 最终位置
        this.size = size; // 大小
        this.speed = speed; // 速度：像素/s

        // 飞行总时间
        this.dur = Math.sqrt(Math.pow(this.final.x-this.init.x, 2) + Math.pow(this.final.y-this.init.y, 2)) * 1000 / this.speed; 

        this.pass = 0; // 已过去的时间
        this.prev = this.init.copy(); // 上一帧位置
        this.now = this.init.copy(); // 当前位置
        this.onDistory = onDistory;
    }

    draw(context, delta) {
        this.pass += delta;
        this.pass = Math.min(this.pass, this.dur);

        let percent = this.pass / this.dur;

        this.now.setCrood(
            this.init.x + (this.final.x - this.init.x) * percent,
            this.init.y + (this.final.y - this.init.y) * percent
        );

        // canvas
        context.strokeStyle = '#fff';
        context.lineCap = 'round';
        context.lineWidth = this.size;
        context.beginPath();
        context.moveTo(this.now.x, this.now.y);
        context.lineTo(this.prev.x, this.prev.y);
        context.stroke();

        this.prev.setCrood(this.now.x, this.now.y);
        if (this.pass === this.dur) {
            this.distory();
        }
    }

    distory() {
        this.onDistory && this.onDistory();
    }
}

class MeteorShower {

    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.stars = [];
        this.T;
        this.stop = false;
        this.playing = false;
    }

    createStar() {
        let angle = Math.PI / 3;
        let distance = Math.random() * 400;
        let init = new Crood(Math.random() * this.canvas.width|0, Math.random() * this.canvas.height|0);
        let final = new Crood(init.x + distance * Math.cos(angle), init.y + distance * Math.sin(angle));
        let size = Math.random() * 2;
        let speed = Math.random() * 400 + 100;
        let star = new ShootingStar(
                        init, final, size, speed, 
                        ()=>{this.remove(star)}
                    );
        return star;
    }

    remove(star) {
        this.stars = this.stars.filter((s)=>{ return s !== star});
    }

    update(delta) {
        if (!this.stop && this.stars.length < 30) {
            this.stars.push(this.createStar());
        }
        this.stars.forEach((star)=>{
            star.draw(this.context, delta);
        });
    }

    tick() {
        if (this.playing) return;
        this.playing = true;

        let now = (new Date()).getTime();
        let last = now;
        let delta;

        let _tick = () => {
            if (this.stop && this.stars.length === 0) {
                cancelAnimationFrame(this.T);
                this.playing = false;
                return;
            }

            delta = now - last;
            delta = delta > 500 ? 30 : (delta < 16? 16 : delta);
            last = now;
            // console.log(delta);

            this.T = requestAnimationFrame(_tick);

            context.save();
            context.fillStyle = 'rgba(0,0,0,0.2)'; // 每一帧用 “半透明” 的背景色清除画布
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.restore();
            this.update(delta);
        }
        _tick();
    }

    start() {
        this.stop = false;
        this.tick();
    }

    stop() {
        this.stop = true;
    }  
}

// effet
