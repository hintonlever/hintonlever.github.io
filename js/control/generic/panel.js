$(document).ready(function() {
    $("#panel_content").hide();
});

function panel_content_toggle() {

    $("#panel_content").show();

    $("#panel_content").mouseleave(
            function()
            {
                $("#panel_content").hide()
            }
    );

//    if ($("#panel_content").css("margin-left") === "0px") {
//
//        ui_hide("#panel_content");
//        $("#panel_tab").css({"background-color": ""});
//    } else {
//        $("#panel_tab").css({"background-color": "whitesmoke"});
//        ui_open("#panel_content");
//
//    }
}



