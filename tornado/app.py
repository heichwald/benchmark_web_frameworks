
import tornado.ioloop
import tornado.httpserver
import tornado.web
import tornado.gen
import motor
from bson import Binary, Code
from bson.json_util import dumps


class MongoHandler(tornado.web.RequestHandler):
    @tornado.gen.coroutine
    def get(self):
        document = yield db.articles.find_one()
        self.write(dumps(document))


if __name__ == "__main__":
    app = tornado.web.Application([(r"/mongo", MongoHandler)])
    server = tornado.httpserver.HTTPServer(app)
    server.bind(5000)
    server.start(0)  # autodetect number of cores and fork a process for each
    db = motor.MotorClient('192.168.0.7',max_pool_size=1500).articles
    app.settings['db'] = db
    tornado.ioloop.IOLoop.instance().start()
