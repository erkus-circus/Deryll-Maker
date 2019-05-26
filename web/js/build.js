"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Wt;
(function (Wt) {
    Wt[Wt["Null"] = -1] = "Null";
    Wt[Wt["Air"] = 0] = "Air";
    Wt[Wt["Tile"] = 1] = "Tile";
})(Wt || (Wt = {}));
var $ = function (id) { return document.getElementById(id); };
var on = window.addEventListener;
var canv = document.getElementById('c'), c = canv.getContext("2d");
function getMousePos(evt) {
    var rect = canv.getBoundingClientRect();
    return Array(evt.clientX - rect.left, evt.clientY - rect.top);
}
var MovePointer = /** @class */ (function () {
    function MovePointer(s, axis, amt) {
        this.speed = s;
        this.axis = axis;
        this.amt = amt;
    }
    return MovePointer;
}());
var Pawn = /** @class */ (function () {
    function Pawn(x, y, width, height, src, iters) {
        if (iters === void 0) { iters = 1; }
        this.jumping = false;
        this.xspeed = 0;
        this.yspeed = 0;
        this.moves = [];
        this.width = width;
        this.height = height;
        this.src = src;
        this.iters = iters;
        this._y = y;
        this._x = x;
    }
    Pawn.prototype.moveUp = function (px, s) {
        if (s === void 0) { s = 1; }
        this.moves.push(new MovePointer(s, "y", -px));
    };
    Pawn.prototype.moveLeft = function (px, s) {
        if (s === void 0) { s = 1; }
        this.moves.push(new MovePointer(s, "x", -px));
    };
    Object.defineProperty(Pawn.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (v) {
            this._x = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pawn.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (v) {
            this._y = v;
        },
        enumerable: true,
        configurable: true
    });
    Pawn.prototype.update = function (world) {
        var t = this.moves.length > 0 ? this.moves[0] : new MovePointer(0, 'y', 0);
        if (Math.abs(t.amt) / t.speed <= 0) {
            this.moves.shift();
        }
        if (t.amt === 0) {
        }
        else if (t.amt > 0) {
            t.amt -= t.speed;
            while (world.pawnInside(this)) {
                t.amt -= 2;
            }
        }
        else {
            t.amt += t.speed;
            while (world.pawnInside(this)) {
                t.amt += 2;
            }
        }
        if (t.axis == "x") {
            this._x += t.amt;
        }
        else if (t.axis == "y") {
            this._y += t.amt;
        }
    };
    Pawn.prototype.render = function (c) {
        c.beginPath();
        c.drawImage(this.src, this._x, this._y, this.width, this.height);
    };
    return Pawn;
}());
function noise(length, rate, base, min, max) {
    if (rate === void 0) { rate = .25; }
    if (base === void 0) { base = 13.13; }
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    while (base >= 1) {
        // turn base into a usable decimal
        base /= 10;
    }
    if (base === 13.13) {
        do {
            base = Math.random();
        } while (base > min && base < max);
    }
    var lrand = base;
    var pool = [];
    for (var i = 0; i < length; i++) {
        var rand = Math.random();
        if (rand > lrand + rate || lrand - rate > rand || rand < min || rand > max) {
            i--;
            continue;
        }
        lrand = rand;
        pool.push(rand);
    }
    return pool;
}
var NoiseArray = /** @class */ (function (_super) {
    __extends(NoiseArray, _super);
    function NoiseArray(length, rate, base, min, max) {
        if (rate === void 0) { rate = .25; }
        if (base === void 0) { base = Math.random(); }
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        var _this = _super.call(this) || this;
        _this.rate = rate;
        _this.base = base;
        _this.min = min;
        _this.max = max;
        _this.push.apply(_this, noise(length, rate, base, min, max));
        _this.add = function (steps) {
            this.push.apply(this, noise(steps, this.rate, this[this.length - 1], this.min, this.max));
        };
        return _this;
    }
    return NoiseArray;
}(Array));
var World = /** @class */ (function () {
    function World(w, h, tileSize, floorTile) {
        if (tileSize === void 0) { tileSize = 16; }
        this.up = 0;
        var ts = tileSize;
        this.map = [];
        this.w = w;
        this.tileSize = tileSize;
        this.h = h;
        this.floorTile = floorTile;
        var noise = new NoiseArray(w / ts, 0.05, .5);
        this.noise = noise;
        //this.generateMapWithNoise();
        this.clearMap();
    }
    World.prototype.update = function () { };
    World.prototype.render = function (c) {
        var ts = this.tileSize;
        for (var x = 0; x < this.map.length; x++) {
            for (var y = 0; y < this.map[x].length; y++) {
                var b = this.map[x][y];
                if (b == Wt.Tile) {
                    c.drawImage(this.floorTile, x * ts, y * ts);
                }
            }
        }
    };
    World.prototype.clearMap = function () {
        var map = Array();
        var ts = this.tileSize;
        var h = this.h;
        for (var i = 0; i < this.noise.length; i++) {
            var curY = Array();
            for (var y = 0; y < Math.floor(h / ts); y++) {
                curY.push(Wt.Air);
            }
            map.push(curY);
        }
        this.map = map;
    };
    World.prototype.generateMapWithNoise = function () {
        var map = Array();
        var ts = this.tileSize;
        var h = this.h;
        for (var i = 0; i < this.noise.length; i++) {
            var height = Math.floor(this.noise[i] * ts);
            var curY = Array();
            for (var y = 0; y < Math.floor(h / ts) - height; y++) {
                curY.push(Wt.Air);
            }
            for (var y = 0; y < height; y++) {
                curY.push(Wt.Tile);
            }
            map.push(curY);
        }
        this.map = map;
    };
    World.prototype.pawnInside = function (pawn) {
        var ins = Wt.Null;
        var ts = this.tileSize;
        for (var x = 0; x < this.map.length; x++) {
            for (var y = 0; y < this.map[x].length; y++) {
                var px = Math.floor(pawn.x / ts);
                var py = Math.floor(pawn.y / ts), tx = x, ty = y;
                if (px == tx && py == ty) {
                    var yy = py * ts;
                    ins = this.map[tx][ty];
                    break;
                }
                if (ins !== -1) {
                    break;
                }
            }
        }
        return ins;
    };
    return World;
}());
var Brush = /** @class */ (function (_super) {
    __extends(Brush, _super);
    function Brush(size, src) {
        var _this = _super.call(this, 0, 0, size, size, src, 0) || this;
        _this.size = size;
        on("mousemove", function (e) {
            var _a = getMousePos(e), x = _a[0], y = _a[1];
            var px = Math.floor((x) / _this.size), py = Math.floor((y) / _this.size);
            $('pos').innerHTML = px + ", " + py;
            _this.x = px * _this.size;
            _this.y = py * _this.size;
        });
        return _this;
    }
    Brush.prototype.setSize = function (size) {
        this.size = size;
        this.width = size;
        this.height = size;
    };
    return Brush;
}(Pawn));
var gameMaker;
(function (gameMaker) {
    gameMaker.pointer = new Brush(16, $('point'));
    var world = new World(700, 500, 16, $('ftile'));
    var md = 0;
    var player = new Pawn(1, 0, 16, 32, $("player"), 2);
    function render() {
        requestAnimationFrame(render);
        c.clearRect(0, 0, 700, 500);
        world.render(c);
        player.update(world);
        if (md) {
            world.map[Math.floor(gameMaker.pointer.x / 16)][Math.floor(gameMaker.pointer.y / 16)] = 1;
        }
        gameMaker.pointer.render(c);
        player.render(c);
    }
    function init() {
        render();
    }
    gameMaker.init = init;
    onmousedown = function (e) { md = 1; };
    onmouseup = function (e) { return md = 0; };
    onkeydown = function (e) {
        var kc = e.keyCode;
        var speed = 16;
        var s = 1;
        if (kc == 39) {
            player.moveLeft(-speed, s);
        }
        else if (kc == 37) {
            player.moveLeft(speed, s);
        }
        else if (kc == 38) {
            player.moveUp(speed, s);
        }
        else if (kc == 40) {
            player.moveUp(-speed, s);
        }
    };
})(gameMaker || (gameMaker = {}));
var inf;
(function (inf) {
    var playing = false;
    function render() {
        requestAnimationFrame(render);
        c.clearRect(0, 0, canv.width, canv.height);
        world.render(c);
        if (playing) {
            player.update(world);
            player.render(c);
        }
        if (player.x / world.tileSize > 40) {
            player.x -= 16 * 2;
            world.noise.splice(0, 2);
            world.noise.add(2);
            world.generateMapWithNoise();
        }
    }
    var world;
    var player;
    var f = 0;
    function newWorld() {
        player = new Pawn(1, 0, 16, 32, $("player"), 2);
        world = new World(canv.width, canv.height, 16, $("ftile"));
    }
    function initInf() {
        newWorld();
        requestAnimationFrame(render);
        onkeydown = function (e) {
            var kc = e.keyCode;
            var speed = 16;
            if (kc == 39) {
                player.x += speed;
            }
            if (kc == 37) {
                player.x -= speed;
            }
            if (kc == 38) {
                player.y -= speed;
            }
            if (kc == 40) {
                player.y += speed;
            }
        };
    }
    inf.initInf = initInf;
})(inf || (inf = {}));
