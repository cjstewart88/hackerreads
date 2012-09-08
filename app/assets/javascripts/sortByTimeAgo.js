(function ($) {
  $.sortByTimeAgo = function (data) {
    reads = [];
    
    minutes = [];
    hours   = [];
    days    = [];
    
    $.each(data, function () {
      this.timeAgo = this.timeAgo.replace("about", "");
      
      if (this.timeAgo.indexOf("minutes") != -1) {
        minutes.push(this);
      }
      else if (this.timeAgo.indexOf("hours") != -1) {
        hours.push(this);
      }
      else if (this.timeAgo.indexOf("days") != -1) {
        days.push(this);
      }
    });
    
    minutes.sort(function (a, b) {
      return parseInt(a.timeAgo.replace( /(^.+)(\w\d+\w)(.+$)/i,'$2')) - parseInt(b.timeAgo.replace( /(^.+)(\w\d+\w)(.+$)/i,'$2'));
    });
    
    hours.sort(function (a, b) {
      return parseInt(a.timeAgo.replace( /(^.+)(\w\d+\w)(.+$)/i,'$2')) - parseInt(b.timeAgo.replace( /(^.+)(\w\d+\w)(.+$)/i,'$2'));
    });
    
    days.sort(function (a, b) {
      return parseInt(a.timeAgo.replace( /(^.+)(\w\d+\w)(.+$)/i,'$2')) - parseInt(b.timeAgo.replace( /(^.+)(\w\d+\w)(.+$)/i,'$2'));
    });

    return reads.concat(minutes, hours, days);
  };
})(jQuery);