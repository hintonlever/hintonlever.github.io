/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {
    console.log("DOM ready");
    var viscontainer = $("#vis-container");

    var dataString = $.get("../data/500GreatestSongsRollingStones.csv", function(data) {


        var results = $.parse(data, {
            delimiter: ",",
            header: false,
            dynamicTyping: false
        })["results"];

        for (var i = 1; i < results.length; i++) {
            var tile = $('<div class="tile"><img id=' + i + ' src = "' + results[i][1] + '" /><a href="'+results[i][2]+'">'+(500-i+1)+'</a></div>');
            viscontainer.append(tile);
        }

    });
});

