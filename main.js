const bodyElt = document.querySelector('body');

let hue = 0;

setInterval(editHue, 0.1)

function editHue() {
    hue += 1;

    if (hue == 360) hue = 0;
    
    bodyElt.style.backgroundColor = `hsl(${hue},100%,50%)`;
}