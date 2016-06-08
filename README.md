# LyricGraph
This project uses `vis.js` to create interactive graphs of song lyrics.<br><br>
Each word in a song is presented as a node, with size according to number of occurrences. Edges are created based on word proximity
in the song (so words directly before/after are linked) allowing you to follow the edges and read the song out loud. The graph uses a
physics simulation, so you can drag nodes around to coarsly re-shape the graph.<br><br>
http://chartlyrics.com supplies the lyrics, free for non-commercial use.

## Installation
Download and run `npm install` to install required components (express, body-parser, and xml2js) <br>
Run `index.js` to start the server, then navigate to localhost:8080 to view the graph.

##Preview
Here are a few graphs to show what the project does <br><br>
It's Not Unusual - Belly
<br>
![Not Unusual]
(http://i.imgur.com/D8LkPfk.png)
<br><br>
Purple Haze - Jimi Hendrix
<br>
![Purple Haze]
(http://i.imgur.com/mINZGsm.png)
<br><br>
Lose Yourself - Eminem <br>
(Zoomed in to see words)
<br>
![Lose Yourself]
(http://i.imgur.com/W2Gf4zh.png)
<br><br>

