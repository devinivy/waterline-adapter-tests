var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Association', function() {
    describe('create nested associations()', function() {

      describe('with single level depth', function() {

        describe('and objects', function() {

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new customer and payment association', function(done) {

            var data = {
              name: 'has many nested',
              payments: [
                { amount: 1 },
                { amount: 2 }
              ]
            };

            Associations.Customer.create(data).exec(function(err, values) {
              if(err) return done(err);

              // Look up the customer again to be sure the payments were added
              Associations.Customer.findOne(values.id)
              .populate('payments')
              .exec(function(err, model) {
                if(err) return done(err);
                assert(model.payments.length === 2);
                assert(model.payments[1].amount === 2);
                done();
              });

            });
          });
        });

        describe('and objects mixed with ids', function() {
          var pmtId;

          before(function(done) {
            Associations.Payment.create({ amount: 1 }).exec(function(err, payment) {
              if(err) return done(err);
              pmtId = payment.id;
              done();
            });
          });

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new customer and payment association', function(done) {

            var data = {
              name: 'has many nested',
              payments: [
                pmtId,
                { amount: 2 }
              ]
            };

            Associations.Customer.create(data).exec(function(err, values) {
              assert(!err);

              // Look up the customer again to be sure the payments were added
              Associations.Customer.findOne(values.id)
              .populate('payments')
              .exec(function(err, model) {
                assert(!err);
                assert(model.payments.length === 2);
                assert(model.payments[1].amount === 2);
                done();
              });

            });
          });
        });

        describe('and custom id specified on parent with empty nested association', function() {

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new apartment without associated payments', function(done) {

            var data = {
              number: '66b',
              building: 'has many nested',
              payments: []
            };

            Associations.Apartment.create(data).exec(function(err, values) {
              assert(!err, err);

              // Look up the customer again to be sure the payments were added
              Associations.Apartment.findOne('66b')
              .populate('payments')
              .exec(function(err, model) {
                assert(!err, err);
                
                assert.equal(model.number, '66b')
                assert.equal(model.payments.length, 0);
                done();
              });

            });
          });
        });
        
      });
    });
  });
});
