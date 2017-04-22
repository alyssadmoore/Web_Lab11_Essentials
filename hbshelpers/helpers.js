var moment = require('moment');

function dateFormat(date){
    // Read date as UTC
    m = moment.utc(date);
    // Identify timezone in string
    return m.parseZone().format("dddd, MMMM Do YYYY, h:mm a");
}

var helpers = {
    dateFormatter: dateFormat
};

module.exports = helpers;