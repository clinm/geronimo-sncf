module.exports = (function() {
    var _ = require('underscore');

    var jobs = {};

    var isAJob = function(job) {
        return job && _.isFunction(job);
    };

    /**
     *
     * @param {string} key       Job's identifier
     * @param {function}jobFunc   Job's function that returns a promise
     * @param {number} interval  Periodic time to start the job
     * @returns {*}
     */
    var createJob = function(key, jobFunc, interval) {

        if (interval <= 0) {
            return undefined;
        }

        if (!isAJob(jobFunc)) {
            return undefined;
        }

        return {
            key: key,
            jobFunc: jobFunc,
            value: undefined,
            interval: interval,
            info: {
                running: false,
                start: undefined,
                updated: undefined
            }
        };
    };

    /**
     * Updates data and info related to the given job and add
     * a new task in the queue using setTimeout
     * @param {string} key
     * @param {*} data      Data returned by the promise
     */
    var handleData = function(key, data) {
        var job = jobs[key];

        job.value = data;
        job.info.updated = new Date().getTime();

        setTimeout(function() {
            run(key);
        }, job.interval);
    };

    /**
     *  Run the given job
     *  If turnOff was set, update info and do not start another job
     * @param key   The job to run
     */
    var run = function(key) {
        var job = jobs[key];

        if (job.turnOff) {
            job.turnOff = false;
            job.info.running = false;
            return;
        }

        job.jobFunc().then(function(data) {
            handleData(key, data);
        });
    };

    return {
        /**
         * Add a job to the list of jobs but do not start it.
         * This method does not check if the key is already used.
         * @param {string} key          The job's identifier
         * @param {function} jobFunc    Function that returns a promise
         * @param {number} interval     Periodic time to execute the job
         * @returns {boolean}           True if the arguments are corrects, false otherwise
         */
        add: function(key, jobFunc, interval) {
            var added = false;
            var job = createJob(key, jobFunc, interval);

            if (typeof job !== 'undefined') {
                jobs[key] = job;
                added = true;
            }

            return added;
        },
        /**
         * Starts the corresponding job if there is one.
         * The job starts directly.
         * @param {string} key  The job's identifier
         * @returns {boolean}   True if the job was started, false otherwise
         */
        start: function(key) {
            var started = false;

            var job = jobs[key];
            if (_.isObject(job)) {
                job.info.running = true;
                job.info.start = new Date().getTime();
                run(key);
                started = true;
            }

            return started;
        },
        /**
         * Stop the periodic execution of the job.
         * Do not stop the current execution of the job (if any).
         * The job will be stoped before its next execution, so it might take a while
         * depending on the interval value
         * @param key   Job's identifier
         */
        stop: function(key) {
            var job = jobs[key];

            if (job) {
                job.turnOff = true;
            }
        },
        /**
         * List all job previously added
         */
        list: function() {
            console.log("Jobs: ");
            _.each(jobs, function(job, id) {
                console.log(id);
                console.log(job.info);
            });
        },
        /**
         *
         * @param {String} key   The job's identifier
         * @returns {Object} info related info to job
         */
        getInfo: function(key) {
            return jobs[key] && jobs[key].info;
        },
        /**
         *
         * @param {String} key   The job's identifier
         * @returns {Object} last value returned by job
         */
        getValue: function(key) {
            return jobs[key] && jobs[key].value;
        }
    };

})();