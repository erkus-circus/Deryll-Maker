enum Wt {
    Null = -1,
    Air,
    Tile
}

const $: any = (id: string) => document.getElementById(id);
const on = window.addEventListener;

let canv = <HTMLCanvasElement>document.getElementById('c'), c = <CanvasRenderingContext2D> canv.getContext("2d");

function getMousePos(evt: any):Array<number> {
    let rect = canv.getBoundingClientRect();
    return Array<number>(evt.clientX - rect.left,evt.clientY - rect.top);
}