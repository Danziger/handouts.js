var express = require('express');
var router = express.Router();
var path = require('path');

var handoutsController = require('../controllers/handouts.js');
var credentialsController = require('../controllers/credentials.js');





// PARAMS: /////////////////////////////////////////////////////////////////////

router.param('handoutID', handoutsController.load);


// AUTHENTICATION: /////////////////////////////////////////////////////////////

router.use(credentialsController.authenticate);

// GET /login

router.get('/login', credentialsController.login);

// GET /logout

router.get('/logout', credentialsController.logout);





// HANDOUTS (PUBLIC): //////////////////////////////////////////////////////////

// GET /
router.get('/', handoutsController.index);

// GET /open
router.get('/open', handoutsController.open);

// GET /closed
router.get('/closed', handoutsController.closed);

// POST /

router.post('/handout/:handoutID', handoutsController.handout);





// HANDOUTS (PRIVIATE): ////////////////////////////////////////////////////////

router.get('/new', credentialsController.loginRequired, handoutsController.new);

router.get('/handout/:id', credentialsController.loginRequired, handoutsController.get);

router.put('/handout/:id', credentialsController.loginRequired, handoutsController.update);

router.delete('/handout/:id', credentialsController.loginRequired, handoutsController.delete);

//router.post('/handout', credentialsController.loginRequired, handoutsController.create);





// DOWNLOADS: //////////////////////////////////////////////////////////////////

// GET /download/:id

router.get('/download/:id', credentialsController.loginRequired, handoutsController.download);







/*

// SESSION: ////////////////////////////////////////////////////////////////////

// GET /login
router.get('/login',			sessionController.renderLogin);

// POST /login
router.post('/login',			sessionController.login);

// GET /logout (should be POST -> DELETE /login)
router.get('/logout',			sessionController.logout);





// AUTOLOAD STUFF: /////////////////////////////////////////////////////////////
router.param('quizId',			quizController.load);
router.param('commentId',		commentController.load);
router.param('category',		quizController.validate);





// QUESTION CREATION: //////////////////////////////////////////////////////////

// GET /quizes/create
router.get('/quizes/create',					sessionController.loginRequired,	quizController.renderCreate);

// POST /quizes/create
router.post('/quizes/create',					sessionController.loginRequired,	quizController.create);

// QUESTION EDITION: ///////////////////////////////////////////////////////////

// GET /quizes/:quizId(\\d+)/edit
router.get('/quizes/:quizId(\\d+)/edit',		sessionController.loginRequired,	quizController.edit);

// POST -> PUT /quizes/:quizId(\\d+)
router.put('/quizes/:quizId(\\d+)',				sessionController.loginRequired,	quizController.update);

// QUESTION DELETION: //////////////////////////////////////////////////////////

// POST -> DELETE /quizes/:quizId(\\d+)
router.delete('/quizes/:quizId(\\d+)',			sessionController.loginRequired,	quizController.delete);





// STATISTICS: /////////////////////////////////////////////////////////////////

router.get('/quizes/statistics',				sessionController.loginRequired,	quizController.statistics);





// PLAYING WITH QUESTIONS (APP ITSELF): ////////////////////////////////////////

router.get('/quizes',							quizController.index);
router.get('/quizes/:quizId(\\d+)',				quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',		quizController.answer);
router.get('/quizes/:category',					quizController.index);





// COMMENTS: ///////////////////////////////////////////////////////////////////

router.post('/quizes/:quizId(\\d+)/comments',					commentController.add);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)',	sessionController.loginRequired,	commentController.publish);





// MISC. ///////////////////////////////////////////////////////////////////////
// TO-DO: Move to misc_controler

// GET /author
router.get('/author', function(req, res, next) {
  res.render('author', { title: 'Quiz', author: 'Dani Gámez Franco'});
});

*/



// EXPORTS: ////////////////////////////////////////////////////////////////////

module.exports = router;