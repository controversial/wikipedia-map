# wikipedia-map
See it at [luke.deentaylor.com/wikipedia](http://luke.deentaylor.com/wikipedia/)

A web app for visualizing the connection of wikipedia pages. Powered mainly by [vis.js](visjs.org),
with only minor usage of other libraries ([tinycolor](https://github.com/bgrins/TinyColor),
[jQuery](http://jquery.com), and [wordwrap](http://phpjs.org/functions/wordwrap/)). At the beginning,
enter the name of a page from which you'd like to start.

###Opening nodes
Double-click nodes to open them.

When you double click a node, a request is made to a Flask server (under the `api` directory), which uses
`BeautifulSoup` to parse through the HTML of wikipedia pages. The Flask server returns a list of all the pages
which are linked to from the first paragraph of the node. Links from the first paragraph of a Wikipedia article
are generally directly related to the article. Only using links from the first paragraph also allows for
a managable number of sub-nodes to be created (usually 5-10).

![](http://i.imgur.com/lnxGNR2.png)
![](http://i.imgur.com/nXac2hX.png)
