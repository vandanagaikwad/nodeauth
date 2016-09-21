var express = require('express');
	router = express.Router();
	mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

/*Create user*/
router.post('/createUser', function(req, res) {
	var testUser = new User(req.body);
	console.log('-------------------');
	console.log(req.body);
	// Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var username = req.body.username;
	var password = req.body.password;
	//call the create function for our database
	testUser.save({
	    firstname : firstname,
	    lastname : lastname,
	    username : username,
	    password : password
	}, function (err, user) {
      if (err) {
      	console.log(err);
          res.send("There was a problem adding the information to the database.");
      } else {
          console.log('POST creating new user: ' + user);
          res.status(200).json({'message':'Successfully created user in databese'});
          res.end();
      }
	})
})


/* GET Users. */
router.get('/getUsers', function(req, res, next) {
	console.log('-------- users get ---------');

 	User.find({}, function (err, users) {
	      if (err) {
	          return console.error(err);
	      } else {
	      	console.log(users);
	          //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
	        // res.status(200).json({ myData: users });
            res.send(users);
	          
	      }     
	});

});

/* verify User Login. */
router.put('/login', function(req, res, next) {
	console.log('-------- users post ---------');
  if((Object.keys(req.body.usernm).length && Object.keys( req.body.pass).length) > 0){

    User.findOne({ username: req.body.usernm }, function(err, user) {
        if (err){res.status(500).json({'error':err}); res.end();}

        // test a matching password
        if(user !== null){
          user.comparePassword(req.body.pass, function(err, isMatch) {
              if (err){res.status(500).json({'error':err}); res.end();} 

              if(isMatch){
                console.log('Password123:', isMatch);
                res.status(200).json({'message':'Successfully logged In'});
                res.end();
              } else {
                res.status(401).json({'error':'Authentication failed, please try again'});
                res.end();
              }
              
          });
        }else {
          res.status(401).json({'error':'Please provide the valid username and try again..!'});
          res.end();
        }
        
    });

  } else {
    res.status(400).json({'error':'Please provide the valid params..!'});
    res.end();
  }

});

module.exports = router;