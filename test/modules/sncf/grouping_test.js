var expect = require("chai").expect;
var chai = require("chai");
var spies = require('chai-spies');
chai.use(spies);

describe("Grouping", function() {
    var grouping = require('../../../modules/scnf/grouping');

    describe("groupByText", function () {

        it("should add one entry per element", function () {
            var disruptions = [{text: 'A'}, {text: 'B'}, {text: 'C'}];
            var res = grouping.groupByText(disruptions);

            expect(res['A']).to.be.equal(1);
            expect(res['B']).to.be.equal(1);
            expect(res['C']).to.be.equal(1);
        });

        it("should count for each entry", function () {
            var disruptions = [{text: 'A'}, {text: 'B'}, {text: 'A'}, {text: 'C'}, {text: 'C'}, {text: 'C'}];
            var res = grouping.groupByText(disruptions);

            expect(res['A']).to.be.equal(2);
            expect(res['B']).to.be.equal(1);
            expect(res['C']).to.be.equal(3);
        });

    });

    describe("groupByTextToArray", function() {
        it("should called groupByText and ToArray", function() {
            chai.spy.on(grouping, 'groupByText');
            chai.spy.on(grouping, 'toArray');

            grouping.groupByTextToArray([]);
            expect(grouping.toArray).to.have.been.called.once;
            expect(grouping.groupByText).to.have.been.called.once;
        });
    });

    describe("toArray", function() {
        it("should return empty array", function() {
           var res = grouping.toArray([]);
           expect(res.length).to.be.equal(0);
        });

        it("should have one entry", function() {
            var values = [];
            values['value1'] = 10;

            var res = grouping.toArray(values);
            expect(res.length).to.be.equal(1);
            expect(res[0].value).to.be.equal('value1');
            expect(res[0].count).to.be.equal(10);
        });

    });
});