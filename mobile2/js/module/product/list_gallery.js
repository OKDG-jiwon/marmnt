$(function(){
    // Tab event
    var galleryTab = function() {
        var sModule = 'xans-product-listnormal';
        var $gallery = $('.' + sModule);
        var $galleryList = $gallery.children('ul');
        $galleryList.on('click', 'li > div.description > a', function(e) {
            var $description = $(this);
            var height = $description.height();
            $description.css({bottom: '-' + height + 'px', opacity: '0'});
            e.stopPropagation();
        });
        $gallery.on('click', 'li > div.thumbnail > a', function(e) {
            e.stopPropagation();
            var $description = $(this).parents('li').find('div.description');
            var height = $description.height();
            if (typeof($description.attr('status')) === 'undefined' || $description.attr('status') == 'hide') {
                $description.animate({
                    opacity: 1,
                    bottom: 1,
                }, 300, function() {
                    $description.attr('status', 'show');
                });
            } else {
                $description.animate({
                    opacity: 0,
                    bottom: '-' + height + 'px',
                }, 300, function() {
                    $description.attr('status', 'hide');
                });
            }
        });
    };
    galleryTab();
});