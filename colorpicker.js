


var c = document.getElementById("myCanvas");
console.log(c)
var ctx = c.getContext("2d");
var dimx = 500;
var dimy = 500;
var imgData = ctx.createImageData(dimx, dimy);
selectedcolor = 0;
var RGBcolor;
initColorPicker();
initColorChanger();
var sliderVal = 1;
drawboard();


function drawboard(){
    var s;
    for(var i = 0; i < dimx; i += 1){
        for (j = 0; j < dimy; j += 1) {
            pos = j * dimx * 4 + i * 4;

            var h = i/dimx;
            s = sliderVal;
            var l = j/dimy;


            var rgb = hslToRgb(h,s,l);

            imgData.data[pos + 0] = rgb[0];
            imgData.data[pos + 1] = rgb[1];
            imgData.data[pos + 2] = rgb[2];
            imgData.data[pos + 3] = 255;
        }
    }
    console.log(s)

    ctx.putImageData(imgData, 0, 0);
}




function initColorPicker(){

    mouseflag = false;

    var canvasEl = document.getElementById('myCanvas');
    var canvasContext = canvasEl.getContext('2d');

    canvasEl.onmousedown = function(mouseEvent) {
        mouseflag = true;
        //console.log(mouseflag);
    }
    canvasEl.onmouseup = function(mouseEvent) {
        mouseflag = false;
        //console.log(mouseflag);
    }
    canvasEl.onmousemove = mousehandler;
    
    function mousehandler(mouseEvent){
        if(mouseflag){

            drawboard();

            var imgData = canvasContext.getImageData(mouseEvent.offsetX, mouseEvent.offsetY, 1, 1);
            var rgba = imgData.data;

            setColor(rgba, selectedcolor);

            console.log("x" + mouseEvent.offsetX);
            console.log("y" + mouseEvent.offsetY);


            ctx.beginPath();
            ctx.arc(mouseEvent.offsetX , mouseEvent.offsetY -30, 15, 0, 2 * Math.PI, false);
            ctx.fillStyle = "rgb("+ rgba[0] + "," + rgba[1] + "," + rgba[2] + ")";
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#003300';
            ctx.stroke();

            //alert("rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ", " + rgba[3] + ")");
            }
        }
}

function initColorChanger(){
    for(var i = 0; i < 5; i++){
        str = "color" + i
        var palel = document.getElementById(str);
        palel.onclick = palelclick
        
        function palelclick(event){
            for(var i = 0;i<5; i++){
                x = document.getElementById("color" + i);
                x.style.border = "1px solid #000000";
            }

            
            num = event.srcElement.id.match(/\d+/)[0];
            selectedcolor = num; 
            x = document.getElementById("color" + num)
            x.style.border = "5px solid #000000"
            // console.log("lel");
            
        }
    }
}


function setColor(rgbcolor, number){
    str = "color" + number;
    //console.log(str);
    var el = document.getElementById("color"+number);
    //console.log(el)

    var cctx = el.getContext("2d");
    var colData = cctx.createImageData(80,80);
    RGBcolor = rgbcolor;

    for(var i = 0; i < colData.data.length; i+=4){
        colData.data[i + 0] = rgbcolor[0];
        colData.data[i + 1] = rgbcolor[1];
        colData.data[i + 2] = rgbcolor[2];
        colData.data[i + 3] = 255;
    }
    cctx.putImageData(colData,0,0);
}


function updateSlider(slideAmount){
    var sliderDiv = document.getElementById("sliderAmount");
    sliderVal = slideAmount/100;
    //console.log(sliderVal);
    drawboard();
    //console.log(slideAmount);
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

circlesvg = `<svg height="100" width="100">
<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" />
</svg>`

