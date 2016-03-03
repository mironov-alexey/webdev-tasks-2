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

var findCb = (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log(res);
    }
};

var onChangeCb = (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log(res.result);
    }
};

test2 = _ => multivarka
    .server('mongodb://localhost/test')
    .collection('variables')
    .where('a').equal(1)
    .where('b').not().equal(1)
    .where('c')
    .include([1, 2, 3, 4, 5, 9])
    .where('c').not().greatThan(4)
    .where('c').greatThan(2)
    .find(findCb);

test1 = _ => multivarka
    .server('mongodb://localhost/test')
    .collection('variables')
    .where('c')
    .greatThan(3)
    .where('b')
    .not()
    .equal(3)
    .find();
insertTest = _ => multivarka
    .server('mongodb://localhost/test')
    .collection('variables')
    .insert({a: 0, b: 0, c: 0}, onChangeCb);

updateTest = _ => multivarka
    .server('mongodb://localhost/test')
    .collection('variables')
    .where('a')
    .equal(0)
    .set('a', -1)
    .update(onChangeCb);

removeTest = _ => multivarka
    .server('mongodb://localhost/test')
    .collection('variables')
    .where('b')
    .equal(0)
    .remove(onChangeCb);

findAll = _ => multivarka
    .server('mongodb://localhost/test')
    .collection('variables')
    .find(findCb);

//test1();
//test2();
//insertTest();
//updateTest();
//removeTest();
//findAll();