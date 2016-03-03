'use strict'
const MongoClient = require('mongodb').MongoClient;
const mongoHelper = require('./mongohelper');
class Query {
    static server(connectionString) {
        return {
            collection: collection => new Query(connectionString, collection)
        }
    }
    constructor (connectionString, collection) {
        this.connectionString = connectionString;
        this.collection = collection;
        //this.queryObject = {};
        this.queryObject = {$and:[{}]};
        this.dbFunction = undefined;
        this.field = undefined;
        this.isNegated = false;
    }
    where(field) {
        this.field = field;
        this.isNegated = false;
        return this;
    }
    not() {
        this.isNegated = !this.isNegated;
        return this;
    }
    equal(value) {
        return this.addConstraint(mongoHelper
            .constraintFactory
            .equal[Number(this.isNegated)](value));
    }
    lessThan(value) {
        return this.addConstraint(mongoHelper
            .constraintFactory
            .lessThan[Number(this.isNegated)](value));
    }
    greatThan(value) {
        return this.addConstraint(mongoHelper
            .constraintFactory
            .greatThan[Number(this.isNegated)](value));
    }
    include(collection) {
        return this.addConstraint(mongoHelper
            .constraintFactory
            .include[Number(this.isNegated)](collection));
    }
    addConstraint(constraint) {
        var subQuery = {};
        subQuery[this.field] = constraint;
        this.queryObject['$and'].push(subQuery);
        return this;
    }
    find(callback) {
        this.dbFunction = (collection, cb) =>
            collection.find(this.queryObject).toArray(cb);
        this.makeRequest(callback);
    }
    remove(callback) {
        this.dbFunction = (collection, cb) => {
            collection.deleteMany(this.queryObject, cb);
        };
        this.makeRequest(callback);
    }
    insert(record, callback) {
        this.dbFunction = (collection, innerCallback) => {
            collection.insertOne(record, innerCallback);
        };
        this.makeRequest(callback);
    }
    set(newField, value) {
        var setObject = {};
        setObject[newField] = value;
        this.setQuery = {$set: setObject};
        return this;
    }
    update(callback) {
        this.dbFunction = (collection, cb) => {
            collection.updateMany(this.queryObject, this.setQuery, cb);
        };
        this.makeRequest(callback);
    }
    makeRequest (callback) {
        var query = this;
        MongoClient.connect(this.connectionString, function (err, db) {
            var collection = db.collection(query.collection);
            query.dbFunction(collection, function (err, result) {
                callback(err, result);
                db.close();
            });
        });
    }
}

module.exports.server = Query.server;
