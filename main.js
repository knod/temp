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
			// var text = text.replace(/\[\d{0,3}?]/g, '');  // Removes wikipedia-like footnote references
			getReadOptions(text);
		}

		switch (request.functiontoInvoke) {
			case "readSelectedText":
				console.log(request.selectedText);
				read( request.selectedText );
				break;
			case "readFullPage":
				var $clone = $('html').clone();
				$clone.find('sup').remove();
				detect( $clone.text() ).then(function (data) {
					var lang = data.iso6391 || 'en',
						data = unfluff( $clone.html(), lang );
					read( data.text )
				});
				break;
			default:
				break;
		}  // end which event

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

})();
