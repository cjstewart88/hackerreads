(function($){
  $.fn.sortByAgo = function(data_set) {
    reads = [];
    
    minutes = [];
    hours   = [];
    days    = [];
    
    $.each(data_set, function () {
      this.pretty_created = this.pretty_created.replace("about", "");
      
      if (this.pretty_created.indexOf("minutes") != -1) {
        minutes.push(this);
      }
      else if (this.pretty_created.indexOf("hours") != -1) {
        hours.push(this);
      }
      else if (this.pretty_created.indexOf("days") != -1) {
        days.push(this);
      }
    });
    
    minutes.sort(function(a, b) {
      return parseInt(a.pretty_created.replace( /(^.+)(\w\d+\w)(.+$)/i,'$2')) - parseInt(b.pretty_created.replace( /(^.+)(\w\d+\w)(.+$)/i,'$2'));
    });
    
    hours.sort(function(a, b) {
      return parseInt(a.pretty_created.replace( /(^.+)(\w\d+\w)(.+$)/i,'$2')) - parseInt(b.pretty_created.replace( /(^.+)(\w\d+\w)(.+$)/i,'$2'));
    });
    
    days.sort(function(a, b) {
      return parseInt(a.pretty_created.replace( /(^.+)(\w\d+\w)(.+$)/i,'$2')) - parseInt(b.pretty_created.replace( /(^.+)(\w\d+\w)(.+$)/i,'$2'));
    });

    return reads.concat(minutes, hours, days);
  };
})(jQuery);