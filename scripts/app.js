//@ts-check
/** @type {HTMLCanvasElement} */ //@ts-ignore canvas is an HTMLCanvasElement
const canvas = document.getElementById("game-canvas");
/** @type {CanvasRenderingContext2D} */ //@ts-ignore canvas is an HTMLCanvasElement
const ctx = canvas.getContext("2d");
canvas.width = 1400;
canvas.height = 750;

let game = {
    gridSize: 25,
    refreshRate: 175,
}

class Player {
    /**
     * @param {Number} x
     * @param {Number} y
     */
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.color = 0;
        this.r = game.gridSize / 2;
        this.head = new Segment(this.x, this.y, this.color, this.r)
        this.segments = [] 
        this.currentDirection = "right";
        this.lastupdate = 0;
        this.wireUpEvents();
    }

    wireUpEvents() {
        document.addEventListener("keydown", (e) => {
            switch(e.code) {
                case "ArrowUp":
                    if(this.currentDirection != "down"){this.currentDirection = "up";}
                break
                case "ArrowDown":
                    if(this.currentDirection != "up"){this.currentDirection = "down";}
                break
                case "ArrowRight":
                    if(this.currentDirection != "left"){this.currentDirection = "right";}
                break
                case "ArrowLeft":
                    if(this.currentDirection != "right"){this.currentDirection = "left";}
                break
                case "KeyW":
                    if(this.currentDirection != "down"){this.currentDirection = "up";}
                break
                case "KeyS":
                    if(this.currentDirection != "up"){this.currentDirection = "down";}
                break
                case "KeyD":
                    if(this.currentDirection != "left"){this.currentDirection = "right";}
                break
                case "KeyA":
                    if(this.currentDirection != "right"){this.currentDirection = "left";}
                break
                
            }
        })
        
    }
    update(elaspedtime) {
        // this.segments[this.segments.indexOf(s) - 1]
        this.lastupdate += elaspedtime
        if(this.lastupdate < game.refreshRate) return
        this.lastupdate = 0;
        this.color += 10;
        this.segments.forEach((s) => {
            s.r =  this.r * ((this.segments.indexOf(s) + 1) / this.segments.length)
        })
        this.segments.push(new Segment(this.head.x, this.head.y, this.color, this.r))
        switch(this.currentDirection) {
            case "right":
                this.head.x += game.gridSize;
                break;
            case "left":
                this.head.x -= game.gridSize;
                break;
            case "up":
                this.head.y -= game.gridSize;
                break;
            case "down":
                this.head.y += game.gridSize;
                break;
        }

        if(this.head.x < 0 || this.head.y < 0 || this.head.x + game.gridSize > canvas.width || this.head.y + game.gridSize > canvas.height) {
            //gameOver
        }
    }

    render() {
        this.head.render();
        this.segments.forEach((s)=>{
            s.update()
            s.render()
        })
    }
}

class Segment {
     /**
     * @param {Number} x
     * @param {Number} y
     * @param {Number} c
     */
     constructor(x,y,c,r) {
        this.x = x;
        this.y = y;
        this.radius = game.gridSize / 2 ;
        this.r = r
        this.color = c
    }

    update() {

    }

    render() {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = `hsla(${this.color}, 100%, 50%, 1)`;
        ctx.arc(this.x + game.gridSize / 2, this.y + game.gridSize / 2, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

class Food {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} [type]
     */
    constructor(x, y, type) {
        this.x = x
        this.y = y
        this.radius = game.gridSize / 2;
        this.color = 130;
        this.growth = 1;
        this.isEaten = false
        this.type = type;
    }

    update() {
        if(this.type === 2) {
            this.color = 270;
            this.growth = 2;
        }
        if(this.type === 3) {
            this.color += 2;
            this.growth = 3;
        }
    }

    render() {

        let alpha = (Math.PI * 2) / 10;
        ctx.save();
        ctx.beginPath();
        for(let i = 11; i != 0; i--) {
            let r = this.radius *(i % 2 + 1) / 2;
            let omega = alpha * i
            ctx.lineTo((r * Math.sin(omega)) + this.x + this.radius, (r * Math.cos(omega)) + this.y + this.radius);
        }
        ctx.closePath();
        ctx.fillStyle = `hsla(${this.color}, 100%, 50%, 1)`;
        ctx.fill();
        ctx.restore();
    }
}

let P1 = new Player(5 * game.gridSize, 5 * game.gridSize)
let food = new Food(200,200, 3);
let food1 = new Food(300,200, 2);
let food2 = new Food(400,200, 1);
let currentTime = 0;

function gameLoop(timestamp) {
    let elaspedtime = timestamp - currentTime
    currentTime = timestamp
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    P1.update(elaspedtime);
    P1.render();
    food.update();
    food.render();
    food1.update();
    food1.render();
    food2.update();
    food2.render();


    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
