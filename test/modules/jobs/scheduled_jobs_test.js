var expect = require("chai").expect;

var _ = require('underscore');

describe("Adding Jobs", function() {
    var jobs = require('../../../modules/jobs/scheduled_jobs');

    describe("Basic manipulation", function() {
        it("should add a job", function() {
            var added = jobs.add("myKey", function(){}, 1000);
            expect(added).to.be.true;
        });

        it("should found a job for a known key", function() {
            var info = jobs.getInfo("myKey");
            expect(info).to.be.exist;
        });

        it("should not found a job for a unknown key", function() {
            var info = jobs.getInfo("unknownKey");
            expect(info).to.be.undefined;
        });

        it("should list jobs (and make code coverage happy", function() {
            jobs.list();
        });
    });

    describe("Checking job's parameter", function() {
        var checkIfAdded = function(key, added, expected) {
            if (expected) {
                expect(added).to.be.true;
                expect(jobs.getInfo(key)).to.not.be.undefined;
            } else {
                expect(added).to.be.false;
                expect(jobs.getInfo(key)).to.be.undefined;
            }
        };

        var testJobInterval = function(key, interval, expected) {
            var added = jobs.add(key, function(){}, interval);

            checkIfAdded(key, added, expected);
        };

        it("should not add job with negative interval", function() {
            testJobInterval("negativeInterval", -100, false);
        });

        it("should not add job with 0 as interval", function() {
            testJobInterval("negativeInterval", 0, false);
        });

        it("should add job with positive interval", function() {
            testJobInterval("negativeInterval", 100, true);
        });

        var testJobFunction = function(key, func, expected) {
            var added = jobs.add(key, func, 1000);

            checkIfAdded(key, added, expected);
        };

        it("should not add job with no function", function() {
            testJobFunction("noFunc", undefined, false);
        });

        it("should not add job with string as function", function() {
            testJobFunction("noFunc", "myFunction", false);
        });

        it("should add job with function", function() {
            testJobFunction("noFunc", function(){}, true);
        });
    });

    describe("Starting jobs", function() {
        it("should not start an unknown job", function() {
            var started = jobs.start("unknownKey");
            expect(started).to.be.false;
        });

        it("should start an known job", function(done) {
            var calledOnce = false;
            jobs.add("callback", function() {
                return new Promise(function(resolve) {
                    setTimeout(function() {
                        if (!calledOnce) {
                            done();
                            calledOnce = true;
                        }
                        resolve();
                    }, 0);
                });
            }, 100);

            var started = jobs.start("callback");
            expect(started).to.be.true;
        });

        it("should start the job periodically", function(done) {
            var n = 0;
            jobs.add("callbackSeveralTimes", function() {
                return new Promise(function(resolve) {
                    setTimeout(function() {
                        n++;
                        if (n === 2) {
                            done();
                        }
                        resolve();
                    }, 0);
                });
            }, 50);

            var started = jobs.start("callbackSeveralTimes");
            expect(started).to.be.true;
        });
    });

    describe("Started jobs update data", function() {

        it("should update info.updated", function(done) {
            var n = 0;
            var lastInfo;

            jobs.add("updateInfo", function() {
                return new Promise(function(resolve) {
                    setTimeout(function() {
                        var newInfo = jobs.getInfo("updateInfo");
                        if (n > 1) {
                            expect(newInfo.updated > lastInfo.updated).to.be.true;
                            expect(newInfo.start).to.be.equal(lastInfo.start);
                        }
                        lastInfo = _.clone(newInfo);
                        n++;

                        if (n === 3) {
                            done();
                        }

                        resolve();
                    }, 0);
                });
            }, 25);

            var started = jobs.start("updateInfo");
            expect(started).to.be.true;
        });

        it("should set job's status", function(done) {

            jobs.add("updateStatus", function() {
                return new Promise(function(resolve) {
                    setTimeout(function() {
                        var info = jobs.getInfo("updateStatus");
                        expect(info.running).to.be.true;
                        expect(info.start).to.not.be.undefined;
                        jobs.stop("updateStatus");
                        done();

                        resolve();
                    }, 0);
                });


            }, 10);

            var started = jobs.start("updateStatus");
            expect(started).to.be.true;
        });

        it("should stop jobs", function(done) {
            var n = 0;
            jobs.add("startStop", function() {
                return new Promise(function(resolve) {
                    setTimeout(function() {
                        var info = jobs.getInfo("startStop");
                        expect(info.running).to.be.true;
                        expect(info.start).to.not.be.undefined;

                        if (n === 2) {
                            jobs.stop("startStop");
                            setTimeout(function(){
                                expect(n <= 3).to.be.true;
                                done();
                            }, 50);
                        }

                        n++;

                        resolve();
                    }, 0);
                });


            }, 10);

            var started = jobs.start("startStop");
            expect(started).to.be.true;
        });

        it("should do nothing when stopping unknown job", function() {
            jobs.stop("unknown_running_job");
        });

        it("should update value", function(done) {
            var n = 0;
            jobs.add("startStop", function() {
                return new Promise(function(resolve) {
                    setTimeout(function() {
                        if (n === 2) {
                            expect(jobs.getValue("startStop")).to.be.equal(2);
                            jobs.stop("startStop");
                            setTimeout(function(){
                                expect(n <= 3).to.be.true;
                                done();
                            }, 50);
                        }

                        n++;

                        resolve(n);
                    }, 0);
                });


            }, 10);

            var started = jobs.start("startStop");
            expect(started).to.be.true;
        });



        it("should restart job", function(done) {
            var n = 0;
            jobs.add("startStopStart", function() {
                return new Promise(function(resolve) {
                    setTimeout(function() {
                        if (n >= 3) {
                            jobs.stop("startStopStart");
                            setTimeout(function(){
                                expect(n === 4).to.be.true;
                                done();
                            }, 30);
                        } else if (n === 2) {
                            expect(jobs.getValue("startStopStart")).to.be.equal(2);
                            jobs.stop("startStopStart");
                            setTimeout(function(){
                                expect(n <= 3).to.be.true;
                                jobs.start("startStopStart");
                            }, 30);
                        }

                        n++;

                        resolve(n);
                    }, 0);
                });


            }, 10);

            var started = jobs.start("startStopStart");
            expect(started).to.be.true;
        });
    });

});