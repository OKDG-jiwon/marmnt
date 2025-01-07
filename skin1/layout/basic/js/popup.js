/**
 *  Popup resize
 */

function setResizePopup() {
    var iWrapWidth    = $('#popup').width();
    var iWrapHeight   = $('#popup').height();

    var iWindowWidth  = $(window).width();
    var iWindowHeight = $(window).height();

    window.resizeBy(iWrapWidth - iWindowWidth, iWrapHeight - iWindowHeight);
}
setResizePopup();


$(function() {
    setTimeout(function() {
        setResizePopup();
    });
});