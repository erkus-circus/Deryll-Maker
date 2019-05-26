alert("for full effect enter fullscreen or just click screen")

function render(n) {
    var ca = document.getElementById('c'), c = ca.getContext('2d'); // get canvas and context
    // clear canvas and make it fit whole screen
    ca.width = innerWidth;
    ca.height = innerHeight;


    yscale = innerHeight + 1; // make sure y scale is scaled right

    var y = ca.height; // shortcut

    // loop through each sound and draw
    for (let i = 0; i < n.length; i++) {
        const nos = n[i];  // current sound
        c.beginPath(); // clear path

        c.strokeStyle = "rgb(" + 256/4 + "," + 10 + "," + nos * 256 + ")";  // set color

        c.lineWidth = i * .32 // fade out
        c.lineWidth = (innerWidth - i) * .32 // fade in

        // round brush
        c.lineCap = 'round';
        c.lineJoin = "round";

        c.moveTo(xscale * scale * i, y - scale * yscale * n[i - 1]); // move to last point

        c.lineTo(xscale * scale * i, y - scale * yscale * n[i]); // draw to current point

        c.stroke(); // draw
    }
    /*
    for (let i = 0; i < n.length; i++) {
        const nos = n[i];  // current sound
        // show actual line
        c.beginPath()
        c.strokeStyle = "rgb(0,0,0)";
        c.lineWidth = 1;
        c.moveTo(xscale * scale * i, y - scale * yscale * n[i - 1]); // move to last point

        c.lineTo(xscale * scale * i, y - scale * yscale * n[i]); // draw to current point

        c.stroke(); // draw
    }//*/
}


var spread = .038; // randomness. n >= 1 pure random

var scale = 1; // scale both x and y

var xscale = 1; // scale only x

var ws = innerWidth; // width of window

var yscale = innerHeight + 1; // to scale Y by.

var noises = noise(ws, spread) // sound wave

setInterval(() => {
    var xrate = 101
    
    render(noises) // render sound
    noises.splice(0, xrate); // remove back of sound
    noises.push(...noise(xrate, spread,noises[noises.length - 1], 1)); // add more to sound

}, 1000 / 60); // interval at 60FPS
function ev() {
    document.body.requestFullscreen()
    noises = noise(ws, spread) // refresh noise
}
onclick = ev;
keypress = ev;