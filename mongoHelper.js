constraintFactory = {
    equal: {
        true: value => {return {$ne: value}},
        false: value => {return {$eq: value}}
    },
    lessThan: {
        true: value => {return {$gte: value}},
        false: value => {return {$lt: value}}
    },
    greatThan: {
        true: value => {return {$lte: value}},
        false: value => {return {$gt: value}}
    },
    include: {
        true: collection => {return {$nin: collection}},
        false: collection => {return {$in: collection}}
    }
};

module.exports.constraintFactory = constraintFactory;