constraintFactory = {
    equal: [
        value => ({$eq: value}),
        value => ({$ne: value})
    ],
    lessThan: [
        value => ({$lt: value}),
        value => ({$gte: value})
    ],
    greatThan: [
        value => ({$gt: value}),
        value => ({$lte: value})
    ],
    include: [
        collection => ({$in: collection}),
        collection => ({$nin: collection})
    ]
};

module.exports.constraintFactory = constraintFactory;