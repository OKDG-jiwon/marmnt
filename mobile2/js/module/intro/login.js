// placeholder
if ($('.xans-member-login').val() != undefined) {
    $('#member_id').attr('placeholder', 'ID or email');
    $('#member_passwd').attr('placeholder', 'Password');
}

// keyboard
$('.keyboard button').on('click', function(){
    if($(this).hasClass('selected')==true){
        $('.keyboard .btnKey').removeClass('selected');
        $('.view div').hide();
    }
    else{
        $('.keyboard .btnKey').removeClass('selected');
        $('.view div').hide();
        $(this).addClass('selected');
        var key=$(this).attr('title');
        $(this).parent().next().children('.'+key+'').show();
    }
});

// toggle
$('.tab').each(function(){
    var selected = $(this).find('> ul > li.selected > a');
    if(selected.siblings('ul').length <= 0){
        $(this).removeClass('gExtend');
    }
});
$('body').on('click', '.eTab a', function(e){
    var _target = $(this).attr('href');
    if (_target == '#member') {
        $('#member_login_module_id').show();
        $('#order_history_nologin_id').hide();
    } else {
        $('#member_login_module_id').hide();
        $('#order_history_nologin_id').show();
    }
    e.preventDefault();
});