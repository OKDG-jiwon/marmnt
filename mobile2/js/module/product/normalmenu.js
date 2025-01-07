var aUrl = location.href.split('?');
var sQueryString = aUrl[1];


$(function(){
    if (sQueryString && sQueryString.indexOf('sort_method') > -1) {
        for (var i=0; i<$('#selArray option').length; i++) {
            if ($('#selArray option').eq(i).val().indexOf(sQueryString) > -1) {
                $('#selArray option').eq(i).prop("selected", true);
            }
        }
    }
});

$('#selArray').on('change', function() {
    if ($('#selArray').val()) {
        location.href=$('#selArray').val();
    }
});

function goThumg(url) {
    location.href = url+'?'+sQueryString;
}