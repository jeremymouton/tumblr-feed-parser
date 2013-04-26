$( function() {
	getPosts();
});	

function getPosts() {
	// Post parser for Tumblr blogs.
	// Change "blog_url" to pull in  a new feed. 

	var blog_name   = 'demo',
	    tumblr_feed = 'http://' + blog_name + '.tumblr.com/api/read/json?callback=?';

	$.getJSON(tumblr_feed, function(data) {
		getPosts(data.posts);
	});

	// HELPERS
	function getPosts(json) {
		for( var i=0, l=json.length; i<l; i++ ) {
			formatPost(json[i]);
		}
	}

	function formatPost(post) {
		date    = moment.unix(post['unix-timestamp']).format('MMMM Do YYYY');
		content = post['regular-body'];
		type    = post.type;

		// Format post based on post type
		switch (type)
		{
		// Normal post
		case "regular":
			content = '<h3>' + post['regular-title'] + '</h3>' + post['regular-body'];
			icon    = 'icon-align-left';
			break;

		// Link post
		case "link":
			content = '<span class="link-text"><a href="' + post['link-url'] + 
			          '" target="_blank">' + post['link-text'] + '</a></span>' +
			          '<span class="link-description"> ' + post['link-description'] + '</span>';
			icon    = 'icon-link';
			break;

		// Video post
		case "video":
			content = '<div class="video-container">' + post['video-player-500'] + '</div><span class="video-caption">' + post['video-caption'] + '</span>';
			icon    = 'icon-film';
			break;

		// Photo post
		case "photo":
			content = '<div class="photo"><img src="' + post['photo-url-1280'] + 
			          '" alt=""></div>' +
			          '<span class="photo-caption">' + post['photo-caption'] + '</span>';
			icon    = 'icon-picture';
			break;

		case "quote":
			content = '<blockquote>' + post['quote-text'] + '</blockquote>';
			icon    = 'icon-quote-right';
			break;

		case "audio":
			content = post['audio-player'] + '<span class="song-caption">' + post['audio-caption'] + '</span>';
			icon    = 'icon-music';
			break;
		}

		// Send it to the view
		$('#main').append('<div class="post"><span class="post-date">' + date + '</span><i class="' + icon + '"></i><div class="content">' + content + '</div></div>');


		// Remove duplicate dates
		// http://stackoverflow.com/a/2822974
		var seen = {};
		$('.post-date').each(function() {
			var txt = $(this).text();
			if (seen[txt])
				$(this).hide().next('content').addClass('bordered');
			else
				seen[txt] = true;
		});
	}
}