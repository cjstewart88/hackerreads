(function ($) {
  $.fn.readRetriever = function () {
    var self      = this;
    var reads     = [];
    var requests  = [];
    
    self.retrieveRedditData = function (subReddit) {
      requests[subReddit] = $.getJSON("http://www.reddit.com/r/" + subReddit + "/hot.json?jsonp=?&limit=100", function (data) {
        $.each(data.data.children, function () {
          var readData = this.data;
          
          var aRead = {
            title:          readData.title,
            url:            readData.url,
            created:        readData.created_utc,
            timeAgo:        $.timeago(new Date(readData.created_utc*1000)),
            source:         "r/" + subReddit,
            sourceUrl:      "http://www.reddit.com/r/" + subReddit,
            commentsUrl:    "http://www.reddit.com" + readData.permalink,
            commentsCount:  readData.num_comments
          }

          reads.push(aRead);
        });
      });
    }

    self.retrieveHackernewsData = function () {
      requests["hackernews"] = $.jsonp({
        "url": "http://api.ihackernews.com/page?format=jsonp&callback=?",
        "data": {
          "alt": "json-in-script"
        },
        "success": function (data) {
          $.each(data.items, function () {
            var readData = this;
            
            if (readData.postedAgo != null) { 
              var aRead = {
                title:          readData.title,
                url:            readData.url,
                timeAgo:        readData.postedAgo,
                source:         "hackernews",
                sourceUrl:      "http://news.ycombinator.com/",
                commentsUrl:    "http://news.ycombinator.com/item?id=" + readData.id,
                commentsCount:  readData.commentCount
              }

              reads.push(aRead);
            }
          }); 
        },
        "error": function(d, msg) {
          return [ "success", "b", "c" ];
        }
      });
    }
    
    self.requestsFinished = function () {
      sortedReads = $.sortByTimeAgo(reads);

      $.each(sortedReads, function () {
        self.append(ich.read(this));
      });

      $.readsPaging();

      self.removeClass("loading");
    }
    
    // fetch the data
    $.each(["programming", "technology", "science", "webdev", "blackhat"], function() {
      self.retrieveRedditData(this);
    });
    
    self.retrieveHackernewsData();
    
    // when the data is ready or errors
    $.when(requests["programming"], requests["technology"], requests["science"], requests["blackhat"], requests["hackernews"])
      .done(function () { 
        self.requestsFinished();
      })
      .fail(function () {
        self.requestsFinished();
      });
  };
})(jQuery);