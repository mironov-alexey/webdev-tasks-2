const MongoClient = require('mongodb').MongoClient;
const multivarka = require('./multivarka');
/*
    { "_id" : ObjectId("56d72ffcf800d9253a4ca97e"), "a" : 1, "b" : 3, "c" : 11 }
    { "_id" : ObjectId("56d7301bf800d9253a4ca97f"), "a" : 1, "b" : 3, "c" : 9 }
    { "_id" : ObjectId("56d73024f800d9253a4ca980"), "a" : 1, "b" : 1, "c" : 9 }
    { "_id" : ObjectId("56d7302df800d9253a4ca981"), "a" : 2, "b" : 1, "c" : 8 }
    { "_id" : ObjectId("56d730d1f800d9253a4ca982"), "a" : 1, "b" : 3, "c" : 4 }
    { "_id" : ObjectId("56d730daf800d9253a4ca983"), "a" : 1, "b" : 3, "c" : 2 }
    { "_id" : ObjectId("56d730dcf800d9253a4ca984"), "a" : 1, "b" : 3, "c" : 3 }
    { "_id" : ObjectId("56d730e0f800d9253a4ca985"), "a" : 1, "b" : 3, "c" : 5 }
*/


multivarka
    .server('mongodb://localhost/test')
    .collection('variables')
    .where('a').equal(1)
    .where('b').not().equal(1)
    .where('c')
    .include([1, 2, 3, 4, 5, 9])
    .where('c').not().greaterThan(4).lessThan(3)
    .find((err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        }
    );