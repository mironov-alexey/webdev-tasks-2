'use strict';
const multivarka = require('./multivarka');
/*
 [ a: 1, b: 3, c: 11 },
 { a: 1, b: 3, c: 9 },
 { a: 1, b: 1, c: 9 },
 { a: 2, b: 1, c: 8 },
 { a: 1, b: 3, c: 4 },
 { a: 1, b: 3, c: 2 },
 { a: 1, b: 3, c: 3 },
 { a: 1, b: 3, c: 5 } ]
*/

const variables =
    multivarka
        .server('mongodb://localhost/test')
        .collection('variables');

var onFindCb = (err, res) => {
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

var test1 = () =>
    variables
        .where('c')
        .greatThan(3)
        .where('b')
        .not()
        .equal(3)
        .find(onFindCb);

var test2 = () =>
    variables
        .where('a').equal(1)
        .where('b').not().equal(1)
        .where('c')
        .include([1, 2, 3, 4, 5, 9])
        .where('c').not().greatThan(4)
        .where('c').greatThan(2)
        .find(onFindCb);


var insertTest = () => variables.insert({a: 0, b: 0, c: 0}, onChangeCb);

var updateTest = () =>
    variables
        .where('a')
        .equal(0)
        .set('a', -1)
        .update(onChangeCb);

var removeTest = () =>
    variables
        .where('b')
        .equal(0)
        .remove(onChangeCb);

var findAll = () => variables.find(onFindCb);

//test1();
//test2();
insertTest();
setTimeout(updateTest, 300);
setTimeout(removeTest, 600);
setTimeout(findAll, 900);
