class Brush extends Pawn {
    private size: number;
    constructor(size:number,src:any) {
        super(0,0,size,size,src,0);
        this.size = size;

        on("mousemove",(e:Event)=>{
            var [x, y] = getMousePos(e);
            var px = Math.floor((x) / this.size),
                py = Math.floor((y) / this.size)
            $('pos').innerHTML = px + ", " + py
            this.x = px * this.size;
            this.y = py * this.size;
        });
    }
    setSize(size:number): void {
        this.size = size;
        this.width = size; this.height = size;
    }
}