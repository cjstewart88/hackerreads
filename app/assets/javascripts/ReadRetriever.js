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

    function retrieve_hackernews_data () {
      requests["hackernews"] = $.jsonp({
        "url": "http://api.ihackernews.com/page?format=jsonp&callback=?",
        "data": {
          "alt": "json-in-script"
        },
        "success": function(data) {
          $.each(data.items, function() {
            var read_data = this;

            if (read_data.postedAgo != null) { 
              var a_read = {
                title:          read_data.title,
                url:            read_data.url,
                pretty_created: read_data.postedAgo,
                source:         "hackernews",
                source_class:   "hackernews",
                source_url:     "http://news.ycombinator.com/"
              }

              reads.push(a_read);
            }
          }); 
        },
        "error": function(d, msg) {
          return [ "success", "b", "c" ];
        }
      });
    }
    
    $.each(["programming", "technology", "science", "webdev", "blackhat"], function() {
      retrieve_reddit_data(this);
    });
    
    retrieve_hackernews_data();
    
    function requests_finished () {
     reads = self.sortByAgo(reads);

      $.each(reads, function() {
        self.append(ich.read(this));
      });

      self.readsPaging();

      self.removeClass("loading");
    }
    
    $.when(requests["programming"], requests["technology"], requests["science"], requests["blackhat"], requests["hackernews"])
      .done(function () { 
        requests_finished();
      })
      .fail(function () {
        requests_finished();
      });
  };
})(jQuery);