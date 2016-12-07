/* ReadGetter.js
* 
* Derived from https://github.com/codelucas/newspaper/blob/master/newspaper/extractors.py
*/

( function ( window, $ ){
// var getMainText = function ( rootNode ) {
// This is actually just the best guess at what the main text element is

	'use strict';

	// var getter = {};


	var ReadGetter = function () {};

	var getter = ReadGetter.prototype;


	// Unicode language codes
	// http://kourge.net/projects/regexp-unicode-block
	// [\u0000-\u007F\u0080-\u00FF\u0100-\u017F\u0180-\u024F\u0250-\u02AF\u0300-\u036F\u0370-\u03FF\u0400-\u04FF\u0500-\u052F\u0530-\u058F\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1B00-\u1B7F\u1F00-\u1FFF\u2150-\u218F\u2C80-\u2CFF\u2D30-\u2D7F\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31A0-\u31BF\u31F0-\u31FF\uA800-\uA82F\uA840-\uA87F]


	var stopwords = [
            'about', 'help', 'privacy', 'legal', 'feedback', 'sitemap',
            'profile', 'account', 'mobile', 'sitemap', 'facebook', 'myspace',
            'twitter', 'linkedin', 'bebo', 'friendster', 'stumbleupon',
            'youtube', 'vimeo', 'store', 'mail', 'preferences', 'maps',
            'password', 'imgur', 'flickr', 'search', 'subscription', 'itunes',
            'siteindex', 'events', 'stop', 'jobs', 'careers', 'newsletter',
            'subscribe', 'academy', 'shopping', 'purchase', 'site-map',
            'shop', 'donate', 'newsletter', 'product', 'advert', 'info',
            'tickets', 'coupons', 'forum', 'board', 'archive', 'browse',
            'howto', 'how to', 'faq', 'terms', 'charts', 'services',
            'contact', 'plus', 'admin', 'login', 'signup', 'register',
            'developer', 'proxy'
    ];


	getter.nodes_to_check = function ( doc ) {
	/* ( {}, DOM body ) -> [ DOM Nodes ]
	*  
	* Returns a list of nodes we want to search
	* on like paragraphs and tables
	*/
		// def nodes_to_check(self, doc):
		//     """Returns a list of nodes we want to search
		//     on like paragraphs and tables
		//     """
		//     nodes_to_check = []
		//     for tag in ['p', 'pre', 'td']:
		//         items = self.parser.getElementsByTag(doc, tag=tag)
		//         nodes_to_check += items
		//     return nodes_to_check
	    
	    var to_check 	= [],
	    	tags 		= ['p', 'pre', 'td']

	    // Get all the p, pre, and table data nodes on the page
	    for ( let tagi = 0; tagi < tags.length; tagi++ ) {

	    	let nodes = doc.getElementsByTagName( tags[ tagi ] );

	    	// This is a NodeList. Can't just .concat()
	    	for ( let nodei = 0; nodei < nodes.length; nodei++ ) {
	    		to_check.push( nodes[ nodei ] );
	    	}  // end for each node of that tag type
	    }  // end for each tag type

	    return to_check;
	};  // End getter.nodes_to_check)



	// Determines how many times stopwords appear in the text
	// Doesn't detect languages yet
	getter.get_stopword_count = function ( text ){
		var wordCount = 0;

		// Don't remember which is right
		if ( typeof words === 'string' || typeof words === 'String' ) {
			wordArr = words.match(/\S+/g);
		}

		// For every stopword, count how many times it appears in the text
		for ( let wordi = 0; wordi < stopwords.length; wordi++ ) {
			let matches = text.match( stopwords[ wordi ] );
			if ( matches ) {
				wordCount += matches.length
			}
		}

		return wordCount;
	};  // End getter.get_stopword_count()



	// from http://stackoverflow.com/a/10730777/3791179
	getter.getText = function ( parent ){
		var nextNode 	= null,
			all 		= [],
			walker 		= document.createTreeWalker( parent, NodeFilter.SHOW_TEXT, null, false);

		while( nextNode = walk.nextNode() ) { all.push( nextNode ); }

		return all;
	};  // End getter.getText()



	getter.is_highlink_density = function ( node, nodeText ) {
    // """Checks the density of links within a node, if there is a high
    // link to text ratio, then the text is less likely to be relevant
    // """

        // links = self.parser.getElementsByTag(e, tag='a')
        // if not links:
        //     return False
		var links = node.getElementsByTagName( 'a' );
		if ( !links ) { return false; }

        // text = self.parser.getText(e)
        // words = [word for word in text.split() if word.isalnum()]
        // if not words:
        //     return True
		// Don't need to check for alphanumirc because we got all text? Not sure.
		// TODO: test for alphanumeric
		// See unicode languages at top for detecting letters in other languages.
		// Not sure what this is testing for
		var words = nodeText.match(/\w+/g);
		if ( !words ) { return true; }

        // words_number = float(len(words))
		var words_count = words.length;

		// sb = []
		// for link in links:
		//     sb.append(self.parser.getText(link))
		// linkText = ''.join(sb)
		var allLinksText = '';
		for ( let linki = 0; linki < links.length; linki++ ) {
			var link = links[ linki ]
			allLinksText += $(link).text();
		}

        // linkWords = linkText.split()
        // numberOfLinkWords = float(len(linkWords))
        // # of words in all the links combined
		var numLinkWords = 0,
			match = allLinksText.match(/\S+/g);
		if ( match ) { numLinkWords = match.length; }

        // numberOfLinks = float(len(links))
        var numLinks = links.length;

        // linkDivisor = float(numberOfLinkWords / words_number)
        // score = float(linkDivisor * numberOfLinks)
        // Not sure why socre is calculated this way
        var ratio = numLinkWords/words_count,
        	score = ratio * numLinks;

        // if score >= 1.0:
        //     return True
        // return False
        if ( score >= 1 ) { return true; }

        // If the other stuff didn't return true, then this isn't high density
        return false;
	};  // End getter.is_highlink_density()



	getter.is_boostable = function ( node ) {
	// This means nothing to me. What is this function doing?
    // """Alot of times the first paragraph might be the caption under an image
    // so we'll want to make sure if we're going to boost a parent node that
    // it should be connected to other paragraphs, at least for the first n
    // paragraphs so we'll want to make sure that the next sibling is a
    // paragraph and has at least some substantial weight to it.
    // """
    	var tag 					= 'P',  // Returned in caps by jQuery
    		steps_away 				= 0,
    		minimum_stopword_count 	= 5,
    		max_stepsaway_from_node = 3;

    	// For every sibling node
        // nodes = self.walk_siblings(node)
	    var nodes = $(node).siblings();
	    // for current_node in nodes:
	    for (let nodei = 0; nodei < nodes.length; nodei++) {
	    	let current_node = nodes[ nodei ];

	        // current_node_tag = self.parser.getTag(current_node)
	        // if current_node_tag == para:
	        //     if steps_away >= max_stepsaway_from_node:
	        //         return False
	    	// If the current node is a paragraph
	    	if ( $(current_node).prop('tagName') === tag ) {
	    		// If our node is already more than the max "steps away"
	    		// then our node is not boostable (what does that mean?!?!)
	    		return false;
	    	}

            // paraText = self.parser.getText(current_node)
            // word_stats = self.stopwords_class(language=self.language).\
            //     get_stopword_count(paraText)
	    	var paraText 	= $(current_node).text(),
	    		word_stats 	= getter.get_stopword_count( paraText );


            // if word_stats.get_stopword_count() > minimum_stopword_count:
            //     return True
	    	// If there are more than enough stopwords in a sibling,
	    	// our node is boostable
	    	if ( word_stats > minimum_stopword_count ) { return true; }

	    	// Prepare for next loop
            steps_away += 1
	    }  // End examine siblings to count up if our node is boostable

	    // return False;
	    // If none of the other conditions have been met
	    return false;
	};  // End getter.is_boostable()



	var getTextNodes = function ( nodes_to_check ) {

		var nodes_with_text = [];

	    // for node in nodes_to_check:
	        // text_node = self.parser.getText(node)
	        // word_stats = self.stopwords_class(language=self.language).\
	        //     get_stopword_count(text_node)
	        // high_link_density = self.is_highlink_density(node)
	        // if word_stats.get_stopword_count() > 2 and not high_link_density:
	        //     nodes_with_text.append(node)
		// get rid of nodes full of links
		for ( let nodei = 0; nodei < nodes_to_check.length; nodei++ ) {
			let node 		= nodes_to_check[ nodei ],
				nodeText 	= $(node).text();
			// TODO: Some how translate stopwords into other languages if not English
			let high_link_density = getter.is_highlink_density( node, nodeText );
			// DEBUGGING
			// console.log( 'high_link_density:', high_link_density );

			// TODO: Add counting number of stopwords
			if ( !high_link_density ) {
				nodes_with_text.push( node );
			}
		}  // end get rid of nodes full of links

		return nodes_with_text;
	};  // End getTextNodes();



	getter.addToAttr = function ( attr, node, toAdd ) {
	// Parses strings, adding a number to the nodes `attr` attribute
		var current_score = 0,
			score_string  = $(node).data( attr );
		if ( score_string ) { current_score = parseFloat( score_string ) }

		var new_score = current_score + toAdd;
		$(node).data( attr, toString(new_score) );

		return new_score;
	};  // End getter.addToAttr()



	getter.update_score = function ( node, addToScore ) {
    // """Adds a score to the gravityScore Attribute we put on divs
    // we'll get the current score then add the score we're passing
    // in to the current.
    // """ // Wut?

     //    // current_score = 0
     //    // score_string = self.parser.getAttribute(node, 'gravityScore')
     //    // if score_string:
     //    //     current_score = float(score_string)
    	// var current_score = 0,
    	// 	score_string = $(node).data( 'gravityScore' );
    	// if ( score_string ) { current_score = parseFloat( score_string ) }

     //    // new_score = current_score + addToScore
     //    // self.parser.setAttribute(node, "gravityScore", str(new_score))
     //    var new_score = current_score + addToScore;
     //    $(node).data( 'gravityScore', toString(new_score) );

     	var new_score = getter.addToAttr( 'gravityScore', node, addToScore );

        // Knod's
        return new_score;
	};  // End getter.update_score()



	getter.update_node_count = function ( node, add_to_count ) {
	// """Stores how many decent nodes are under a parent node
	// """
		// current_score = 0
		// count_string = self.parser.getAttribute(node, 'gravityNodes')
		// if count_string:
		//     current_score = int(count_string)

		// new_score = current_score + add_to_count
		// self.parser.setAttribute(node, "gravityNodes", str(new_score))

		var new_score = getter.addToAttr( 'gravityNodes', node, add_to_count );

		// Knod's
		return new_score;
	};  // End getter.update_node_count()



	getter.get_node_gravity_score = function ( node ) {

		// grvScoreString = self.parser.getAttribute(node, 'gravityScore')
		var grvScoreString = $(node).data('gravityScore');

        // if not grvScoreString:
        //     return None
        // return float(grvScoreString)
		if ( !grvScoreString ) { grvScoreString = 0; }
		else { grvScoreString = parseFloat( grvScoreString ); }

		return grvScoreString;
	};  // End getter.get_node_gravity_score()
        


	getter.calculate_best_node = function ( rootNode ) {

		// top_node = None
		    // nodes_to_check = self.nodes_to_check(doc)
		    // starting_boost = float(1.0)
		    // cnt = 0
		    // i = 0
		    // parent_nodes = []
		    // nodes_with_text = []
		var top_node = null;

		var nodes_to_check 	= getter.nodes_to_check( rootNode ),
			starting_boost 	= 1,
			cnt 			= 0, // "count"?
			someInt 		= 0, // ??
			parent_nodes 	= [],
			nodes_with_text = [];

		nodes_with_text = getTextNodes( nodes_to_check );

		// nodes_number = len(nodes_with_text)
		// negative_scoring = 0
		// bottom_negativescore_nodes = float(nodes_number) * 0.25
		var nodes_number 		= nodes_with_text.length,
			negative_scoring 	= 0,
			bottom_negativescore_nodes = nodes_number * 0.25;

		// for node in nodes_with_text:
		    // boost_score = float(0)
		for ( let nodei = 0; nodei < nodes_with_text.length; nodei++ ) {
			let node 		= nodes_with_text[ nodei ],
				boost_score = 0;
	        // if(self.is_boostable(node)):
	            // if cnt >= 0:
	            //     boost_score = float((1.0 / starting_boost) * 50)
	            //     starting_boost += 1
			// Add to score? If it meets some criteria I'm not sure of.
			// Skip this for now. TODO: implement
			if ( getter.is_boostable( node ) ) {

				if ( cnt >= 0 ) {
					boost_score = (1/starting_boost) * 50;  // Wut?
					starting_boost += 1;  // Why?
				}
			}  // end "boosting"

	        // if nodes_number > 15:
			// Number of nodes adds prestiege?
			if ( nodes_number > 15 ) { // Why 15?
	            // if (nodes_number - i) <= bottom_negativescore_nodes:
	                // booster = float(
	                    // bottom_negativescore_nodes - (nodes_number - i))
	                // boost_score = float(-pow(booster, float(2)))
	                // negscore = abs(boost_score) + negative_scoring
				if ( nodes_number - someInt <= bottom_negativescore_nodes ) {  // Not sure what's happening here either
					let booster = bottom_negativescore_nodes - ( nodes_number - someInt );
					boost_score = -1 * Math.pow( booster, 2 );  // What is this?
					var negscore = Math.abs( boost_score ) + negative_scoring;

	                // if negscore > 40:
	                    // boost_score = float(5)
	                // ??
					if ( negscore > 40 ) { boost_score = 5; }

				}  // end something to do with negative score

			}  // end number of nodes effect

	        // text_node = self.parser.getText(node)
	        // word_stats = self.stopwords_class(language=self.language).\
	        //     get_stopword_count(text_node)
	        // upscore = int(word_stats.get_stopword_count() + boost_score)
	        // # words + "boost"
			var text_node 	= $(node).text(),  // actually just "text"
				word_stats 	= getter.get_stopword_count( text_node ),
				upscore 	= word_stats + boost_score;

	        // parent_node = self.parser.getParent(node)
	        // self.update_score(parent_node, upscore)
	        // self.update_node_count(parent_node, 1)
			// Keep passing the score upwards to the ancestors?
			var parent_node = $(node).parent()[0];
			getter.update_score( parent_node, upscore );
			getter.update_node_count( parent_node, 1 );


			// if parent_node not in parent_nodes:
			//     parent_nodes.append(parent_node)

			// If this parent is not already in the parent nodes
			if ( parent_nodes.indexOf( parent_node ) === -1 ) {
				// Add it there. Why is this important?
				parent_nodes.push( parent_node );
			}

	        // parent_parent_node = self.parser.getParent(parent_node)
	        // if parent_parent_node is not None:
	        //     self.update_node_count(parent_parent_node, 1)
	        //     self.update_score(parent_parent_node, upscore / 2)
	        //     if parent_parent_node not in parent_nodes:
	        //         parent_nodes.append(parent_parent_node)
			// Parent of parent node (iterate outwards?)
			var parent_parent_node = $( parent_node ).parent()[0];
			// If there's a grandparent
			if ( parent_parent_node ) {
				// Update its attributes too
				getter.update_score( parent_parent_node, upscore/2 );
				getter.update_node_count( parent_parent_node, 1 );
				// Now add the grandparent to the list of parents?
				if ( parent_nodes.indexOf( parent_parent_node ) === -1 ) {
					// Add it there. Why is this important?
					parent_nodes.push( parent_parent_node );
				}  // end add grandparent to parent array (why?)
			}  // end grandparent stuff

			// console.log( 'parent_nodes:', parent_nodes.slice() );

			cnt 	+= 1;  // Increase /something/
	        // i 	+= 1
			someInt += 1;  // What is this?

		}  // end for every node with text

	    // top_node_score = 0
	    // for e in parent_nodes:
		// Calculate final score?
		var top_node_score = 0;
		for ( let parenti = 0; parenti < parent_nodes.length; parenti++ ) {
			let parNode = parent_nodes[ parenti ];

	        // score = self.get_score(e)
			let score = getter.get_node_gravity_score( parNode );

	        // if score > top_node_score:
	        //     top_node = e
	        //     top_node_score = score
	        // If anything gets a bigger score, it's top dog
	        // The next oen will have to compete against this new top score
			if ( score > top_node_score ) {
				top_node 		= parNode;
				top_node_score 	= score;
			}

	        // if top_node is None:
	        //     top_node = e
			// If there isn't a top node yet, make this first one into that top node
			if ( !top_node ) {
				top_node = parNode;
				// Why not assign score here too?
			}
		}

		return top_node;
	};  // End getter.calculateBestNode()


	getter.getMainText = function ( rootNode ) {
	// Runs the whole thing

		var top_node = getter.calculate_best_node( rootNode );
		console.log('top_node:', top_node);
		var clone 	 = $(top_node).clone();
		// Remove any script elements
		$(clone).find('script').remove();
		// What else should be removed? Tricky question.
		// console.log('clone:', clone[0]);
		var text 	 = $(clone).text();

		return text;
	};  // End getter.getText()

	window.ReadGetter = ReadGetter;

}(window, jQuery) );  // End getMainText()
