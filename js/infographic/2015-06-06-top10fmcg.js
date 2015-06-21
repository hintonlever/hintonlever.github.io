$(document).ready(function() {
    var w = 600,
            h = 600,
            r = 500,
            x = d3.scale.linear().range([0, r]),
            y = d3.scale.linear().range([0, r]),
            node = [],
            root;
    var pack = d3.layout.pack()
            .size([r, r])
            .children(function(d) {
                return  (typeof (d.values) === 'undefined') ? null : d.values;
            })
            .value(function(d) {
                return  (typeof (d.values) === 'undefined') ? null : d.values;
            });
    var vis = d3.select("#vis-container").append("svg:svg")
            .attr("width", w)
            .attr("height", h)
            .append("g")
            .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");
    function fontsize(d) {
        switch (d.depth)
        {
            case 0:
                return 16;
                break;
            case 1:
                return 14;
                break;
            default:
                return 12;
                break;
        }

    }

    $()

    d3.csv("../data/Top10FMCG.csv", function(d) {

        var temp = {"key": "Top 10 FMCG",
            "values": d3.nest()
                    .key(function(r) {
                        return r.Company;
                    })
                    .key(function(r) {
                        return r.BrandGroup;
                    })
                    .key(function(r) {
                        return r.Brand;
                    })
                    .rollup(function(leaves) {
                        return leaves.length;
                    })
                    .entries(d)};
//                console.log("CSV as nested array");
//                console.log(temp);

        var test2 = temp;
        nodes = pack.nodes(test2);
        console.log("Nodes:");
        console.log(nodes);
        vis.selectAll("circle")
                .data(nodes)
                .enter().append("circle")
                .attr("class", function(d) {
                    return d.children ? "parent" : "child";
                })
                .attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                })
                .attr("r", function(d) {
                    return Math.round(d.r);
                })
                .on("click", function(d) {
                    return zoom(node === d ? root : d);
                });
        vis.selectAll("text")
                .data(nodes)
                .enter()
                .append("text")
                .attr("class", function(d) {
                    return d.children ? "parent" : "child";
                })
                .attr("x", function(d) {
                    return d.x;
                })
                .attr("y", function(d) {
                    return  d.depth === 0 ? d.y - d.r : d.y;
                })
                .attr("dy", ".35em")
                .style("font-size", fontsize(d))
                .attr("text-anchor", "middle")
                .style("opacity", function(d) {
                    return d.depth < 2 ? 1 : 0;
                })
                .text(function(d) {
                    return d.key;
                });
//                d3.select(window).on("click", function() {
//                    zoom(root);
//                });
    });
    function zoom(d, i) {
        var k = r / d.r / 2;
        var depthfocus = d.depth;
        x.domain([d.x - d.r, d.x + d.r]);
        y.domain([d.y - d.r, d.y + d.r]);
        var t = vis.transition()
                .duration(d3.event.altKey ? 7500 : 750);
        t.selectAll("circle")
                .attr("cx", function(d) {
                    return x(d.x);
                })
                .attr("cy", function(d) {
                    return y(d.y);
                })
                .attr("r", function(d) {
                    return k * d.r;
                });
        t.selectAll("text")
                .attr("x", function(d) {
                    return x(d.x);
                })
                .attr("y", function(d) {
                    return y(d.depth === depthfocus ? d.y - d.r : d.y);
                })
                .style("opacity", function(d) {
                    return d.depth < depthfocus + 2 ? 1 : 0;
                });
        d3.event.stopPropagation();
    }
    ;
});