const title = document.querySelector('h1');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const eggPath1 = new Path2D("M23.142 3.403C21.492 1.899 19.712 1 18 1 12.375 1 6 10.611 6 20c0 .975.079 1.899.202 2.791C7.261 30.484 12.623 35 18 35c6 0 12-5.611 12-15 0-6.531-3.086-13.161-6.858-16.597z");
const eggPath2 = new Path2D("M23.142 3.403c2.908 3.519 5.108 9.018 5.108 14.453 0 9.009-5.672 14.393-11.344 14.393-4.541 0-9.075-3.459-10.705-9.459C7.261 30.484 12.623 35 18 35c6 0 12-5.611 12-15 0-6.531-3.086-13.161-6.858-16.597z");

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Particle {
    ended = false;
    bounced = false;
    constructor(x, y, scale = 1) {
        this.pos = new Vector(x, y);
        this.vel = new Vector();
        this.acc = new Vector();
        this.scale = scale;
        this.a = 0;
        this.aVel = Math.random() - 0.5;
    }

    applyForce(f) {
        this.acc.add(f);
    }

    update() {

        if (!this.bounced && this.pos.y > title.offsetTop) {
            this.vel.y *= -0.5;
            this.bounced = true;
        }

        this.vel.add(this.acc);
        this.pos.add(this.vel);

        this.a += this.aVel;

        this.acc.set(0, 0);

        if (this.pos.y > canvas.height) this.ended = true;
    }

    draw() {
        // ctx.fillStyle = this.ended ? "red" : "blue";
        // ctx.beginPath();
        // ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
        // ctx.fill();
        drawEgg(this.pos.x, this.pos.y, this.a, this.scale);
    }
}

class Fountain {
    constructor() {
        this.particles = [];
    }

    genParticle() {
        const p = new Particle(mousePos.x, mousePos.y, Math.random());
        const xVel = Math.random() - 0.5;
        const yVel = Math.random() - 0.5;
        p.vel.set(xVel, yVel);
        return p;
    }

    update(forces) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            for (const f of forces) {
                this.particles[i].applyForce(f);
            }
            this.particles[i].update();
            if (this.particles[i].ended) {
                this.particles.splice(i, 1);
                continue;
            }
        }
    }

    draw() {
        for (const p of this.particles) {
            p.draw();
        }
    }
}

function drawEgg(x = 0, y = 0, a = 0, s = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.scale(s, s);
    ctx.translate(-18, -18);
    // ctx.translate(x, y);
    const light = "#F7DECE";
    const dark = "#E0AA94";

    ctx.fillStyle = light;
    ctx.fill(eggPath1);
    ctx.fillStyle = dark;
    ctx.fill(eggPath2);

    ctx.restore();
}

const mousePos = new Vector();
window.addEventListener("mousemove", e => mousePos.set(e.x, e.y));

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const fountain = new Fountain();
const Gravity = new Vector(0, 0.1);

function init() {
    ctx.fillStyle = "black";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
}

let a = 0;
let time = 0;

function draw() {
    requestAnimationFrame(draw); // loop

    ctx.beginPath();
    ctx.fillStyle = "rgb(51,51,51)";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    if (time % 2 == 0) fountain.particles.push(fountain.genParticle())
    fountain.update([Gravity]);
    fountain.draw();

    time++;
}

setCanvasSize();
window.addEventListener("resize", setCanvasSize);

init();
draw();