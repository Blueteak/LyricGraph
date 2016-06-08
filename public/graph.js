// Graph Creation from Lyrics
// Created by Blueteak - 6/5/2016

var loadingMsg;
$(document).ready(function(){
    loadingMsg = document.getElementById("loadingInfo");
    search();
});
// Perform AJAX query to server for lyrics
function search()
{
    document.getElementById("submitButton").enabled = false;
    var artist = encodeURI(document.getElementById("artistInpt").value);
    var song = encodeURI(document.getElementById("songInpt").value);
    loadingMsg.innerHTML = "Searching: " + document.getElementById("songInpt").value + " - by " + document.getElementById("artistInpt").value;
    $.ajax({ // make an AJAX request
        type: "GET",
        url: "/search",
        data: {
            song: song,
            artist: artist
        },
        success: function (res) {
            document.getElementById("submitButton").enabled = true;
            if(res.length > 1)
            {
                loadingMsg.innerHTML = "Creating lyric graph...";
                createGraph(res);
            }
            else
            {
                alert("Song not found!");
                loadingMsg.innerHTML = "";
            }
        }
    });
}
// Create Lyric Graph from Lyric Text
function createGraph(txt)
{
    var nodes = getNodes(txt);
    var edges = getEdges(nodes);
    var data = {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges)
    };
    var options = {
        physics: {
            enabled: true,
            barnesHut: {
                springLength: 15,
                springConstant: .005,
                avoidOverlap: .2
            },
            minVelocity: 0.1
        },
        nodes: {
            font: {
                color: 'rgba(200,200,200,1)'
            },
            shape: 'dot',
            scaling: {
                min: 5,
                max: 50
            }
        }
    };
    var container = document.getElementById('graph');
    console.log(container);
    var network = new vis.Network(container, data, options);
    network.on("afterDrawing", function(){
        loadingMsg.innerHTML = "";
    });
    setTimeout(function () {
        network.stopSimulation();
    }, 5000);
}
// Create graph nodes from lyrics
function getNodes(lyric)
{
    var nodes = [];
    var words = ParseWords(lyric);
    var i = 0;
    $.each(words, function(index, val){
        var node = {};
        node.id = i;
        node.label = val.word;
        node.assoc = val.assoc;
        node.value = val.count;
        if(commonWord(val.word))
        {
            node.color = {
                background: "rgb(56,56,128)"
            }
        }
        nodes.push(node);
        i++;
    });
    return nodes;
}
// Check if word is 'common'
function commonWord(word)
{
    var cWords = {and:1, the:1, a:1, of:1, in:1};
    return(cWords[word] != undefined)
}
// Get edges from node list
function getEdges(nodes)
{
    var edges = [];
    var k = 0;
    for(var i=0; i < nodes.length; i++)
    {
        var val = nodes[i];
        $.each(val.assoc, function(index, val) {
            var edge = {};
            edge.id = k;
            edge.from = i;
            edge.to = getIDFromWord(nodes, index);
            edge.value = val;
            edges.push(edge);
            k++;
        });
    }
    return edges;
}
// Get node id from word list
function getIDFromWord(words, word)
{
    for(var i=0; i<words.length; i++)
    {
        if(words[i].label == word)
        {
            return i;
        }
    }
    return -1;
}
// Parse Lyric Text into Words with relations
function ParseWords(strng)
{
    strng = strng.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");     //Remove non-word related punctuation
    strng = strng.replace(/(\r\n|\n|\r)/gm," "); //Remove all line breaks
    strng = strng.replace(/\s+/g," "); //Remove double spaces
    strng = strng.toLowerCase();
    var WordList = strng.split(' ');
    var WordAssoc = {};
    // Fill out word object
    for(var i=0; i<WordList.length; i++)
    {
        var word = WordList[i];
        if(WordAssoc[word] != undefined) { // If word already exists, increase its value
            WordAssoc[word].count = (WordAssoc[word].count+1);
        }
        else { // Create new Word
            WordAssoc[word] = {
                word: word,
                count: 1,
                assoc: {}
            }
        }
        if(i > 0) // Link words to each other based on proximity
        {
            //We don't need to get words in front, because that word will get it's 'behind' word and create link itself
            if( WordAssoc[word].assoc[WordList[i-1]] == undefined)
                WordAssoc[word].assoc[WordList[i-1]] = 1;
            else
                WordAssoc[word].assoc[WordList[i-1]]++;
        }
    }
    return WordAssoc;
}

