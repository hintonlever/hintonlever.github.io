var visWidth = 800;

var vertices;
var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
var image = new Image();
var imagedata = null;
var diameter = 30;
var mouse_is_down = false;
var detailLevel;
image.onload = onLoad;


function onLoad() {
    if (canvas)
    {
        detailLevel = Math.round((visWidth + visWidth) / 2 * 8);
        image.height = Math.round(image.height * visWidth / image.width);
        image.width = visWidth;
        w = image.width;
        h = image.height;

        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext("2d");
        if (ctx)
        {
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(image, 0, 0, w, h);
            imagedata = ctx.getImageData(0, 0, w, h);
        }
        d3.select("svg").remove();
        start();
    }
}
;
image.src = "/img/face.jpg";



function getFillColor(d, i) {
    var x = Math.floor(d[0][0]);
    var y = Math.floor(d[0][1]);
    if (x + 20 > imagedata.width - 1) {
        x = imagedata.width - 1;
        return "white";
    }
    if (y + 20 > imagedata.height - 1) {
        y = imagedata.height - 1;
        return "white";
    }
    if (x - 20 < 0) {
        x = 0;
        return "white";
    }
    if (y - 20 < 0) {
        y = 0;
        return "white";
    }
    var index = 4 * (x + y * imagedata.width);
    return "rgb(" + imagedata.data[index] + "," + imagedata.data[index + 1] + "," + imagedata.data[index + 2] + ")";
}

function start()
{
    vertices = d3.range(detailLevel).map(function(d) {
        return [Math.random() * (w - 1), Math.random() * (h - 1)];
    }); // Random vertices

    var voronoi = d3.geom.voronoi();

    var svg = d3.select("#vis-container")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .on("mousedown", function() {
                mouse_is_down = true;
            })
            .on("mouseup", function() {
                mouse_is_down = false;
            })
            .on("mousemove", drawBrush);

    var g = svg.append("g");

    g.selectAll("path")
            .data(voronoi(vertices))
            .enter().append("path")
            .attr("fill", getFillColor)
            .attr("opacity", 0)
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            .transition()
            .delay(function(d, i) {
                return Math.random() * 500;
            })
            .duration(100)
            .ease("easeInOut")
            .attr("opacity", 1);



}


function drawBrush() {
    var pt = d3.mouse(this);
    if (mouse_is_down)
        update(pt);
}



function update(pt) {
    var newvertices = d3.range(10).map(function(d) {
        return [(Math.random() - 0.5) * diameter + pt[0], (Math.random() - 0.5) * diameter + pt[1]];
    });

    vertices = vertices.concat(newvertices);

    d3.select("g").selectAll("path")
            .data(d3.geom.voronoi(vertices))
            .enter()
            .append("path")
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            .attr("fill", getFillColor);
}
