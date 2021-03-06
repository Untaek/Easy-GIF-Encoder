Structed GIF Encoder
====================

The GIF Encoder, which have a source code that easy to read. Totally based on documentation 'spec-gif89a'. Source code is written by Typescript. I planned to implement various quantization algorithms.  
This encoder support browser from now on.

Encoding flow
-------------
![diagram](./diagram.png)

Purpose
-------
- Easy to read the source code.
- If you are first time to learn it, you can get acknowledge about image encoding.
- To actually use.

Prerequsition
-------------
- Latest version of Node.js.

Results
-------
 - Source image (jpeg)  
![source](./samples/test_image.jpg)

 - Uniform  
![uniform](./samples/uniform_result.gif)

 - Mediancut (still improving)  
![mediancut](./samples/mediancut_result.gif)

Build (Browser support)
-----
```npm install && npx tsc && npx gulp```

Notice
------
I am not sure about performance. And may there is some glitches on encoding result. I will keep improve it.
If you have any idea, make a issue or contact me.

Contact
-------
wkblack11@gmail.com

Reference
---------
GIF89a Specifiation  
https://www.w3.org/Graphics/GIF/spec-gif89a.txt

LZW compression used to encode/decode a GIF file by Bob Montgomery  
http://giflib.sourceforge.net/lzgif.txt

What's In A GIF (Useful information to programming)  
http://giflib.sourceforge.net/whatsinagif/index.html

GIF Wikipedia  
https://en.wikipedia.org/wiki/GIF

Median Cut  
http://collaboration.cmc.ec.gc.ca/science/rpn/biblio/ddj/Website/articles/DDJ/1994/9409/9409e/9409e.htm  