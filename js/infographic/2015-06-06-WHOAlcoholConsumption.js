
var dataset = [];


d3.csv("../data/AlcoholConsumption.csv",
        // file is read and passed into the function as the csv variable
                function(csv) {

                    dataset = csv;

                    console.log(csv);


                    dataset2 = d3.nest()
                            .key(function(d) {
                                return d.Country;
                            })
                            .entries(dataset);

                    console.log(dataset2);

                    dataset3 = csv.sort(function(a, b) {
                        return +b.Wine - +a.Wine;
                    })
                            .slice(0, 20); // slice gives includes 0th element but excludes 10th element
                    console.log(dataset3);


                    visualise2();

                }
        );

        function visualise2() {

            var data = dataset3;

            var chartwidth = 600;
            var chartheight = 400;

            var marginleft = 100;
            var marginupper = 35;

            var w = chartwidth - marginleft;
            var h = chartheight - marginupper;

            console.log(d3.max(data, function(d) {
                return +d.Wine;
            }));

            var xScale = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) {
                            return +d.Wine;
                        })])
                    .range([0, w]);

            var yScale = d3.scale.ordinal()
                    .domain(d3.range(data.length))
                    .rangeBands([0, h]);

            var xAxis = d3.svg.axis()
                    .scale(xScale)

                    .orient("top");

            var svg = d3.select("#vis-container").append("svg")
                    .attr("width", chartwidth)
                    .attr("height", chartheight);

            var chart = svg.append("g")
                    .attr("class", "chart")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("transform", "translate(" + marginleft + "," + marginupper + ")");

            // Initialise
            var bars = chart.selectAll("rect")
                    .data(data).enter()
                    .append("rect")
                    .attr("width", 0)
                    .attr("fill", "steelblue")
                    .attr("stroke", "white")
                    .attr("height", yScale.rangeBand())
                    .attr("x", 0)
                    .attr("y", function(d, i) {
                        return yScale(i);
                    });

            bars.transition(1500)
                    .attr("width", function(d) {
                        return xScale(+d.Wine);
                    });

            var labels = chart.selectAll("text")
                    .data(data).enter()
                    .append("text")
                    .attr("class", "label")
                    .attr("y", function(d, i) {
                        return yScale(i) + yScale.rangeBand() / 2;
                    })
                    .attr("x", function(d) {
                        return xScale(+d.Wine);
                    })
                    .attr("dx", -3) // padding-right
                    .attr("dy", ".35em") // vertical-align: middle
                    .attr("text-anchor", "end") // text-align: right
                    .attr("shape-rendering", "crispEdges")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "9px")
                    .attr("fill", "white")
                    .text(function(d) {
                        return d.Wine;
                    }); // toFixed() is a Javascript function for fixing rounding in strings

            svg.append("g")
                    .attr("class", "xaxis")
                    .attr("transform", "translate(" + marginleft + "," + marginupper + ")")
                    .attr("shape-rendering", "crispEdges")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "9px")

                    .call(xAxis);



            var yticks = chart.selectAll(".yticks")
                    .data(data).enter()
                    .append("text")
                    .attr("class", "yticks")
                    .attr("y", function(d, i) {
                        return yScale(i) + yScale.rangeBand() / 2;
                    })
                    .attr("x", 0)
                    .attr("dx", -3) // padding-right
                    .attr("dy", ".35em") // vertical-align: middle
                    .attr("shape-rendering", "crispEdges")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "9px")
                    .attr("fill", "black")
                    .attr("text-anchor", "end") // text-align: right
                    .text(function(d) {
                        return d.Country;
                    }); // toFixed() is a Javascript function for fixing rounding in strings


            var yAxis = chart.append("line")
                    .attr("y1", 0)
                    .attr("y2", h);

            svg.selectAll("line")
                    .style("stroke-width", "1")
                    .style("fill", "white")
                    .style("stroke", "black");
            svg.selectAll(".domain")
                    .style("stroke-width", "1")
                    .style("fill", "none")
                    .style("stroke", "black");
        }
        ;