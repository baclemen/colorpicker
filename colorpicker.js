if(typeof isextension !== 'undefined'){
    console.log("isextension")
}
else {
    console.log("isnotextension")
}


var pickerhtml = `
<div id="colordragheader">
	<div id="mydivheader">Click here to move</div>
	<div id="colorpickercontainer">
		<canvas id="drawcanvas" width="300" height="420"></canvas>
		<div id="contentcontainer">

			<canvas id="topslider" width="300" height="30"></canvas>
			<canvas id="myCanvas" width="300" height="300"></canvas>
			<div id=colorscontainer>
				<canvas class="colors" id="color0" width="50" height="50"></canvas>
				<canvas class="colors" id="color1" width="50" height="50"></canvas>
				<canvas class="colors" id="color2" width="50" height="50"></canvas>
				<canvas class="colors" id="color3" width="50" height="50"></canvas>
				<canvas class="colors" id="color4" width="50" height="50"></canvas>
			</div>
			<canvas class="blender" id="blender" width="300" height="30"></canvas>
	</div>
</div>
`
var container;

function setColorAPI(color){
    if(typeof isextension !== 'undefined'){

        console.log(rgbtohex(color));

        var injectedCode = 'aww.setStrokeColor("'+ rgbtohex(color) +'")';
        var script = document.createElement('script');
        script.id = "injectedscript";
        script.appendChild(document.createTextNode(injectedCode));
        document.body.appendChild(script);

        var element = document.getElementById("injectedscript");
        console.log(element);
        if(element != null){
            element.parentNode.removeChild(element);
        }
    }

}

if(typeof isextension !== 'undefined'){
    container = document.getElementById("board-menus");
    container.innerHTML += pickerhtml;
}





dragElement(document.getElementById("colordragheader"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById("mydivheader")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById("mydivheader").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}



var drawcanvas = document.getElementById("drawcanvas");
var pointertrace = [];
var drawctx = drawcanvas.getContext("2d");

drawcanvas.addEventListener("gotpointercapture", startdrawing);
drawcanvas.addEventListener("lostpointercapture", enddrawing);


var otherels = document.getElementById("colorpickercontainer");




drawcanvas.addEventListener("pointercancel", function(e){
    e.preventDefault();
})

const defaultpickercontext = {
    top : 0,
    left : 0,
    height : 1,
    width: 1,
    slidervalue: 1
};

var pickercontext = defaultpickercontext;

var c = document.getElementById("myCanvas");
//console.log(c);
var ctx = c.getContext("2d");
var dimx = 300;
var dimy = 300;
var heightslider = 30;
var heightcolors = 55;
var heightblender = 30;
var imgData = ctx.createImageData(dimx, dimy);
var selectedcolor = 0;
var RGBcolor;
initColorPicker();
initColorChanger();
var sliderVal = 1;
var zoomed = false;
var zoomtrace = null;
drawboard();
var mouseflag = false;
initMouseFlag();
var mousedownon = -1;
var colors = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [0, 0, 0], [255, 255, 255]];
var penstartctx =  -1;
init();

function init(){
    for(var i = 0; i < colors.length; i++){
        setColor(colors[i],i)
    }
    chooseColor(0);
    setBlender(colors[0],colors[1]);
    setSlider(colors[1]);
}



function drawboard() {
    var s;
    for (var i = 0; i < dimx; i += 1) {
        for (var j = 0; j < dimy; j += 1) {

            var pos = j * dimx * 4 + i * 4;

            var h = pickercontext.left + i / dimx * pickercontext.width;
            s = sliderVal;
            var l = pickercontext.top + j / dimy * pickercontext.height;

            var rgb = hslToRgb(h, s, l);

            imgData.data[pos + 0] = rgb[0];
            imgData.data[pos + 1] = rgb[1];
            imgData.data[pos + 2] = rgb[2];
            imgData.data[pos + 3] = 255;
        }
    }

    ctx.putImageData(imgData, 0, 0);
}




function initColorPicker() {

    var canvasEl = document.getElementById('myCanvas');
    var canvasContext = canvasEl.getContext('2d');


    //canvasEl.onmousemove = mousehandler;

    function mousehandler(mouseEvent) {
        if (mouseflag) {

            drawboard();

            var imgData = canvasContext.getImageData(mouseEvent.offsetX, mouseEvent.offsetY, 1, 1);
            var rgba = imgData.data;

            setColor(rgba, selectedcolor);

            colors[selectedcolor] = rgba;


            //console.log("x" + mouseEvent.offsetX);
            //console.log("y" + mouseEvent.offsetY);


            ctx.beginPath();
            ctx.arc(mouseEvent.offsetX, mouseEvent.offsetY - 30, 15, 0, 2 * Math.PI, false);
            ctx.fillStyle = "rgb(" + rgba[0] + "," + rgba[1] + "," + rgba[2] + ")";
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#003300';
            ctx.stroke();

            //alert("rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ", " + rgba[3] + ")");
        }
    }
}

function initColorChanger() {
    for (var i = 0; i < 5; i++) {
        var str = "color" + i
        var palel = document.getElementById(str);
        palel.onclick = palelclick

        function palelclick(event) {
            for (var i = 0; i < 5; i++) {
                x = document.getElementById("color" + i);
                x.style.border = "1px solid #000000";
            }


            num = event.srcElement.id.match(/\d+/)[0];
            selectedcolor = num;
            x = document.getElementById("color" + num);
            x.style.border = "5px solid #000000";

        }
    }
}

function startdrawing(event){
    console.log("startdrawing")
    var traceel = {
        x: event.offsetX,
        y: event.offsetY
    };
    pointertrace.push(traceel); 
    drawcanvas.addEventListener("pointermove", logpointer);

    console.log(traceel)

    if (0 < traceel.y && traceel.y < heightslider){
        penstartctx = 0;
        updateSlider(traceel.x/5)
    } 
    else if(traceel.y < dimy + heightslider){
        penstartctx = 1;
        var imgData = ctx.getImageData(event.offsetX, event.offsetY - heightslider, 1, 1);
        var rgba = imgData.data;
    }
    else if(traceel.y < heightslider + dimy + heightcolors){
        penstartctx = 2
    }
    else if(traceel.y < heightslider + dimy + heightcolors + heightblender){
        penstartctx = 3
    }
    console.log(penstartctx)
}

function enddrawing(event){
    console.log("enddrawing")
    //console.log(e.pressure)
    drawcanvas.removeEventListener("pointermove", logpointer);
    //console.log(pointertrace)
    if(penstartctx == 1){
        if(isPolygon(pointertrace) && !zoomed){
            //console.log(penstartctx)
            var pts = getsquarepoints(pointertrace)
            
            var newpickercontext = {
                left : pts[0].x / dimx,
                top : (pts[0].y - heightslider) / dimy,
                width : (pts[1].x - pts[0].x) / dimx,
                height: (pts[1].y - pts[0].y) / dimy,
                slidervalue: 1
            }

            //console.log(pts);

            var newtrace = resizetrace(pointertrace, newpickercontext);
            zoomtrace = newtrace;
            drawctx.clearRect(0, 0, drawcanvas.width, drawcanvas.height);

            drawpolygon(zoomtrace);

            pickercontext = newpickercontext;
            drawboard();
            zoomed = true;
        }
        else if (zoomed){

            var count = 0;

            for(var i = 0; i < zoomtrace.length - 2; i++){
                for(var j = 0; j < pointertrace.length - 2; j++){
                    if(intersects(zoomtrace[i], zoomtrace[i+1], pointertrace[j],pointertrace[j+1])){
                        count++;
                    }
                    
                }
            }
            if(count > 2){
                pickercontext = defaultpickercontext;
                drawboard();
                zoomed = false;
            }

            else{
                selectColorIfOnBoard(pointertrace[pointertrace.length - 1]);
            }

        }
        else {
            selectColorIfOnBoard(pointertrace[pointertrace.length - 1])
        }
    }
    else if (penstartctx == 2){

        var pendown = eventOn(pointertrace[0]);
        var penup = eventOn(pointertrace[pointertrace.length-1]);

        
        if(penup == pendown && penup != -1){
            chooseColor(penup)
        }

        else if (Math.min(penup,pendown) >=0){
            console.log("blend")
            setBlender(colors[pendown], colors[penup])
        }
        else if (pendown >=0 && penup == -1){
            var lastel = pointertrace[pointertrace.length-1];
            if(lastel.y >= heightslider && lastel.y <= heightslider + dimx && lastel.x >= 0 && lastel.x <= dimy){
                var imgData = ctx.getImageData(event.offsetX, event.offsetY - heightslider, 1, 1);
                var rgb = imgData.data;
                setBlender(colors[pendown],rgb);
            }
            else if (lastel.y >= heightslider + dimx + heightcolors && lastel.y <= heightslider + dimx + heightcolors + heightblender && lastel.x >= 0 && lastel.x <= dimy){
                var blender = document.getElementById("blender");
                bctx = blender.getContext('2d');
                var imgData = bctx.getImageData(event.offsetX, event.offsetY - heightslider - dimy - heightcolors, 1, 1);
                var rgb = imgData.data
                setBlender(colors[pendown],rgb);
            }
        }

        
    }

    else if (penstartctx == 3){
        selectColorIfOnBoard(pointertrace[pointertrace.length - 1])
    }

    //interprettrace()
    clearboard();

    pointertrace = [];
    //drawctx.clearRect(0, 0, canvel.width, canvel.height);
}

function logpointer(event){
    var traceel = {x: event.offsetX,
                y: event.offsetY};
    

    var lastel = pointertrace[pointertrace.length-1];

    if (penstartctx == 0){
        if(traceel.x - lastel.x != 0){
        updateSlider(traceel.x/5)
        }
    } else {
        drawctx.beginPath();
        drawctx.moveTo(lastel.x, lastel.y);
        drawctx.lineTo(traceel.x, traceel.y);
        drawctx.stroke(); 

        if (penstartctx == 1){
            var imgData = ctx.getImageData(event.offsetX, event.offsetY - heightslider, 1, 1);
            var rgba = imgData.data;
        }

    } 

    var pointerpos = traceel;
    pointertrace.push(traceel); 

}


function setColor(rgbcolor, number) {
    //this.aww.setStrokeColor(rgbtohex(rgbcolor));
    colors[number] = rgbcolor;
    var str = "color" + number;
    //console.log(str);
    var el = document.getElementById("color" + number);
    //console.log(el)

    var cctx = el.getContext("2d");
    var colData = cctx.createImageData(50, 50);

    for (var i = 0; i < colData.data.length; i += 4) {
        colData.data[i + 0] = rgbcolor[0];
        colData.data[i + 1] = rgbcolor[1];
        colData.data[i + 2] = rgbcolor[2];
        colData.data[i + 3] = 255;
    }
    cctx.putImageData(colData, 0, 0);
    setSlider(rgbcolor);
    setColorAPI(rgbcolor);
    //$("#color-input").val(rgbtohex(rgbcolor));


}

function setSlider(rgbcolor){

    var topslider = document.getElementById("topslider");
    var topsliderctx = topslider.getContext('2d');

    var sliderImgData = topsliderctx.createImageData(dimx, heightslider);


    var hslcolor = rgbToHsl(rgbcolor);

    var h = hslcolor[0];
    var s = hslcolor[1];
    var l = hslcolor[2];


    for (var j = 0; j < dimx; j++){

        var s = j / dimy;
        var rgb = hslToRgb(h, s, l);

        for (var i = 0; i < heightslider; i++){

            var pos = i * dimx * 4 + j * 4;

            sliderImgData.data[pos + 0] = rgb[0];
            sliderImgData.data[pos + 1] = rgb[1];
            sliderImgData.data[pos + 2] = rgb[2];
            sliderImgData.data[pos + 3] = 255;

        }
    }
    //console.log(sliderImgData)
    topsliderctx.putImageData(sliderImgData, 0, 0);
}

function clearboard(){
    drawctx.clearRect(0, 0, drawcanvas.width, drawcanvas.height);
    if(zoomed){
        drawpolygon(zoomtrace);
    }
}

function selectColorIfOnBoard(coordinates){
    var lastel = coordinates
    if(lastel.y >= heightslider && lastel.y <= heightslider + dimx && lastel.x >= 0 && lastel.x <= dimy){
        var imgData = ctx.getImageData(event.offsetX, event.offsetY - heightslider, 1, 1);
        var rgb = imgData.data
        setColor(rgb, selectedcolor)
    }
    else if (lastel.y >= heightslider + dimx + heightcolors && lastel.y <= heightslider + dimx + heightcolors + heightblender && lastel.x >= 0 && lastel.x <= dimy){
        var blender = document.getElementById("blender");
        var bctx = blender.getContext('2d');
        var imgData = bctx.getImageData(event.offsetX, event.offsetY - heightslider - dimy - heightcolors, 1, 1);
        var rgb = imgData.data
        setColor(rgb, selectedcolor)
    }

}

function setBlender(color1, color2) {
    var blender = document.getElementById("blender");
    var bctx = blender.getContext('2d');

    var bleImgData = ctx.createImageData(dimx, dimy);

    var colorRGB;

    for (var i = 0; i < dimx; i++) {

        colorRGB = linearRGBBlending(color1, color2, (dimx - i) / dimx);


        for (var j = 0; j < 50; j++) {

            var pos = j * dimx * 4 + i * 4;

            bleImgData.data[pos + 0] = colorRGB[0];
            bleImgData.data[pos + 1] = colorRGB[1];
            bleImgData.data[pos + 2] = colorRGB[2];
            bleImgData.data[pos + 3] = 255;

        }
    }
    bctx.putImageData(bleImgData, 0, 0);
}


function updateSlider(slideAmount) {
    var sliderDiv = document.getElementById("sliderAmount");
    sliderVal = slideAmount / 100;
    //console.log(sliderVal);
    drawboard();
    //console.log(slideAmount);
}

function initMouseFlag(e) {

    drawcanvas.addEventListener('contextmenu', event => event.preventDefault());


    otherels.onpointerdown = function (e) {
        e.preventDefault();

        if(e.pointerType == 'mouse' && e.button == 2){
            if(zoomed){
                return
            }
            var traceel = {
                x: e.offsetX,
                y: e.offsetY
            };
            pointertrace.push(traceel);
        }
        else if(e.pointerType == 'mouse'){
            startdrawing(e);
        }


        //console.log(mouseflag);

    }
    otherels.onpointerup = function (e) {
        e.preventDefault();

        if(e.pointerType == 'mouse' && e.button == 2){

            if(zoomed){
                pickercontext = defaultpickercontext;
                zoomtrace = [];
                zoomed = false;
                drawboard();
                clearboard();
                pointertrace=[];
                return
            }

            var traceel = {
                x: e.offsetX,
                y: e.offsetY
            };
            pointertrace.push(traceel);

            clearboard();
            p1 = {x: pointertrace[0].x, y:pointertrace[0].y};
            p2 = {x: pointertrace[0].x, y:pointertrace[pointertrace.length-1].y};
            p3 = {x: pointertrace[pointertrace.length-1].x, y:pointertrace[pointertrace.length-1].y};
            p4 = {x: pointertrace[pointertrace.length-1].x, y:pointertrace[0].y};
            p5 = {x: pointertrace[0].x, y:pointertrace[0].y};
            drawpolygon([p1,p2,p3,p4,p5]);

            zoomtrace = [p1,p2,p3,p4,p5];

            pts = [p1,p3];
            
            var newpickercontext = {
                left : pts[0].x / dimx,
                top : (pts[0].y - heightslider) / dimy,
                width : (pts[1].x - pts[0].x) / dimx,
                height: (pts[1].y - pts[0].y) / dimy,
                slidervalue: 1
            }

            //console.log(pts);

            var newtrace = resizetrace(zoomtrace, newpickercontext);
            zoomtrace = newtrace;
            drawctx.clearRect(0, 0, drawcanvas.width, drawcanvas.height);

            drawpolygon(zoomtrace);

            pickercontext = newpickercontext;
            drawboard();
            zoomed = true;

            pointertrace=[];


        }
        else if(e.pointerType == 'mouse'){
            enddrawing(e);
        }
        clearboard();
        

    }

    otherels.onpointermove = function(e) {

        if(e.pointerType == 'mouse' && e.buttons == 2){
            if(zoomed){
                return
            }
            var traceel = {
                x: e.offsetX,
                y: e.offsetY
            };
            pointertrace.push(traceel);
            clearboard();
            p1 = {x: pointertrace[0].x, y:pointertrace[0].y};
            p2 = {x: pointertrace[0].x, y:pointertrace[pointertrace.length-1].y};
            p3 = {x: pointertrace[pointertrace.length-1].x, y:pointertrace[pointertrace.length-1].y};
            p4 = {x: pointertrace[pointertrace.length-1].x, y:pointertrace[0].y};
            p5 = {x: pointertrace[0].x, y:pointertrace[0].y};
            drawpolygon([p1,p2,p3,p4,p5]);
        }
    }

}

function chooseColor(number){
    for (var i = 0; i < 5; i++) {
        x = document.getElementById("color" + i);
        x.style.border = "1px solid #000000";
    }

    selectedcolor = number;

    var x = document.getElementById("color" + number);
    x.style.border = "5px solid #000000";
    console.log(colors)
    console.log(selectedcolor);
    console.log(colors[selectedcolor])
    setColorAPI(colors[selectedcolor]);
    //this.aww.setStrokeColor(rgbtohex(colors[number]));
}


function drawpolygon(trace){

    drawctx.beginPath();
    drawctx.moveTo(trace[0].x, trace[0].y);
    var temp = trace[0];
    
    for(var i = 1; i < trace.length; i++){
        drawctx.lineTo(trace[i].x, trace[i].y);
    }

    drawctx.stroke(); 


}


//pointertrace analysis

function eventOn(coordinates){

    for(var i = 0; i < 5; i++){
        var x = document.getElementById("color" + i);
        var pos = x.offsetTop
        middle = {x: x.offsetLeft + .5 * x.offsetWidth, y: x.offsetTop + .5 * x.offsetHeight + heightslider + dimy}

        //var middle = {x: pos.x + pos.width * .5, y: pos.y + pos.height * .5}
        if(absdifp(coordinates,middle) < x.offsetWidth / 2){
            return i;
        }

    }

    return -1;
}

function isPolygon(trace){
    if(typeof trace ==='undefined' || trace.length == 0){
        return false
    }

    var pts = getsquarepoints(trace);


    return absdifp(pts[0],pts[1]) > 6 * absdifp(trace[0], trace[trace.length-1]);
}

function absdifp(p1,p2){
    return Math.sqrt(Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2))
}

function getsquarepoints(trace ){
    var maxx = trace[0].x;
    var minx = trace[0].x;
    var maxy = trace[0].y;
    var miny = trace[0].y;

    for (var i = 1; i < trace.length; i++){
        maxx = Math.max(maxx, trace[i].x);
        minx = Math.min(minx, trace[i].x);
        maxy = Math.max(maxy, trace[i].y);
        miny = Math.min(miny, trace[i].y);
    }

    var p2 = {x: maxx, y:maxy}
    var p1 = {x: minx, y:miny}

    return [p1,p2]
}

function resizetrace(trace, pctxt){
    var newtrace = [];
    for(var i = 0; i < trace.length; i++){
        var x = (trace[i].x - pctxt.left*dimx)/pctxt.width;
        var y = (trace[i].y - pctxt.top*dimy - heightslider) / pctxt.height + heightslider;
        newtrace.push({x: x, y: y})
    }

    return newtrace

}

function intersects(p1, p2, p3, p4) {
    var a = p1.x;
    var b = p1.y;
    var c = p2.x;
    var d = p2.y;
    var p = p3.x;
    var q = p3.y;
    var r = p4.x;
    var s = p4.y;

    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
  };

// blending and color conversion

function linearRGBBlending(color1, color2, percentage) {
    var retval = [0, 0, 0]
    for (var i = 0; i < 3; i++) {
        retval[i] = color1[i] * percentage + color2[i] * (1 - percentage);
    }
    return retval;
}

function linearCMYKBlending(color1, color2, percentage) {
    var cmyk1 = RgbToCmyk(color1);
    var cmyk2 = RgbToCmyk(color2);

    var newcmyk = [0, 0, 0, 0]

    for (var i = 0; i < 4; i++) {
        newcmyk[i] = cmyk1[i] * percentage + cmyk2[i] * (1 - percentage);
    }
    return CmykToRgb(newcmyk);

}

function revbayes(color1, color2, percentage) {
    var retval = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
        retval[i] = Math.pow(color1[i], percentage) * Math.pow(color2[i], (1 - percentage));
    }
    return retval;
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
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function RgbToCmyk(RGB) {

    var R = RGB[0];
    var G = RGB[1];
    var B = RGB[2];

    if ((R == 0) && (G == 0) && (B == 0)) {
        return [0, 0, 0, 1];
    } else {
        var calcR = 1 - (R / 255),
            calcG = 1 - (G / 255),
            calcB = 1 - (B / 255);

        var K = Math.min(calcR, Math.min(calcG, calcB)),
            C = (calcR - K) / (1 - K),
            M = (calcG - K) / (1 - K),
            Y = (calcB - K) / (1 - K);

        return [C, M, Y, K];
    }
}

function CmykToRgb(CMYK) {
    C = CMYK[0];
    M = CMYK[1];
    Y = CMYK[2];
    K = CMYK[3];

    var r = 255 * (1 - C) * (1 - K);
    var g = 255 * (1 - M) * (1 - K);
    var b = 255 * (1 - Y) * (1 - K);

    return [r, g, b]
}

function rgbToHsl(RGB){
    var r = RGB[0];
    var g = RGB[1];
    var b = RGB[2];

    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    //return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];

    return [h,s,l]
}

function rgbtohex(RGB){
    var r = RGB[0];
    var g = RGB[1];
    var b = RGB[2];

    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
      
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
      
    return "#" + r + g + b;
}