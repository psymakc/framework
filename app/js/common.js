$(document).foundation();

$(window).on('load', function() {
    $(window).on('changed.zf.mediaquery', function(event, newSize, oldSize) {
        console.log(newSize);
    });
});
