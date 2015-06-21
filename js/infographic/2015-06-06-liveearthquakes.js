function chart() {
    this.data = [];
    this.map = [];
    this.overlay = [];
    this.colorScale = d3.scale.linear()
            .domain([0, 1000])
            .range([120, 0]); // Red to green
    this.rScale = d3.scale.linear().domain([6, 9]).range([5, 30]);
    this.max = function(maxKey) {
        return Math.max.apply(null, this.data.features.map(function(el) {
            return el.properties[maxKey];
        }));
    };
    this.min = function(minKey) {
        return Math.min.apply(null, this.data.features.map(function(el) {
            return el.properties[minKey];
        }));
    };
    this.colorDomain = function(domain) {
        if (domain) {
            this.colorScale.domain(domain);
        }
        return this.colorScale.domain();
    };
    this.rDomain = function(domain) {
        if (domain) {
            this.rScale.domain(domain);
        }
        return this.Scale.domain();
    };
}

function colorPicker(value) {
// hsla(hue,saturation,lightness,alpha)
    return "hsla(" + myChart.colorScale(value) + ",100%,50%,0.5)";
}

function getData() {

    // StartDate 
    var startdate = $("#queryStartDate").val();

    // Min magnitude
    var minmagnitude = $("#queryMinMag").val();

    // Update Scales
    myChart.rScale.domain()[0] = minmagnitude;

    // update filters
    var filterMinDate = Date.parse(startdate);
    var today = new Date();
    var filterMaxDate = Date.parse(today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());


    $("#filterMinMag").val(minmagnitude).attr("min", minmagnitude);

 
    $("#slider-range").slider({
        range: true,
        min: filterMinDate,
        max: filterMaxDate,
        values: [filterMinDate, filterMaxDate],
        change: function(event, ui) {
            $("#amount").val(dateToString(new Date(ui.values[ 0 ])) + " - " + dateToString(new Date(ui.values[ 1 ])));
            filterResults();
        }
    });


    var test = dateToString(new Date($("#slider-range").slider("values", 0))) +
            " - " + dateToString(new Date($("#slider-range").slider("values", 1)));
    $("#amount").val(test);


    var script_element = document.createElement('script');
    script_element.charset = "jsonp";
    script_element.src = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';
    //script_element.src = 'http://www.usgs.gov/fdsnws/event/1/query?starttime=' + startdate + '&format=geojson&minmagnitude=' + minmagnitude + '&callback=responseSuccess';
    document.getElementsByTagName('head')[0].appendChild(script_element);



    

}

function responseSuccess(data) {

// Add data to my chart
    myChart.data = data;
    console.log("DATA UPDATED");
    updateData();

}

function filterResults() {
    //Get filters from controls
    var minMagnitude = $("#filterMinMag").val();

    var maxDate = $("#slider-range").slider("values", 1);
    var minDate = $("#slider-range").slider("values", 0);



    d3.selectAll(".marker").filter(function(d) {
        return ((d.value.properties.time < minDate)
                || d.value.properties.time > maxDate)
                || d.value.properties.mag < minMagnitude;
    })
            .select("circle").transition()
            .duration(1000)
            .attr("r", 0);



    d3.selectAll(".marker").filter(function(d) {
        // to be included


        return !(((d.value.properties.time < minDate)
                || d.value.properties.time > maxDate)
                || d.value.properties.mag < minMagnitude);
    })
            .select("circle").transition()
            .duration(1000)
            .attr("r", function(d) {
                return myChart.rScale(d.value.properties.mag);
            });
    console.log("FILTERED RESULTS");
}

function updateData() {
    var layer = d3.select(myChart.overlay.getPanes().overlayLayer).select("div");

    var projection = myChart.overlay.getProjection();
    var marker = layer.selectAll(".marker")
            .data(d3.entries(myChart.data.features));

    marker.exit().remove(); // exit selection
    marker.each(transform); // update selection

    var svg = marker.enter().append("svg") // enter selection
            .each(transform)
            .attr("class", "marker")
            .attr("width", function(d) {
                return 2 * myChart.rScale(d.value.properties.mag);
            })
            .attr("height", function(d) {
                return 2 * myChart.rScale(d.value.properties.mag);
            })

    svg.append("circle")
            .attr("r", function(d) {
                return myChart.rScale(d.value.properties.mag);
            })
            .attr("fill", function(d) {
                return colorPicker(d.value.geometry.coordinates[2]);
            })
            .attr("cx", function(d) {
                return myChart.rScale(d.value.properties.mag);
            })
            .attr("cy", function(d) {
                return myChart.rScale(d.value.properties.mag);
            })
            .on("click",function() {console.log("hello");});


    function transform(d) {
        var paddingx = myChart.rScale(d.value.properties.mag);
        var paddingy = myChart.rScale(d.value.properties.mag);
        d = new google.maps.LatLng(d.value.geometry.coordinates[1], d.value.geometry.coordinates[0]);
        d = projection.fromLatLngToDivPixel(d);
        return d3.select(this)
                .style("left", (d.x - paddingx) + "px")
                .style("top", (d.y - paddingy) + "px");
    }

}


function dateToString(date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}


// Global chart object
var myChart = new chart();
myChart.overlay = new google.maps.OverlayView();
myChart.overlay.onAdd = function() {
    d3.select(myChart.overlay.getPanes().overlayLayer)
            .append("div")
            .attr("class", "stations");
};
myChart.overlay.draw = function() {
    updateData();
};

google.maps.event.addListener(myChart.map, 'click', function(event) {
            placeMarker(event.latLng);
        });

d3.selection.prototype.size = function() {
    var n = 0;
    this.each(function() {
        ++n;
    });
    return n;
};


$(document).ready(function() {
    console.log("DOM ready");

    myChart.map = new google.maps.Map(d3.select("#vis-container").node(), {
        zoom: 2,
        center: new google.maps.LatLng(0, 0),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });
    myChart.overlay.setMap(myChart.map);
    console.log("MAP CREATED");

    getData();
});


function animate() {
    var maxDate = $("#slider-range").slider("option", "max");
    var minDate = $("#slider-range").slider("option", "min");
    var olddate = minDate;

    var window = 100; // range of days.
    var interval = 50; // steps of days
    var i = 0;
    function nextStep() {





        var nextStartDate = new Date(olddate);
        nextStartDate.setDate(nextStartDate.getDate() + i * interval);

        var nextEndDate = new Date(olddate);
        nextEndDate.setDate(nextEndDate.getDate() + window + i * interval);

        if (nextStartDate < maxDate)
        {
            console.log("ANIMATE STEP");
            $("#slider-range").slider("values", 0, nextStartDate.valueOf());
            $("#slider-range").slider("values", 1, nextEndDate.valueOf());
            setTimeout(function() {
                nextStep();
            }, 1000);
        }
        i++;


    }

    nextStep();

}