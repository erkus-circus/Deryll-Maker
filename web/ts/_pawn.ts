class MovePointer {
    public speed: number;
    public axis: string;
    public amt: number
    constructor(s: number, axis: string, amt: number) {
        this.speed = s;
        this.axis = axis;
        this.amt = amt;
    }
}

class Pawn {
    protected _x: number;
    protected _y: number;
    width: number;
    height: number;
    iters: number;
    jumping: boolean = false;
    src: any;
    xspeed = 0;
    yspeed = 0;
    moves: MovePointer[] = [];

    constructor(x: number, y: number, width: number, height: number, src: any, iters: number = 1) {
        this.width = width;
        this.height = height;
        this.src = src;
        this.iters = iters;
        this._y = y;
        this._x = x;
    }

    moveUp(px: number, s: number = 1) {
        this.moves.push(new MovePointer(s, "y", -px))
    }

    moveLeft(px: number, s: number = 1) {
        this.moves.push(new MovePointer(s, "x", -px))
    }


    public get x(): number {
        return this._x;
    }
    public get y(): number {
        return this._y;
    }


    public set x(v: number) {
        this._x = v;
    }
    public set y(v: number) {
        this._y = v;
    }


    update(world: World) {
        var t:any = this.moves.length > 0 ? this.moves[0]:new MovePointer(0,'y',0);
        if (Math.abs(t.amt) / t.speed <= 0) {
            this.moves.shift();
        }
        if (t.amt === 0) {
            
        } else if (t.amt > 0) {
            t.amt -= t.speed;
            while (world.pawnInside(this)) {
                t.amt -= 2
            }
        } else {
            t.amt += t.speed;
            while (world.pawnInside(this)) {
                t.amt += 2
            }
        }
        if (t.axis == "x") {
            this._x += t.amt;
        } else if (t.axis == "y") {
            this._y += t.amt;
        }
    }
    render(c: any) {
        c.beginPath();
        c.drawImage(
            this.src, this._x, this._y, this.width, this.height
        );
    }
}