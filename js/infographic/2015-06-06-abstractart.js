$(document).ready(function() {

    console.log("DOM ready");
    var w = 500,
            h = 500,
            z = d3.scale.category20c(),
            i = 0;

    var svg = d3.select("#vis-container").append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("pointer-events", "all")
            .on("mousedown", startDraw);

    function startDraw() {
        var m = d3.mouse(this);

        svg.append("circle")
                .attr("cx", m[0])
                .attr("cy", m[1])
                .attr("r", 1e-6)
                .on("mouseout",startDraw)

                .style("fill", z(++i))
                .style("stroke-opacity", 1)
                .transition()
                .duration(100)
                .ease(Math.sqrt)
                .attr("r", 25)
                


    }
});