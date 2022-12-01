//@ts-check
/** @type {HTMLCanvasElement} */ //@ts-ignore canvas is an HTMLCanvasElement
const canvas = document.getElementById("game-canvas");
/** @type {CanvasRenderingContext2D} */ //@ts-ignore canvas is an HTMLCanvasElement
const ctx = canvas.getContext("2d");
canvas.width = 1400;
canvas.height = 750;


let game = {
    gridSize: 20,
    refreshRate: 250,
}

class Player {
    /**
     * @param {Number} x
     * @param {Number} y
     * @param {game} [game]
     */
    constructor(x,y,game) {
        this.x = x;
        this.y = y;
        this.game = game
        this.color = 0;
        this.head = new Segment(this.x, this.y, this.color)
        this.segments = [] 
        this.currentDirection = "right";
        this.lastupdate = 0;
    }
    update(elaspedtime) {
        this.lastupdate += elaspedtime
        if(this.lastupdate < game.refreshRate) return
        this.lastupdate = 0
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
     constructor(x,y,c) {
        this.x = x;
        this.y = y;
        this.s = game.gridSize;
        this.color = c
    }

    update() {

    }

    render() {
        ctx.save();
        ctx.fillStyle = `hsla(${this.color}, 100%, 50%, 1)`;
        ctx.fillRect(this.x, this.y, this.s, this.s)
        ctx.restore();
    }
}

let P1 = new Player(5 * game.gridSize, 5 * game.gridSize)
let currentTime = 0;

function gameLoop(timestamp) {
    let elaspedtime = timestamp - currentTime
    currentTime = timestamp
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    P1.update(elaspedtime);
    P1.render();


    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
