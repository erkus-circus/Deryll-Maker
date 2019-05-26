

module inf {
    let playing: boolean = false;
    function render():void {
        requestAnimationFrame(render)
        c.clearRect(0,0,canv.width,canv.height)
        world.render(c)

        if (playing) {
            player.update(world)
            player.render(c)
        }
        
        if (player.x / world.tileSize > 40) {
            player.x -= 16 * 2
            world.noise.splice(0,2);
            world.noise.add(2);
            world.generateMapWithNoise()
        }
    }

    let world:World;
    let player:Pawn;
    let f = 0

    function newWorld() {
        player = new Pawn(1,0,16,32,$("player"),2);
        world = new World(canv.width, canv.height, 16, $("ftile"))
    }
    export function initInf(): void {
        newWorld()
        requestAnimationFrame(render)
        
        onkeydown = (e) => {
            let kc = e.keyCode;
            let speed = 16;
            if (kc == 39) {
                player.x +=  speed
            }
            if (kc == 37) {
                player.x -=  speed
            }
            if (kc == 38) {
                player.y -= speed
            }
            if (kc == 40) {
                player.y += speed
            }
        }
    }
}