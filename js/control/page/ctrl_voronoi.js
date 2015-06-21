function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {

            $("#blah").attr("src",e.target.result);
            image.src = e.target.result;
            onLoad();
        };

        reader.readAsDataURL(input.files[0]);
    }
}