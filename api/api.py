from flask import Flask,request
import json

#My wikipedia API
from wikipedia_parse import *

app = Flask(__name__)

@app.route('/links')
def getSubPages():
    page=request.args.get("page")
    return json.dumps(first_paragraph_links(page))

@app.route('/pagename')
def getPageName():
    page=request.args.get("page")
    return json.dumps(get_page_name(page))

@app.route('/random')
def randomArticle():
  return get_random_article()

if __name__ == "__main__":
    app.run()
