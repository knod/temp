var unfluff = require('unfluff-custom');
var detect = require('detect-lang-flex');

(function(){

	var readOptions = {
		"wpm": 300,
		"slowStartCount": 5,
		"sentenceDelay": 2.5,
		"otherPuncDelay": 1.5,
		"shortWordDelay": 1.3,
		"longWordDelay": 1.4
	};

	chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

		var read = function ( text ) {
			var filtered = text.replace(/\[\d{0,3}?]/g, '');
			getReadOptions(filtered);
		}

		switch (request.functiontoInvoke) {
			case "readSelectedText":
				read( request.selectedText );
				break;
			case "readFullPage":
				detect( $(document.body).text() ).then(function (data) {
					var lang = data.iso6391 || 'en',
						data = unfluff( document.documentElement.outerHTML, lang );
					read( data.text )
				});
				break;
			default:
				break;
		}  // End which event

	});

	$(document).on( 'blur', '.__read .__read_speed', function () {
		var val = Math.min( 15000, Math.max( 0, parseInt(this.value,10)));
		setReadOptions( {"wpm": val} );
	});

	$(document).on( 'blur', '.__read .__read_slow_start', function () {
		var val = Math.min( 5, Math.max( 1, parseInt(this.value,10)));
		setReadOptions( {"slowStartCount": val} );
	});

	$(document).on( 'blur', '.__read .__read_sentence_delay', function () {
		var val = Math.min( 5, Math.max( 0, Number(this.value)));
		setReadOptions( {"sentenceDelay": val} );
	});

	$(document).on( 'blur', '.__read .__read_punc_delay', function () {
		var val = Math.min( 5, Math.max( 0, Number(this.value)));
		setReadOptions( {"otherPuncDelay": val} );
	});

	$(document).on( 'blur', '.__read .__read_short_word_delay', function () {
		var val = Math.min( 5, Math.max( 0, Number(this.value)));
		setReadOptions( {"shortWordDelay": val} );
	});

	$(document).on( 'blur', '.__read .__read_long_word_delay', function () {
		var val = Math.min( 5, Math.max( 0, Number(this.value)));
		setReadOptions( {"longWordDelay": val} );
	});

	function setReadOptions ( myOptions ) {
		readOptions = $.extend( {}, readOptions, myOptions );
		chrome.storage.sync.clear(function () {
			chrome.storage.sync.set(readOptions, function() {
				//console.log('[READ] set:', readOptions);
			});
		});
	}

	function getReadOptions ( text ) {
		chrome.storage.sync.get(null, function ( myOptions ) {
			readOptions = $.extend( {}, readOptions, myOptions );
			//console.log('[READ] get:', readOptions);
			var r = new Read ( text, readOptions );
			r.play();
		});
	}

	// Detecting languages the hard way

	function detectLanguage () {
	/* 
	* Tries to detect the page language using actual text
	* from the page (since meta data has been insufficient)
	*/
		// Default :P
		var lang = 'en';

		var preText = '',
			$elems 	= $('p');

		for ( let eli = 0; eli < $elems.length; eli++ ) {
			preText += $( $elems[eli] ).text();
		}

		// Total number of words
		var numWords 	= preText.split(' ').length,
			numInLang 	= 0;

		// console.log('total words:', numWords)

		// Find other languages (let's start with greek)
		var langMatch 	= matchLanguage( preText ),
			code 		= langMatch[0],
			numMatches 	= langMatch[1]

		var ratio = numMatches/numWords;
		// console.log('ratio:', ratio)

		// If more than half the words are in the other language
		if ( ratio > 0.5 ) {
			lang = code;
		}

		// console.log('lang:', lang);
		return lang;
	}  // End detectLanguage()

	function matchLanguage ( text ) {

		// // Can we just use stopwords?
		// 	stopwords = {
		//     ar: require('../data/stopwords/stopwords-ar.js'),
		//     bg: require('../data/stopwords/stopwords-bg.js'),
		//     cs: require('../data/stopwords/stopwords-cs.js'),
		//     da: require('../data/stopwords/stopwords-da.js'),
		//     de: require('../data/stopwords/stopwords-de.js'),
		//     el: require('../data/stopwords/stopwords-el.js'),
		//     en: require('../data/stopwords/stopwords-en.js'),
		//     es: require('../data/stopwords/stopwords-es.js'),
		//     fi: require('../data/stopwords/stopwords-fi.js'),
		//     fr: require('../data/stopwords/stopwords-fr.js'),
		//     hu: require('../data/stopwords/stopwords-hu.js'),
		//     id: require('../data/stopwords/stopwords-id.js'),
		//     it: require('../data/stopwords/stopwords-it.js'),
		//     ko: require('../data/stopwords/stopwords-ko.js'),
		//     nb: require('../data/stopwords/stopwords-nb.js'),
		//     no: require('../data/stopwords/stopwords-no.js'),
		//     pl: require('../data/stopwords/stopwords-pl.js'),
		//     pt: require('../data/stopwords/stopwords-pt.js'),
		//     ru: require('../data/stopwords/stopwords-ru.js'),
		//     sv: require('../data/stopwords/stopwords-sv.js'),
		//     th: require('../data/stopwords/stopwords-th.js'),
		//     tr: require('../data/stopwords/stopwords-tr.js'),
		//     zh: require('../data/stopwords/stopwords-zh.js')
		//   };
		// en is only alphabetical characters
		var regexes = {
			ar: /[\u0600-\u06FF]+/g, bg: /x+/g, cs: /x+/g,
			da: /x+/g, de: /x+/g, el: /[\u0370-\u03FF]+/g,
			en: /[\u0041-\u005A|\u0061-\u007A]+/g, es: /x+/g, fi: /x+/g,
			fr: /x+/g, hu: /x+/g, id: /x+/g,
			it: /x+/g, ko: /x+/g, nb: /x+/g,
			no: /x+/g, pl: /x+/g, pt: /x+/g,
			ru: /x+/g, sv: /x+/g, th: /x+/g,
			tr: /x+/g, zh: /x+/g
		};

		// var regexes = require('./node_modules/unfluff/data/stopwords/stopwords-regex.js')

		// If one is added here, a file needs to be added to ../data/stopwords and
		// it needs to be added to the list in stopwords.js
		var codes = [ 'el', 'en' ];

		// var codes = [ 'ar', 'bg', 'cs', 'da', 'de', 'el', 'en',
		// 			'es', 'fi', 'fr', 'hu', 'id', 'it', 'ko', 'nb', 'no',
		// 			'pl', 'pt', 'ru', 'sv', 'th', 'tr', 'zh' ];

		var topCode 	= 'en',
			topMatches 	= 0;

		// Get the code for the language code that has the most matching text
		for ( let codei = 0; codei < codes.length; codei++ ) {
			let code 		= codes[ codei ];

			// Get number of matches in this language
			let matches 	= text.match( regexes[ code ] ),
				// Because .match can come out to null (comment here: http://stackoverflow.com/a/1072782/3791179)
				numMatches 	= ( matches || [] ).length;

			// console.log('matches:', code + ':', matches)
			// if ( matches ) { numMatches = matches.length; }

			// Top the previous one, if you can
			if ( numMatches > topMatches ) {
				topMatches 	= numMatches;
				topCode 	= code;
			}
		}  // end for each language code

		return [topCode, topMatches];
	};  // End matchLanguage()

})();
