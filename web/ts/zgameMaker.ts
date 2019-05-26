module gameMaker {
    export let pointer = new Brush(16,$('point'))
    let world = new World(700,500,16,$('ftile'))
    let md = 0;
    let player = new Pawn(1, 0, 16, 32, $("player"), 2);
    function render() {
        requestAnimationFrame(render)
        c.clearRect(0,0,700,500)
        world.render(c);
        player.update(world);
        if (md) {
            world.map[Math.floor(pointer.x/16)][Math.floor(pointer.y/16)] = 1
        }
        pointer.render(c);
        player.render(c);
    }
    
    export function init() {
        render()
    }

    onmousedown = (e) => {md = 1;}
    onmouseup = (e) => md = 0

    onkeydown = (e) => {
        let kc = e.keyCode;
        let speed = 16;
        let s = 1;
        if (kc == 39) {
            player.moveLeft(-speed,s)
        } else if (kc == 37) {
            player.moveLeft(speed,s)
        } else if (kc == 38) {
            player.moveUp(speed,s)
        } else if (kc == 40) {
            player.moveUp(-speed,s)
        }
    }
}
