'use strict'
const MongoClient = require('mongodb').MongoClient;

class Query {
    static server(connectionString) {
        return {
            collection: collection => new Query(connectionString, collection)
        }
    }
    constructor (connectionString, collection) {
        this.connectionString = connectionString;
        this.collection = collection;
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
        var constraint = this.isNegated ? {$ne: value} : value;
        return this.addConstraint(constraint);
    }
    lessThan(value) {
        var constraint = this.isNegated ? {$gte: value} : {$lt: value};
        return this.addConstraint(constraint);
    }
    greaterThan(value) {
        var constraint = this.isNegated ? {$lte: value} : {$gt: value};
        return this.addConstraint(constraint);
    }
    include(collection) {
        var constraint = this.isNegated ? {$nin: collection} : {$in: collection};
        return this.addConstraint(constraint);
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
        this.makeRequest(this, callback);
    }
    makeRequest (query, callback) {
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

