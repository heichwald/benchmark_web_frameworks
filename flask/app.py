from gevent import monkey; monkey.patch_all()
import time
from flask import Flask
from bson import Binary, Code
from bson.json_util import dumps
from pymongo import MongoClient

client = MongoClient(host='192.168.0.7', max_pool_size=1000)
test_db = client.articles

app = Flask(__name__)

@app.route("/sleep")
def sleep():
	#Sleep 1 sec
	time.sleep(1)
	return ''


@app.route("/mongo")
def mongo():
	return dumps(test_db.big.find_one())

if __name__ == "__main__":
    app.run(host='0.0.0.0')
