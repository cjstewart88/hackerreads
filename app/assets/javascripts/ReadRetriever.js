(function($){
  $.fn.readRetriever = function() {
    var self = this;
    
    var reads = [];
    
    var requests = [];
    
    function retrieve_reddit_data (sub_reddit) {
      requests[sub_reddit] = $.getJSON("http://www.reddit.com/r/" + sub_reddit + "/hot.json?jsonp=?&limit=100", function(data) {
        $.each(data.data.children, function() {
          var read_data = this.data;

          var a_read = {
            title:          read_data.title,
            url:            read_data.url,
            created:        read_data.created_utc,
            pretty_created: $.timeago(new Date(read_data.created_utc*1000)),
            source:         "r/" + sub_reddit,
            source_class:   "reddit",
            source_url:     "http://www.reddit.com/r/" + sub_reddit
          }

          reads.push(a_read);
        });
      });
    }
    
    $.each(["programming", "technology", "science", "webdev"], function() {
      retrieve_reddit_data(this);
    });
    
    $.when(requests["programming"], requests["technology"], requests["science"], requests["webdev"]).done(function (r1, r2, r3) {
      reads.sort(function(a, b) {
        return b.created - a.created;
      });
      
      $.each(reads, function() {
        self.append(ich.read(this));
      });
      
      self.readsPaging();
      
      self.removeClass("loading");
    });
  };
})(jQuery);