(function ($) {
  $.fn.readRetriever = function () {
    var self      = this;
    var reads     = [];
    var requests  = [];
    
    self.retrieve_reddit_data = function (sub_reddit) {
      requests[sub_reddit] = $.getJSON("http://www.reddit.com/r/" + sub_reddit + "/hot.json?jsonp=?&limit=100", function (data) {
        $.each(data.data.children, function () {
          var read_data = this.data;
          
          var a_read = {
            title:          read_data.title,
            url:            read_data.url,
            created:        read_data.created_utc,
            pretty_created: $.timeago(new Date(read_data.created_utc*1000)),
            source:         "r/" + sub_reddit,
            source_url:     "http://www.reddit.com/r/" + sub_reddit,
            comments_url:   "http://www.reddit.com" + read_data.permalink,
            comments_count: read_data.num_comments
          }

          reads.push(a_read);
        });
      });
    }

    self.retrieve_hackernews_data = function () {
      requests["hackernews"] = $.jsonp({
        "url": "http://api.ihackernews.com/page?format=jsonp&callback=?",
        "data": {
          "alt": "json-in-script"
        },
        "success": function (data) {
          $.each(data.items, function () {
            var read_data = this;
            
            if (read_data.postedAgo != null) { 
              var a_read = {
                title:          read_data.title,
                url:            read_data.url,
                pretty_created: read_data.postedAgo,
                source:         "hackernews",
                source_url:     "http://news.ycombinator.com/",
                comments_url:   "http://news.ycombinator.com/item?id=" + read_data.id,
                comments_count: read_data.commentCount
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
    
    self.requests_finished = function () {
     reads = $.sortByAgo(reads);

      $.each(reads, function () {
        self.append(ich.read(this));
      });

      $.readsPaging();

      self.removeClass("loading");
    }
    
    // fetch the data
    $.each(["programming", "technology", "science", "webdev", "blackhat"], function() {
      self.retrieve_reddit_data(this);
    });
    
    self.retrieve_hackernews_data();
    
    // when the data is ready or errors
    $.when(requests["programming"], requests["technology"], requests["science"], requests["blackhat"], requests["hackernews"])
      .done(function () { 
        self.requests_finished();
      })
      .fail(function () {
        self.requests_finished();
      });
  };
})(jQuery);