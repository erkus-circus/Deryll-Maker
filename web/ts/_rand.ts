function noise(length:number, rate = .25, base:number = 13.13,min=0,max=1):Array<number> {

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
    
    for(var i = 0; i < length;i++) {
        var rand = Math.random();
        if (rand > lrand+rate || lrand-rate > rand || rand < min || rand > max) {
            i--;
            continue;
        }
        lrand = rand;
        pool.push(rand);
    }
    return pool;
}

class NoiseArray extends Array {
    rate: number
    base: number
    min: number
    max: number
    add: any;
    constructor(length:number, rate = .25, base = Math.random(), min = 0, max = 1) {
        super()
        this.rate = rate;
        this.base = base;
        this.min = min;
        this.max = max;

        this.push(...noise(length, rate, base, min, max))

        this.add = function(steps: number) {
            
            this.push(...noise(steps, this.rate, this[this.length - 1], this.min, this.max));
            
        }
    }
}