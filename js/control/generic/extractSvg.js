$(document).ready(function() {
    $('#extractSVG').click(function(e) {

        function svgReady(html) {
            return html.replace(/&nbsp;/g," ");
        }

        $("svg").attr({version: '1.1', xmlns: "http://www.w3.org/2000/svg"});

        var svg = svgReady($("svg").parent().html());

        var b64 = Base64.encode(svg); // or use btoa if supported

        // Works in recent Webkit(Chrome)
        $(".extract").remove();
        $("#extract-dump > .central-container").append($("<img class='extract' src='data:image/svg+xml;base64,\n" + b64 + "' alt='file.svg'/>"));
//
//        // Works in Firefox 3.6 and Webit and possibly any browser which supports the data-uri
//        $("body").append($("<a href-lang='image/svg+xml' href='data:image/svg+xml;base64,\n" + b64 + "' title='file.svg'>Download</a>"));

    });
});