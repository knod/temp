# This fork:

 - Centers words more consistently across languages
 - Parses html to try to find the main text of an article

-----
##Attributions:
This tool was derived from the [RSVP read plugin](https://github.com/MicroDroid/read_plugin) created by [MicroDroid](https://github.com/MicroDroid) which was derived from the [RSVP read plugin](https://github.com/jamestomasino/read_plugin) created by [jamestomasino](https://github.com/jamestomasino), which handles the UI of the RSVP interface.

It uses the node module [node-unfluff](https://github.com/ageitgey/node-unfluff) created by [ageitgey]. That modules parses the html and makes its best guess at what parts of the html represent what parts of an article. You can trace it all the way back to the Java article extractor called Goose.


## Read

Speed reading via rapid serial visual presentation (RSVP). RSVP flashes one word at you at a time so that you're concentrating on that single word instead of the whole text. As you get used to reading that way, you can speed up how fast the words change. Some people swear by it for speed reading, but it can also useful for moble devices and by people that have other difficulties reading the text of articles, like those with dyslexia or visual impairments.

Soon a plugin will be made!

- - - - -

### How to Use

Click the extension's icon to read the body of the article on the page or select any text by dragging over it with your mouse. When you right click on your selected text, choose the "Read Selected Text" option to launch the reading bar.

- `Pause` by clicking on the words in the reading bar.
- `Resume` by clicking on the words in the reading bar again.
- Change your reading speed using settings available from a gear icon on the left.

- - - - -

### Features

When reading the whole page, this tool, with the help of other modules and libraries, parses the html and tries to identify the main text there. That feature is not guaranteed to work. It all depends on how the html of the website is built. If it's built in a zany way, this tool may not be able to detect the main text. Selecting text should work anytime, though. It also tries to filter out a little of the noise often present in an article.

This tool uses the front-end only. No server required.

#### RSVP

(From [MicroDroid](https://github.com/MicroDroid/read_plugin)) Rapid serial visual presentation allows for readers to keep their eyes focused on a single point on the page, saving a massive amount of time normally lost in reading. As the speed of this serial presentation increases, sub-vocalization also decreases and astounding speeds can be reached with great comprehension.

#### Alignment

When the eyes read a word, there is an optimal focal point placement around 30% into the word to support easiest understanding. We handle this shift in the alignment of the words for you based on the word length.

#### Timing

Speed reading via RSVP is all about the timing. How long we display any given word can have a massive impact on the reading experience. Here's a few ways we optimize that experience.

#### Word Length

Contrary to expectations, reading small words can actually be more difficult than reading words of medium length. Long words also take a longer time to process. These extra delays are built into our rendering code.

#### Punctuation

When you encounter a period, question mark, exclamation point or other punctuation, additional time is provided to process the sentence or fragment. This helps avoid the feeling of a run-on sentence.

#### Paragraphs

The tool also gives an additional pause between paragraphs to help contextualize and process information as you read it.

#### Languages

This version of the tool fixes some centering issues that the previous tool had trouble with, so it should be located properly for any language it can handle now. It's not yet built to handle all languages yet, though, and not all languages have been fully tested.



- - - - -

### Library

If you are interested in making your own tool using the power of Read, start by grabbing the latest library from [this project](https://github.com/jamestomasino/read).

### License

I have no idea what license this has. NPM gave me some random one. Someone tell me something about licenses.

### Issues

If you find a bug or want to suggest a new feature, please log an issue [over here](https://github.com/knod/read_plugin/issues).
