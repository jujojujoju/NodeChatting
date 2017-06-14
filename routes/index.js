var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/test');
mongoose.connect('mongodb://jujoju:cjy1136q@ds123662.mlab.com:23662/jujoju');
var db = mongoose.connection;
var url = require("url");
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("mongo db connection OK");
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('login', {title: 'login', login_fail: false});

});


/* Schema 선언 */
var testSchema = mongoose.Schema({
    name: String,
    keyword: String
});
/* Model 선언 */
var TestModel = mongoose.model("users", testSchema);

module.exports.remove =  function(nick, key) {
    TestModel.remove({name: nick, keyword: key});
};

/* Create Instance */
router.get('/chat', function (req, res, next) {
    var params = url.parse(req.url, true).query;

    TestModel.find({keyword: params["keyWord"]}, function (err, models) {
        if (err) return console.error(err);

        if (models.toString() == "") {
            console.log("없던 방");

            var testIns = new TestModel({name: params["username"], keyword: params["keyWord"]});
            testIns.save(function (err, testIns) {
                if (err) return console.error(err);
                res.render('index', {
                    title: 'chatting',
                    nickname: params["username"],
                    keyword: params["keyWord"],
                    userNum: 0
                });

            });

        }
        else {
            console.log("있던 방");
            var query = TestModel.findOne({keyword: params["keyWord"]});

            query.find({name: params["username"]}, function (err, models) {

                if (models.toString() == "") {
                    console.log("있던 방의 없던이름");

                    var userNumInKeyWord = 0;
                    TestModel.count({keyword: params["keyWord"]},function (err,count) {
                        console.log('Count is ' + count);
                        userNumInKeyWord = count;
                    });

                    var testIns = new TestModel({name: params["username"], keyword: params["keyWord"]});
                    testIns.save(function (err, testIns) {
                        if (err) return console.error(err);
                        res.render('index', {
                            title: 'chatting',
                            nickname: params["username"],
                            keyword: params["keyWord"],
                            userNum:userNumInKeyWord
                        });

                    });

                }
                else {
                    console.log("있던 방의 있는이름");
                    res.render('login', {title: 'login', login_fail: true});
                }

            });


        }

    });


});


module.exports = router;