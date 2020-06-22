


var c = document.getElementById("myCanvas");
console.log(c)
var ctx = c.getContext("2d");
var dimx = 500;
var dimy = 500;
var imgData = ctx.createImageData(dimx, dimy);
selectedcolor = 0;
initColorPicker();
setColor(hslToRgb(.5,.5,.5),1);


for(var i = 0; i < dimx; i += 1){
    for (j = 0; j < dimy; j += 1) {
        pos = j * dimx * 4 + i * 4;

        var h = i/dimx;
        var s = 1;
        var l = j/dimy;

        var rgb = hslToRgb(h,s,l);

        imgData.data[pos + 0] = rgb[0];
        imgData.data[pos + 1] = rgb[1];
        imgData.data[pos + 2] = rgb[2];
        imgData.data[pos + 3] = 255;
    }
}

ctx.putImageData(imgData, 0, 0);


function setColor(rgbcolor, number){
    str = "color" + number;
    console.log(str);
    var el = document.getElementById("color"+number);

    var cctx = el.getContext("2d");
    var colData = cctx.createImageData(80,80);

    for(var i = 0; i < colData.data.length; i+=4){
        colData.data[i + 0] = rgbcolor[0];
        colData.data[i + 1] = rgbcolor[1];
        colData.data[i + 2] = rgbcolor[2];
        colData.data[i + 3] = 255;
    }
    cctx.putImageData(colData,0,0);
}



function initColorPicker()
{
    var canvasEl = document.getElementById('myCanvas');
    var canvasContext = canvasEl.getContext('2d');

    canvasEl.onclick = function(mouseEvent) 
    {
      var imgData = canvasContext.getImageData(mouseEvent.offsetX, mouseEvent.offsetY, 1, 1);
      var rgba = imgData.data;

      setColor(rgba, selectedcolor);

      //alert("rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ", " + rgba[3] + ")");
    }
}




/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}