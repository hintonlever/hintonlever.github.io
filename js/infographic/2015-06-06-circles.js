$(document).ready(function() {
    
    console.log("DOM ready");
    var w = 500,
            h = 500,
            z = d3.scale.category20c(),
            i = 0;

    var svg = d3.select("#vis-container").append("svg")
            .attr("width", w)
            .attr("height", h)
            .on("mousemove",particle);


    function particle() {
        var m = d3.mouse(this);
        svg.append("circle")
                .attr("cx", m[0])
                .attr("cy", m[1])
                .attr("r", 1e-6)
                .style("stroke", z(++i))
                .style("stroke-width",2)
                .style("stroke-opacity", 1)
                .style("fill","none")
                .transition()
                .duration(2000)
                .ease(Math.sqrt)
                .attr("r", 100)
                .style("stroke-opacity", 0)
                .remove();
    }
});