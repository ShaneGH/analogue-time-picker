'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/material-time-lite.min.js');
} else {
    module.exports = require('./dist/material-time-lite.js');
}
