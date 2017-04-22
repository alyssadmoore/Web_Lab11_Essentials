var express = require('express');
var router = express.Router();
var Bird = require('../models/bird');

// GET home page
router.get('/', function(req, res, next) {
  Bird.find(function(err, birds){
      if (err){
          return next(err);
      }
      res.render('index', {birds: birds});
  })
});

// Post to home page (handle form submit)
router.post('/', function(req, res, next){

    // Make a copy of non-blank fields from req.body
    var birdData = {};

    for (var field in req.body){
        if (req.body[field]){
            birdData[field] = req.body[field];
        }
    }

    // If either of the nest attributes is provided, add to birdData
    if (birdData.nestLocation || birdData.nestMaterials){
        birdData.nest = {
            location: birdData.nestLocation,
            materials: birdData.nestMaterials
        }
    }

    // Remove non-nested data
    delete(birdData.nestLocation);
    delete(birdData.nestMaterials);

    var date = birdData.dateSeen || Date.now();
    birdData.datesSeen = [date];
    delete(birdData.dateSeen);
    console.log(req.body);

    var bird = Bird(birdData);

    bird.save(function(err, newbird){
        if (err){
            if (err.name == 'ValidationError'){
                var messages = [];
                for (var err_name in err.errors){
                    messages.push(err.errors[err_name].message);
                }

                req.flash('error', messages);
                return res.redirect('/')
            }

            return next(err);
        }
        console.log(newbird);
        return res.redirect('/')
    })
});

router.post('/addDate', function(req, res, next){

    if (!req.body.dateSeen){
        req.flash('error', 'Please provide a date for your sighting of ' + req.body.name);
        return res.redirect('/');
    }

    // Find bird with given ID, add new date to datesSeen array
    Bird.findById(req.body._id, function(err, bird){
        if (err){
            return next(err);
        }

        // If somehow we reach a page with a bird not in the database
        if (!bird){
            res.statusCode = 404;
            return next(new Error('Not found bird with _id ' + req.body._id))
        }

        // Add new date to datesSeen array
        bird.datesSeen.push(req.body.dateSeen);

        // Sort datesSeen
        bird.datesSeen.sort(function(a, b){
            if (a.getTime() < b.getTime()) {return 1;}
            if (a.getTime() > b.getTime()) {return -1;}
            return 0;
        });

        bird.save(function(err){
            if (err){
                if (err.name == 'ValidationError'){
                    // Loop over error messages, add each to messages array
                    var messages = [];
                    for (var err_name in err.errors){
                        messages.push(err.errors[err_name].message);
                    }
                    req.flash('error', messages);
                    return res.redirect('/')
                }
                return next(err);   // All other errors
            }
            return res.redirect('/');
        })
    });
});

router.post('/delete', function(req, res, next){

   Bird.findById(req.body._id, function(err, bird){

       if (err){
           return next(err);
       }

       if (!bird){
           res.statusCode = 404;
           return next(new Error('Not found bird with _id ' + req.body._id))
       }

       bird.remove({name: req.body.name}, function(err){
           if (err){
               if (err.name == 'ValidationError'){
                   // Loop over error messages, add each to messages array
                   var messages = [];
                   for (var err_name in err.errors){
                       messages.push(err.errors[err_name].message);
                   }
                   req.flash('error', messages);
                   return res.redirect('/')
               }
               return next(err);   // All other errors
           }
           return res.redirect('/');
       })
   })
});

module.exports = router;
