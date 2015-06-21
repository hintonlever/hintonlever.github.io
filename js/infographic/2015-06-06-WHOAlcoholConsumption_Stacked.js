
var dataset = [];


d3.csv("../data/AlcoholConsumption.csv",
        // file is read and passed into the function as the csv variable
                function(csv) {

                    dataset3 = csv.sort(function(a, b) {
                        return (+b.Wine + +b.Spirits + +b.Beer + +b.Other) - (+a.Wine + +a.Spirits + +a.Beer + +a.Other)
                    })
                            .slice(0, 20); // slice gives includes 0th element but excludes 10th element
                    console.log(dataset3[0]['Wine']);


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

            var c = d3.scale.category20();

            var xScale = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) {
                            return +d['Total consumption'];
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

            // Insert enclosing bar per country
            var bars = chart.selectAll(".bar")
                    .data(data).enter()
                    .append("g")
                    .attr("class", "bar")
                    .attr("width", function(d) {
                        return d['Total consumption'];
                    })
                    .attr("height", yScale.rangeBand())
                    .attr("transform", function(d, i) {
                        return "translate(0," + yScale(i) + ")";
                    });


            var splits = bars.selectAll("bar")
                    .data(function(d) {
                        var arr =
                                [{size: +d.Beer, x: 0},
                                    {size: +d.Wine, x: +d.Beer},
                                    {size: +d.Spirits, x: +d.Beer + +d.Wine},
                                    {size: +d.Other, x: +d.Beer + +d.Wine + +d.Spirits}];

                        console.log(arr);
                        return arr;
                    }).enter()
                    .append("rect")
                    .attr("x", function(d, i) {
                        return Math.round(xScale(d.x));
                    })
                    .attr("width", function(d) {
                        return Math.round(xScale(+d.size));
                    })
                    .attr("height", Math.round(yScale.rangeBand()))
                    .attr("fill", function(d, i) {
                        return c(i);
                    })
                    .attr("stroke", "white")
                    .on("mouseover", myMouseOver)
                    .on("mouseout", myMouseOut);

            function myMouseOver() {

                var split = d3.select(this);
                split.transition().duration(500)
                        .attr("stroke", "red");
            }

            function myMouseOut() {
                var split = d3.select(this);
                split.transition().duration(500)
                        .attr("stroke", "white");
            }



            svg.append("g")
                    .attr("class", "xaxis")
                    .attr("transform", "translate(" + marginleft + "," + marginupper + ")")
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
                    .attr("text-anchor", "end") // text-align: right
                    .text(function(d) {
                        return d.Country;
                    }); // toFixed() is a Javascript function for fixing rounding in strings


            var yAxis = chart.append("line")
                    .attr("y1", 0)
                    .attr("y2", h)
                    .style("stroke", "black");

        }
        ;

