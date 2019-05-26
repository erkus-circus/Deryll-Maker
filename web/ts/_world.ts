class World {
    w: number;
    tileSize: number;
    h: number;
    floorTile: any;
    noise: NoiseArray;
    map: Array<Array<number>>;
    constructor(w: number, h: number, tileSize: number = 16, floorTile: HTMLElement) {
        let ts = tileSize;
        this.map = []
        this.w = w;
        this.tileSize = tileSize;
        this.h = h;
        this.floorTile = floorTile;
        let noise = new NoiseArray(w / ts, 0.05, .5);
        this.noise = noise;

        //this.generateMapWithNoise();
        this.clearMap();
    }
    up = 0
    update() { }
    render(c:any) {
        let ts = this.tileSize;
        for (let x = 0; x < this.map.length; x++) {
            for (let y = 0; y < this.map[x].length; y++) {
                const b = this.map[x][y];
                if (b == Wt.Tile) {
                    c.drawImage(
                        this.floorTile,
                        x * ts,
                        y * ts
                    )
                }
            }
        }
    }

    clearMap():void {
        let map = Array<Array<number>>();
        let ts = this.tileSize;
        let h = this.h;


        for (let i = 0; i < this.noise.length; i++) {
            let curY = Array<number>();
            for (let y = 0; y < Math.floor( h / ts); y++) {
                curY.push(Wt.Air);
            }
            map.push(curY);
        }
        this.map = map;
    }
    generateMapWithNoise(): void {
        let map = Array<Array<number>>();
        let ts = this.tileSize;
        let h = this.h;

        
        for (let i = 0; i < this.noise.length; i++) {
            const height = Math.floor(this.noise[i] * ts);
            let curY = Array<number>();
            for (let y = 0; y < Math.floor(h / ts) - height; y++) {
                curY.push(Wt.Air);
            }
            for (let y = 0; y < height; y++) {
                curY.push(Wt.Tile);
            }
            map.push(curY);
        }
        this.map = map;
    }
    
    pawnInside(pawn: Pawn): number {
        let ins: number = Wt.Null;

        let ts = this.tileSize;
        for (let x = 0; x < this.map.length; x++) {
            for (let y = 0; y < this.map[x].length; y++) {
                let px = Math.floor(pawn.x / ts);
                let py = Math.floor(pawn.y / ts),
                    tx = x,
                    ty = y;
                if (px == tx && py == ty) {
                    let yy = py * ts
                    
                    ins = this.map[tx][ty]
                    
                    break;
                }
                if (ins !== -1) {
                    break;
                }
            }
        }
        return ins;
    }
}