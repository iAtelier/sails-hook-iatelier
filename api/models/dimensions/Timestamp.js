'use strict';

const moment = require('moment');

let Timestamp = sails.hooks.borm.bookshelf.model(
    'Timestamp',
    {
        tableName: 'timestamps',
        hasTimestamps: true,
        timestampable() {
            return this.morphTo('timestampable')
        },
        m: function(input) {
            return moment(input);
        },
    },
    {
    }
);

module.exports = Timestamp;
