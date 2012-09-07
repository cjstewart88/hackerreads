(function ($) {
  $.readsPaging = function () {
    var self = this;
    
    $.each($(".read"), function (i) {
      if (i+1 <= 30) $(this).fadeIn(2000);
    });
    
    $(window).scroll(function () {
      if ($(window).scrollTop()+300 >= $(document).height() - $(window).height()) {
        for (var i = 1; i <= 30; i++) {
          $(".read").not(':hidden').last().next().fadeIn(2000);
        }
      }
    });
  };
})(jQuery);