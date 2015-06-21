function funnel(width, height, label_w) {
    this.width = width;
    this.height = height;
    this.label_w = label_w;
    this.funnel_w = width - label_w;
    this.sectionHeight = 0;
    this.data = [];
    this.data_grouped = [];
    this.sortKey = "";
    this.groupKey = "";
    this.sort = function(sortKey, order) {
        this.sortKey = sortKey;
        this.data_grouped.sort(function(a, b) {
            if (a[sortKey] < b[sortKey])
                return 1 * order;
            if (a[sortKey] > b[sortKey])
                return -1 * order;
            return 0;
        });
    };
    this.max = function(maxKey) {
        return Math.max.apply(null, this.data_grouped.map(function(el) {
            return el[maxKey];
        }));
    };
    this.min = function(maxKey) {
        return Math.min.apply(null, this.data_grouped.map(function(el) {
            return el[maxKey];
        }));
    };
}

var myFunnel = new funnel(500, 400, 300);

function sortUpdate(dynamicKey) {
    myFunnel.sortKey = dynamicKey;
    chartDraw(myFunnel);
}

function groupUpdate(dynamicKey) {
    myFunnel.groupKey = dynamicKey;
    chartDraw(myFunnel);
}


function chartDraw(funnel) {
    groupData(myFunnel.groupKey);
    console.log("DATA GROUPED ON:" + myFunnel.groupKey );
    
    myFunnel.sort(myFunnel.sortKey, 1);
    console.log("DATA SORTED ON:"+ myFunnel.sortKey );

    console.log("graph updating...");

    myFunnel.sectionHeight = myFunnel.height / myFunnel.data_grouped.length;
    
    var colorScale = d3.scale.linear()
            .domain([0, funnel.max("value_top")])
            .range([0, 120]);

    function colorPicker(value) {
        // hsla(hue,saturation,lightness,alpha)
        return "hsla(" + colorScale(value) + ",100%,50%,0.4)";
    }

    var xScale = d3.scale.linear()
            .domain([0, funnel.max("value_top")])
            .range([0, funnel.funnel_w])
            .nice();

    var bars = d3.select("svg").select(".chart_graphic").selectAll("rect").data(funnel.data_grouped);
    var text = d3.select("svg").select(".chart_labels").selectAll(".label").data(funnel.data_grouped);

    // Remove selection
    bars.exit().remove();
    text.exit().remove();
    d3.select("svg").selectAll("title").data(funnel.data_grouped).exit().remove();

    // Enter selection
    bars.enter()
            .append("rect")
            .attr("width", 0)
            .attr("height", funnel.sectionHeight)
            .attr("x", function(d) {
                return funnel.label_w + funnel.funnel_w / 2;
            })
            .attr("y", function(d, i) {
                return funnel.sectionHeight * i;
            })
            .append("title") // for tooltips
            .text(function(d) {
                return d.value_top;
            });

    text.enter()
            .append("text")
            .attr("class", "label")
            .attr("y", function(d, i) {
                return funnel.sectionHeight * (i + 1 / 2);
            })
            .attr("x", funnel.label_w)
            .attr("dx", -10) // padding-right
            .attr("dy", ".35em") // vertical-align: middle
            .attr("text-anchor", "end") // text-align: right
            .text(function(d) {
                return d.name;
            });


    // Update selection
    bars.transition()
            .attr("y", function(d, i) {
                return funnel.sectionHeight * i;
            })
            .attr("height", funnel.sectionHeight)
            .attr("x", function(d) {
                return funnel.label_w - xScale(d.value_top) / 2 + funnel.funnel_w / 2;
            })
            .attr("width", function(d) {
                return xScale(d.value_top);
            })
            .attr("fill", function(d) {
                return colorPicker(d.value_top);
            });

    d3.select("svg").selectAll("title").data(funnel.data_grouped).text(function(d) {
        return d.value_top;
    });


    text.transition()
            .attr("y", function(d, i) {
                return funnel.sectionHeight * (i + 1 / 2);
            })
            .text(function(d) {
                return d.name;
            });


}

function groupData(groupIndex) {
    function data_point(name, value_top, value_bot) {
        this.name = name;
        this.value_top = value_top;
        this.value_bot = value_bot;
    }
    function groupList() {
        this.data = [];
        this.contains = function(value) {
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i] === value)
                    return true;
            }
            return false;
        };
    }
    var uniqueList = new groupList;
    var dataArray = [];

    for (var i = 1; i <= 250; i++) {
        if (!uniqueList.contains(myFunnel.data[i][groupIndex])) {
            uniqueList.data.push(myFunnel.data[i][groupIndex]);
            dataArray.push(new data_point(myFunnel.data[i][groupIndex], 1, 1));
        }
        else {
            var index = uniqueList.data.indexOf(myFunnel.data[i][groupIndex]);
            dataArray[index].value_top++;
            dataArray[index].value_bot++;
        }
    }
    
    myFunnel.data_grouped = dataArray;
}


$(document).ready(function() {
    console.log("DOM ready");

    $.get("/data/imdb250top.txt", function(dataRaw) {

        // 0 rank, 1 name, 2 year, 3 rating, 4 votes 5 imglink 6 imdblink
        myFunnel.data = $.parse(dataRaw, {
            delimiter: "\t",
            header: false,
            dynamicTyping: false
        })["results"];

        function floor(number, nearest) {
            return Math.floor(number / nearest) * nearest;
        }

        // fake some new columns
        for (var i = 0; i < myFunnel.data.length; i++)
        {
            myFunnel.data[i][7] = floor(myFunnel.data[i][2], 10); // Decade
            myFunnel.data[i][8] = floor(myFunnel.data[i][3], 0.1); // Rank rounded
            myFunnel.data[i][9] = floor(myFunnel.data[i][4], 50000); // Votes rounded
        }

        // Create the SVG
        var svg = d3.select("#vis-container").append("svg")
                .attr("width", myFunnel.width)
                .attr("height", myFunnel.height);

        svg.append("g").attr("class", "chart_labels");

        svg.append("g").attr("class", "chart_graphic")
                .attr("transform", "translate(" + myFunnel.label_w + "px," + 0 + "px)");

        // Default settings        
        myFunnel.groupKey = 7;
        myFunnel.sortKey = "value_top";
        
        chartDraw(myFunnel);

    });
});

