'use strict';
const MongoClient = require('mongodb').MongoClient;
const mongoHelper = require('./mongohelper');
const Immutable = require('immutable');

class Query {
    static server(connectionString) {
        return {
            collection: collection => new Query({
                connectionString,
                collection
            })
        };
    }

    constructor(query, params) {
        this.connectionString = query.connectionString;
        this.collection = query.collection;
        this.constraints = query.constraints || Immutable.List([{}]);
        this.queryObject = Immutable.Map({$and: this.constraints});
        this.field = query.field;
        this.isNegated = query.isNegated || false;
        if (params)
            Object.keys(params).forEach(key => {
                this[key] = params[key];
            });
    }

    where(field) {
        return new Query(this, {
            field,
            isNegated: false
        });
    }

    not() {
        return new Query(this, {isNegated: !this.isNegated});
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
        var constraints = this.constraints.push(subQuery);
        var queryObject = this.queryObject.set('$and', constraints);
        return new Query(this, {constraints, queryObject});
    }

    find(callback) {
        var dbFunction = (collection, cb) => {
            collection.find(mapToObject(this.queryObject)).toArray(cb);
        };
        this.makeRequest(dbFunction, callback);
    }

    remove(callback) {
        var dbFunction = (collection, cb) => {
            collection.deleteMany(mapToObject(this.queryObject), cb);
        };
        this.makeRequest(dbFunction, callback);
    }

    insert(record, callback) {
        var dbFunction = (collection, innerCallback) => {
            collection.insertOne(record, innerCallback);
        };
        this.makeRequest(dbFunction, callback);
    }

    set(newField, value) {
        var setObject = {};
        setObject[newField] = value;
        return new Query(this, {setQuery: {$set: setObject}});
    }

    update(callback) {
        var dbFunction = (collection, cb) => {
            collection.updateMany(mapToObject(this.queryObject), this.setQuery, cb);
        };
        this.makeRequest(dbFunction, callback);
    }

    makeRequest(dbFunction, callback) {
        var collection = this.collection;
        MongoClient.connect(this.connectionString, function (err, db) {
            var dbCollection = db.collection(collection);
            dbFunction(dbCollection, function (err, result) {
                callback(err, result);
                db.close();
            });
        });
    }
}
function mapToObject(map) {
    return [...map.keys()].reduce((object, key) => {
        object[key] = map.get(key).toArray();
        return object;
    }, {});
}
module.exports.server = Query.server;
