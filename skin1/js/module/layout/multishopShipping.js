$(function(){
    if (typeof(EC_SHOP_MULTISHOP_SHIPPING) != "undefined") {
        var sShippingCountryCode4Cookie = 'shippingCountryCode';
        var bShippingCountryProc = false;


        if (EC_SHOP_MULTISHOP_SHIPPING.bMultishopShippingCountrySelection === false) {
            $('.xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist').hide();
            $('.xans-layout-multishoplist .xans-layout-multishoplistmultioption .xans-layout-multishoplistmultioptioncountry').hide();
        } else {
            $('.thumb .xans-layout-multishoplistitem').hide();
            var aShippingCountryCode = document.cookie.match('(^|;) ?'+sShippingCountryCode4Cookie+'=([^;]*)(;|$)');
            if (typeof(aShippingCountryCode) != 'undefined' && aShippingCountryCode != null && aShippingCountryCode.length > 2) {
                var sShippingCountryValue = aShippingCountryCode[2];
            }


            var aHrefCountryValue = decodeURIComponent(location.href).split("/?country=");

            if (aHrefCountryValue.length == 2) {
                var sShippingCountryValue = aHrefCountryValue[1];
            }


            if (location.href.split("/").length != 4 && $(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val()) {
                $(".xans-layout-multishoplist .xans-layout-multishoplistmultioption a .ship span").text(" : "+$(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist option:selected").text().split("SHIPPING TO : ").join(""));

                if ($("#f_country").length > 0 && location.href.indexOf("orderform.html") > -1) {
                    $("#f_country").val($(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val());
                }
            }
            if (typeof(sShippingCountryValue) != "undefined" && sShippingCountryValue != "" && sShippingCountryValue != null) {
                sShippingCountryValue = sShippingCountryValue.split("#")[0];
                var bShippingCountryProc = true;

                $(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val(sShippingCountryValue);
                $(".xans-layout-multishoplist .xans-layout-multishoplistmultioption a .ship span").text(" : "+$(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist option:selected").text().split("SHIPPING TO : ").join(""));
                var expires = new Date();
                expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
                document.cookie = sShippingCountryCode4Cookie+'=' + $(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val() +';path=/'+ ';expires=' + expires.toUTCString();
                if ($("#f_country").length > 0 && location.href.indexOf("orderform.html") > -1) {
                    $("#f_country").val(sShippingCountryValue).change();
                }
            }
        }

        if (EC_SHOP_MULTISHOP_SHIPPING.bMultishopShippingLanguageSelection === false) {
            $('.xans-layout-multishopshipping .xans-layout-multishopshippinglanguagelist').hide();
            $('.xans-layout-multishoplist .xans-layout-multishoplistmultioption .xans-layout-multishoplistmultioptionlanguage').hide();
        } else {
            $('.thumb .xans-layout-multishoplistitem').hide();
        }


        if (EC_SHOP_MULTISHOP_SHIPPING.bMultishopShipping === false) {
            $(".xans-layout-multishopshipping").hide();
            $('.xans-layout-multishoplist .xans-layout-multishoplistmultioption').hide();
        } else if (bShippingCountryProc === false && location.href.split("/").length == 4) {
            var sShippingCountryValue = $(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val();
            $(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val(sShippingCountryValue);
            $(".xans-layout-multishoplist .xans-layout-multishoplistmultioption a .ship span").text(" : "+$(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist option:selected").text().split("SHIPPING TO : ").join(""));

            if (EC_SHOP_MULTISHOP_SHIPPING.bMultishopShippingCountrySelection === true) {
                $(".xans-layout-multishopshipping").show();
            }
        }

        $(".xans-layout-multishopshipping .close").on("click", function() {
            $(".xans-layout-multishopshipping").hide();
        });

        $(".xans-layout-multishopshipping .ec-base-button a").on("click", function() {
            var expires = new Date();
            expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
            document.cookie = sShippingCountryCode4Cookie+'=' + $(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val() +';path=/'+ ';expires=' + expires.toUTCString();


            var sQuerySting = (EC_SHOP_MULTISHOP_SHIPPING.bMultishopShippingCountrySelection === false) ? "" : "/?country="+encodeURIComponent($(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val());

            location.href = '//'+$(".xans-layout-multishopshipping .xans-layout-multishopshippinglanguagelist").val()+sQuerySting;
        });
        $(".xans-layout-multishoplist .xans-layout-multishoplistmultioption a").on("click", function() {
            $(".xans-layout-multishopshipping").show();
        });
    }
});