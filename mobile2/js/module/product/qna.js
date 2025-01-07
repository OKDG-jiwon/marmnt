/**
 * Q&A
 */
$(function(){
    $('.xans-product-qna a').on('click', function(e) {
        e.preventDefault();

        var no = $(this).attr('href').replace(/(\S*)[?&]no=(\d+)(\S*)/g, '$2');
        var $obj = $('#product-qna-read_'+no);


        if ($obj.length > 0) {
            if ($obj.css('display') =='none') {
                $obj.show();
            } else {
                $obj.hide();
            }
            return;
        }

        QNA.getReadData($(this));
    });


    var href = document.location.href.split('#')[1];
    if (href == 'use_qna' || href == 'prdQnA') {
        $('a[name="use_qna"]').trigger('click');
    }
});

var PARENT = '';

var OPEN_QNA = '';

var QNA = {
    getReadData : function(obj, eType)
    {
        if (obj != undefined) {
            PARENT = obj;
            var sHref = obj.attr('href');
            var pNode = obj.parents('li');
            var pass_check = '&pass_check=F';
        } else {
            var sHref = PARENT.attr('href');
            var pNode = PARENT.parents('li');
            var pass_check = '&pass_check=T';
        }

        var sQuery = sHref.split('?');

        var sQueryNo = sQuery[1].split('=');
        if (OPEN_QNA == sQueryNo[1]) {
            $('#product-qna-read').remove();
            OPEN_QNA = '';
            return false;
        } else {
            OPEN_QNA = sQueryNo[1];
        }

        $.ajax({
            url : '/exec/front/board/product/6?'+sQuery[1]+pass_check,
            dataType: 'json',
            success: function(data) {
                $('#product-qna-read').remove();

                var sPath = document.location.pathname;
                var sPattern = /^\/product\/(.+)\/([0-9]+)(\/.*)/;
                var aMatchResult = sPath.match(sPattern);

                if (aMatchResult) {
                    var iProductNo = aMatchResult[2];
                } else {
                    var iProductNo = getQueryString('product_no');
                }

                var aHtml = [];


                if (false === data.read_auth && eType == undefined) {
                    alert(data.alertMSG);
                    return false;
                }

                if (data.is_secret == true) {

                    aHtml.push('<form name="SecretForm_6" id="SecretForm_6">');
                    aHtml.push('<input type="text" name="a" style="display:none;">');
                    aHtml.push('<div class="view secret">');
                    aHtml.push('<span class="alert">This message is password protected.<br>Please enter your password.</span>');
                    aHtml.push('<p><input type="password" id="secure_password" name="secure_password" onkeydown="if (event.keyCode == 13) '+data.action_pass_submit+'"> <input type="button" value="OK" onclick="'+data.action_pass_submit+'" class="btnStrong"></p>');
                    aHtml.push('</div>');
                    aHtml.push('</form>');
                } else {

                    if (data.read['content_image'] != null) {
                        var sImg = data.read['content_image'];
                    } else {
                        var sImg = '';
                    }

                    aHtml.push('<div class="view '+ data.read['block_content_class'] +'">');
					aHtml.push('<div id="ec-ucc-media-box-'+ data.read['no'] +'"></div>');
                    aHtml.push('<p class="attach">'+sImg+'</p>');
                    aHtml.push('<p>'+data.read['content']+'</p>');
                    aHtml.push('</div>');
                    aHtml.push('<div class="ec-base-button">');
                    if (data.comment != undefined) {
                        aHtml.push('<div class="gLeft">');
                        aHtml.push('<a href="#none" class="btnNormal mini" onclick="QNA.comment_view('+data.read['no']+');"><img src="//img.echosting.cafe24.com/skin/mobile_en_US/board/btn_comment_view.png" width="13" height="13" alt="See Comment"> <em>('+data.read['comment_count']+')</em></a> <a href="#none" class="btnNormal mini" onclick="QNA.comment_write(this);"><img src="//img.echosting.cafe24.com/skin/mobile_en_US/board/btn_comment_write.png" width="13" height="13" alt="Write"></a>');
                        aHtml.push('</div>');
                    }
                    aHtml.push('<a href="#none" class="btnNormal mini ' + data.read['report_open_btn'] +'" onclick="'+ data.read['report_open_layer_action'] +'">Report</a> ');
                    aHtml.push('<a href="#none" class="btnNormal mini '+ data.read['block_request_btn'] +'" onclick="'+ data.read['block_action'] +'">Block</a> ');
                    aHtml.push('<a href="#none" class="btnNormal mini '+ data.read['unblock_request_btn'] +'" onclick="'+ data.read['unblock_action'] +'">Unblock</a> ');
                    if (data.write_auth == true) {
                        aHtml.push('<a href="/board/product/modify.html' + data.read['param_modify'] + '&link_product_no=' + iProductNo + '" class="btnNormal mini"><img src="//img.echosting.cafe24.com/skin/mobile_en_US/board/btn_comment_modify.png" width="13" height="13" alt="Edit"></a>');
                    }
                    aHtml.push('</div>');


                    if (data.comment != undefined && data.comment.length != undefined) {
                        aHtml.push('<ul class="boardComment" id="commentList_'+data.read['no']+'" style="display:none;">');
                        for (var i=0; data.comment.length > i; i++) {

                            if (data.comment[i]['comment_reply_css'] == undefined) {
                                aHtml.push('<li id="'+data.comment[i]['comment_reply_id']+'">');
                                aHtml.push('<div class="commentInfo">');
                                aHtml.push('<strong class="name">'+data.comment[i]['member_icon']+' '+data.comment[i]['comment_name']+'</strong>');
                                aHtml.push('<span class="date">'+data.comment[i]['comment_write_date']+'</span>');
                                aHtml.push('<span class="grade '+data.use_point+'"><img src="//img.echosting.cafe24.com/skin/mobile_en_US/board/ico_star'+data.comment[i]['comment_point_count']+'.png" alt="'+data.comment[i]['comment_point_count']+'points" /></span>');
                                aHtml.push('</div>');
                                aHtml.push('<p class="comment">'+data.comment[i]['comment_content']+'</p>');
                                if (data.comment[i]['comment_reply_display'] == true) {
                                    aHtml.push('<div class="ec-base-button">'+'<div class="gLeft">');
                                    aHtml.push('<a href="#none" class="btnNormal mini" onclick="QNA.comment_reply_view('+data.comment[i]['comment_no']+')"><img src="//img.echosting.cafe24.com/skin/mobile_en_US/board/btn_comment_view.png" width="13" height="13" alt="Reply to Comment"> <em>('+data.comment[i]['comment_reply_count']+')</em></a>');
                                    aHtml.push('<a href="#none" class="btnNormal mini" onclick="'+data.comment[i]['action_comment_reply_new']+'"><img src="//img.echosting.cafe24.com/skin/mobile_en_US/board/btn_comment_write.png" width="13" height="13" alt="Write"></a>');
                                    aHtml.push('</div>'+'</div>');
                                }
                                aHtml.push('</li>');
                            } else {

                                aHtml.push('<li class="replyArea" style="display:none;" id="'+data.comment[i]['comment_reply_id']+'">');
                                aHtml.push('<div class="commentInfo">');
                                aHtml.push('<strong class="name">'+data.comment[i]['member_icon']+' '+data.comment[i]['comment_name']+'</strong>');
                                aHtml.push('<span class="date">'+data.comment[i]['comment_write_date']+'</span>');
                                aHtml.push('</div>');
                                aHtml.push('<p class="comment">'+data.comment[i]['comment_content']+'</p>');
                                aHtml.push('</li>');
                            }
                        }
                        aHtml.push('</ul>');
                    }


                    if (data.comment_write != undefined) {
                        aHtml.push('<form name="commentWriteForm_6'+data.key+'" id="commentWriteForm_6'+data.key+'" style="display:none;">');
                        aHtml.push('<div class="memoCont">');
                        aHtml.push('<div class="info"><p class="name"><strong class="label">Name</strong>' +data.comment_write['comment_name']+ '</p><p class="password"><strong class="label">Password</strong>' +data.comment_write['comment_password']+ '</p></div>');
                        aHtml.push('<p class="ec-base-help ' +data.comment_write['password_rule_help_display_class']+ '">Combination in 10-16 characters containing at least two of the followings: upper and lower case letters/numbers/special letters</p>');
                        aHtml.push('<div class="byteRating"><p class="byte ' +data.comment_write['use_comment_size']+ '">/ byte</p><p class="rating ' +data.comment_write['use_point']+ '"><strong class="label">Rate</strong>' +data.comment_write['comment_point']+ '</p></div>');
                        aHtml.push('<div class="comment"><strong class="label hide">Message</strong>' +data.comment_write['comment']+ '</div>');
                        aHtml.push('<div class="captcha ' +data.comment_write['use_captcha']+ '"><span class="img"></span><div class="form">' +data.comment_write['captcha_image']+data.comment_write['captcha_refresh']+data.comment_write['captcha']+ '<p>Please type without any spaces.<br>(case sensitive)</p></div></div>');
                        aHtml.push('<div class="submit"><a href="#none" onclick="' +data.comment_write['action_comment_insert']+ '" class="btnStrong mini">Add Comment</a></div>');
                        aHtml.push('');
                        aHtml.push('');
                        aHtml.push('</div>');
                        aHtml.push('</form>');
                    }

                    if (data.comment_reply != undefined) {
                        aHtml.push('<form name="commentReplyWriteForm_6'+data.key+'" id="commentReplyWriteForm_6'+data.key+'" style="display:none">');
                        aHtml.push('<div class="memoCont reply">');
                        aHtml.push('<div class="info"><p class="name"><strong class="label">Name</strong>' +data.comment_reply['comment_name']+ '</p><p class="password"><strong class="label">Password</strong>' +data.comment_reply['comment_password']+ '</p></div>');
                        aHtml.push('<p class="ec-base-help ' +data.comment_reply['password_rule_help_display_class']+ '">Combination in 10-16 characters containing at least two of the followings: upper and lower case letters/numbers/special letters</p>');
                        aHtml.push('<div class="comment"><strong class="label hide">Message</strong>' +data.comment_reply['comment']+ '</div>');
                        aHtml.push('<p class="text '+data.comment_reply['use_comment_size']+'">'+data.comment_reply['comment_byte']+' / '+data.comment_reply['comment_size']+' byte</p>');
                        aHtml.push('<div class="captcha ' +data.comment_reply['use_captcha']+ '"><span class="img"></span><div class="form">' +data.comment_reply['captcha_image']+data.comment_reply['captcha_refresh']+data.comment_reply['captcha']+ '<p>Please type without any spaces.<br>(case sensitive)</p></div></div>');
                        aHtml.push('<div class="submit"><a href="#none" onclick="' +data.comment_reply['action_comment_insert']+ '" class="btnStrong mini">Add</a></div>');
                        aHtml.push('</div>');
                        aHtml.push('</form>');
                    }
                }

                $(pNode).after('<li id="product-qna-read'+data.key+'" class="contentView '+ data.read['block_target_class'] +'" '+ data.read['block_data_attr'] +'>' + aHtml.join('')+'</li>');
  
                PRODUCT_COMMENT.comment_colspan(pNode);
                APP_BOARD_BLOCK.setBlockList();
                APP_BOARD_REPORT.setReportLayerActions(data.read['report_action'], data.read['report_close_layer_action'], data.write_auth);

                if (data.comment_write != undefined && data.comment_write['use_comment_size'] == '') PRODUCT_COMMENT.comment_byte(6, data.key);
                if (data.comment_reply != undefined && data.comment_write['use_comment_size'] == '') PRODUCT_COMMENT.comment_byte(6, data.key, 'commentReplyWriteForm');
				if (data.read['ucc_url']) $('#ec-ucc-media-box-'+ data.read['no']).replaceWith(APP_BOARD_UCC.getPreviewElement(data.read['ucc_url']));
            }
        });
    },


    comment_view : function (sId)
    {
        if ($('#commentList_'+sId).css('display') == 'none') {
            $('#commentList_'+sId).show();
        } else {
            $('#commentList_'+sId).hide();
        }
    },


    comment_reply_view : function (iCommentNo)
    {
        $('[id^="replyArea_'+iCommentNo+'_"]').each(function(e) {
            if ($(this).css('display') == 'none') {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    },


    comment_write : function (e)
    {
        var $form = $("#commentWriteForm_6");
        if ($form.css('display') == 'none') {
            $form.css('display', 'block');

            var $p = $(e).parent().parent();
            if ( $(e).parent().find('#commentWriteForm_6').length < 1 ) {
                $p.after($form);
            }
        } else {
            $form.hide();
        }
    },

    END : function() {},

    getReadDataList: function(sArticleNoListQueryString, oArticleSectionElementMap) {
        $.ajax({
            url : '/exec/front/board/spread/6?spread_flag=T&&pass_check=F&' + sArticleNoListQueryString,
            dataType: 'json',
            success: function(aDataList) {
                aDataList.forEach(function(data) {
                    $('#product-qna-read').remove();

                    var sPath = document.location.pathname;
                    var sPattern = /^\/product\/(.+)\/([0-9]+)(\/.*)/;
                    var aMatchResult = sPath.match(sPattern);

                    if (aMatchResult) {
                        var iProductNo = aMatchResult[2];
                    } else {
                        var iProductNo = getQueryString('product_no');
                    }

                    var aHtml = [];


                    if (false === data.read_auth && eType == undefined) {
                        alert(data.alertMSG);
                        return false;
                    }

                    if (data.is_secret == true) {

                        aHtml.push('<form name="SecretForm_6" id="SecretForm_6">');
                        aHtml.push('<input type="text" name="a" style="display:none;">');
                        aHtml.push('<div class="view secret">');
                        aHtml.push('<span class="alert">This message is password protected.<br>Please enter your password.</span>');
                        aHtml.push('<p><input type="password" id="secure_password" name="secure_password" onkeydown="if (event.keyCode == 13) '+data.action_pass_submit+'"> <input type="button" value="OK" onclick="'+data.action_pass_submit+'" class="btnStrong"></p>');
                        aHtml.push('</div>');
                        aHtml.push('</form>');
                    } else {

                        if (data.read['content_image'] != null) {
                            var sImg = data.read['content_image'];
                        } else {
                            var sImg = '';
                        }

                        aHtml.push('<div class="view '+ data.read['block_content_class'] +'">');
                        aHtml.push('<div id="ec-ucc-media-box-'+ data.read['no'] +'"></div>');
                        aHtml.push('<p class="attach">'+sImg+'</p>');
                        aHtml.push('<p>'+data.read['content']+'</p>');
                        aHtml.push('</div>');
                        aHtml.push('<div class="ec-base-button">');
                        if (data.comment != undefined) {
                            aHtml.push('<div class="gLeft">');
                            aHtml.push('<a href="#none" class="btnNormal mini" onclick="QNA.comment_view('+data.read['no']+');"><img src="//img.echosting.cafe24.com/skin/mobile_en_US/board/btn_comment_view.png" width="13" height="13" alt="See Comment"> <em>('+data.read['comment_count']+')</em></a> <a href="#none" class="btnNormal mini" onclick="QNA.comment_write(this);"><img src="//img.echosting.cafe24.com/skin/mobile_en_US/board/btn_comment_write.png" width="13" height="13" alt="Write"></a>');
                            aHtml.push('</div>');
                        }
                        aHtml.push('<a href="#none" class="btnNormal mini ' + data.read['report_open_btn'] +'" onclick="'+ data.read['report_open_layer_action'] +'">Report</a> ');
                        aHtml.push('<a href="#none" class="btnNormal mini '+ data.read['block_request_btn'] +'" onclick="'+ data.read['block_action'] +'">Block</a> ');
                        aHtml.push('<a href="#none" class="btnNormal mini '+ data.read['unblock_request_btn'] +'" onclick="'+ data.read['unblock_action'] +'">Unblock</a> ');
                        if (data.write_auth == true) {
                            aHtml.push('<a href="/board/product/modify.html' + data.read['param_modify'] + '&link_product_no=' + iProductNo + '" class="btnNormal mini"><img src="//img.echosting.cafe24.com/skin/mobile_en_US/board/btn_comment_modify.png" width="13" height="13" alt="Edit"></a>');
                        }
                        aHtml.push('</div>');


                        if (data.comment != undefined && data.comment.length != undefined) {
                            aHtml.push('<ul class="boardComment" id="commentList_'+data.read['no']+'" style="display:none;">');
                            for (var i=0; data.comment.length > i; i++) {

                                if (data.comment[i]['comment_reply_css'] == undefined) {
                                    aHtml.push('<li id="'+data.comment[i]['comment_reply_id']+'">');
                                    aHtml.push('<div class="commentInfo">');
                                    aHtml.push('<strong class="name">'+data.comment[i]['member_icon']+' '+data.comment[i]['comment_name']+'</strong>');
                                    aHtml.push('<span class="date">'+data.comment[i]['comment_write_date']+'</span>');
                                    aHtml.push('<span class="grade '+data.use_point+'"><img src="//img.echosting.cafe24.com/skin/mobile_en_US/board/ico_star'+data.comment[i]['comment_point_count']+'.png" alt="'+data.comment[i]['comment_point_count']+'points" /></span>');
                                    aHtml.push('</div>');
                                    aHtml.push('<p class="comment">'+data.comment[i]['comment_content']+'</p>');
                                    if (data.comment[i]['comment_reply_display'] == true) {
                                        aHtml.push('<div class="ec-base-button">'+'<div class="gLeft">');
                                        aHtml.push('<a href="#none" class="btnNormal mini" onclick="QNA.comment_reply_view('+data.comment[i]['comment_no']+')"><img src="//img.echosting.cafe24.com/skin/mobile_en_US/board/btn_comment_view.png" width="13" height="13" alt="Reply to Comment"> <em>('+data.comment[i]['comment_reply_count']+')</em></a>');
                                        aHtml.push('<a href="#none" class="btnNormal mini" onclick="'+data.comment[i]['action_comment_reply_new']+'"><img src="//img.echosting.cafe24.com/skin/mobile_en_US/board/btn_comment_write.png" width="13" height="13" alt="Write"></a>');
                                        aHtml.push('</div>'+'</div>');
                                    }
                                    aHtml.push('</li>');
                                } else {

                                    aHtml.push('<li class="replyArea" style="display:none;" id="'+data.comment[i]['comment_reply_id']+'">');
                                    aHtml.push('<div class="commentInfo">');
                                    aHtml.push('<strong class="name">'+data.comment[i]['member_icon']+' '+data.comment[i]['comment_name']+'</strong>');
                                    aHtml.push('<span class="date">'+data.comment[i]['comment_write_date']+'</span>');
                                    aHtml.push('</div>');
                                    aHtml.push('<p class="comment">'+data.comment[i]['comment_content']+'</p>');
                                    aHtml.push('</li>');
                                }
                            }
                            aHtml.push('</ul>');
                        }


                        if (data.comment_write != undefined) {
                            aHtml.push('<form name="commentWriteForm_6'+data.key+'" id="commentWriteForm_6'+data.key+'" style="display:none;">');
                            aHtml.push('<div class="memoCont">');
                            aHtml.push('<div class="info"><p class="name"><strong class="label">Name</strong>' +data.comment_write['comment_name']+ '</p><p class="password"><strong class="label">Password</strong>' +data.comment_write['comment_password']+ '</p></div>');
                            aHtml.push('<p class="ec-base-help ' +data.comment_write['password_rule_help_display_class']+ '">Combination in 10-16 characters containing at least two of the followings: upper and lower case letters/numbers/special letters</p>');
                            aHtml.push('<div class="byteRating"><p class="byte ' +data.comment_write['use_comment_size']+ '">/ byte</p><p class="rating ' +data.comment_write['use_point']+ '"><strong class="label">Rate</strong>' +data.comment_write['comment_point']+ '</p></div>');
                            aHtml.push('<div class="comment"><strong class="label hide">Message</strong>' +data.comment_write['comment']+ '</div>');
                            aHtml.push('<div class="captcha ' +data.comment_write['use_captcha']+ '"><span class="img"></span><div class="form">' +data.comment_write['captcha_image']+data.comment_write['captcha_refresh']+data.comment_write['captcha']+ '<p>Please type without any spaces.<br>(case sensitive)</p></div></div>');
                            aHtml.push('<div class="submit"><a href="#none" onclick="' +data.comment_write['action_comment_insert']+ '" class="btnStrong mini">Add Comment</a></div>');
                            aHtml.push('');
                            aHtml.push('');
                            aHtml.push('</div>');
                            aHtml.push('</form>');
                        }

                        if (data.comment_reply != undefined) {
                            aHtml.push('<form name="commentReplyWriteForm_6'+data.key+'" id="commentReplyWriteForm_6'+data.key+'" style="display:none">');
                            aHtml.push('<div class="memoCont reply">');
                            aHtml.push('<div class="info"><p class="name"><strong class="label">Name</strong>' +data.comment_reply['comment_name']+ '</p><p class="password"><strong class="label">Password</strong>' +data.comment_reply['comment_password']+ '</p></div>');
                            aHtml.push('<p class="ec-base-help ' +data.comment_reply['password_rule_help_display_class']+ '">Combination in 10-16 characters containing at least two of the followings: upper and lower case letters/numbers/special letters</p>');
                            aHtml.push('<div class="comment"><strong class="label hide">Message</strong>' +data.comment_reply['comment']+ '</div>');
                            aHtml.push('<p class="text '+data.comment_reply['use_comment_size']+'">'+data.comment_reply['comment_byte']+' / '+data.comment_reply['comment_size']+' byte</p>');
                            aHtml.push('<div class="captcha ' +data.comment_reply['use_captcha']+ '"><span class="img"></span><div class="form">' +data.comment_reply['captcha_image']+data.comment_reply['captcha_refresh']+data.comment_reply['captcha']+ '<p>Please type without any spaces.<br>(case sensitive)</p></div></div>');
                            aHtml.push('<div class="submit"><a href="#none" onclick="' +data.comment_reply['action_comment_insert']+ '" class="btnStrong mini">Add</a></div>');
                            aHtml.push('</div>');
                            aHtml.push('</form>');
                        }
                    }

                    var pNode = oArticleSectionElementMap[data.no];
                    $(pNode).after('<li id="product-qna-read'+data.key+'" class="contentView '+ data.read['block_target_class'] +'" '+ data.read['block_data_attr'] +'>' + aHtml.join('')+'</li>');

                    PRODUCT_COMMENT.comment_colspan(pNode);
                    APP_BOARD_BLOCK.setBlockList();
                    if (data.read['report_action'] && data.read['report_close_layer_action']) {
                        APP_BOARD_REPORT.setReportLayerActions(data.read['report_action'], data.read['report_close_layer_action'], data.write_auth);
                    }

                    if (data.comment_write != undefined && data.comment_write['use_comment_size'] == '') PRODUCT_COMMENT.comment_byte(6, data.key);
                    if (data.comment_reply != undefined && data.comment_write['use_comment_size'] == '') PRODUCT_COMMENT.comment_byte(6, data.key, 'commentReplyWriteForm');
                    if (data.read['ucc_url']) $('#ec-ucc-media-box-'+ data.read['no']).replaceWith(APP_BOARD_UCC.getPreviewElement(data.read['ucc_url']));
                });
            }
        });
    }
};
