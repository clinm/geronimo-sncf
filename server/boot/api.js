var fetch = require('node-fetch');
var parsing = require('../../modules/scnf/parsing');
var filtering = require('../../modules/scnf/filtering');
var sjob = require('../../modules/jobs/scheduled_jobs');

var job_conf = {
    id: "retrieve_disruption",
    interval: 5 * 60 * 1000,
    job : function() {
        return new Promise(async_task);
    }
};

var async_task = function(fulfill) {
    fetch('https://a9855a18-1753-4acb-a28a-84ef88a85162@api.sncf.com/v1/coverage/sncf/traffic_reports/')
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        if (json.disruptions) {
            var extracted = parsing.translateDisruption(json.disruptions);
            var data = {};
            data.disruptions = extracted;
            data.info = {
                updated: new Date().getTime()
            };

            fulfill(data);
        }
    });
};

module.exports = function(app) {
    var router = app.loopback.Router();
    var sendData = {disruptions: [], info: {updated: new Date().getTime()}};

    sjob.add(job_conf.id, job_conf.job, job_conf.interval);
    sjob.start(job_conf.id);

    router.get('/api', function(req, res) {
        var newData = sjob.getValue(job_conf.id);

        if (newData && newData.info.updated > sendData.info.updated) {
            sendData = newData;
            newData.disruptions = filtering.filterAfterDay(newData.disruptions, filtering.getBeginningOfDay().getTime());
        }
        res.setHeader('Cache-Control', 'public, max-age=60');
        res.send(sendData);
    });
    app.use(router);
};