
const passport = require('passport');
const bodyParser  = require('body-parser');
const bcrypt = require('bcrypt')


module.exports = function (app, db) {

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*******************Middleware********************/

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
};

const authStratMid = passport.authenticate('local',{ failureRedirect: '/' })

/********************Routes***********************/
app.route('/')
    .get((req, res) => {
        res.render(process.cwd() + '/views/pug/index.pug', {showRegistration: true, showLogin: true, title: 'Hello', message: 'Please login'});
    });

app.post('/login',
    authStratMid, 
    function(req,res){
            res.redirect('/profile')
    })

app.get('/profile',
    ensureAuthenticated,
    function(req,res){
        res.render(process.cwd() + '/views/pug/profile.pug', {username: req.user.username});
    });

app.post('/register',(req, res, next) => {
    db.collection('users').findOne({ username: req.body.username }, function (err, user) {
        if(err) {
            next(err);
        } else if (user) {
            res.redirect('/');
        } else {
                var hash = bcrypt.hashSync(req.body.password, 12);
                        db.collection('users').insertOne(
                            {username: req.body.username,
                            password: hash},
                            (err, doc) => {
                                if(err) {
                                    res.redirect('/');
                                } else {
                                    next(null, user);
                                }
                            }
                        )
                    }
                })},
            authStratMid,
                (req, res) => {
                    res.redirect('/profile');
                }
            );

app.get('/logout',function(req,res){
    eq.logout();
    res.redirect('/');
})

app.use((req, res, next) => { //va ultimo para que en el caso de no encontrar ruta tirar este por default
        res.status(404)
        .type('text')
        .send('Not Found');
    }); 

app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port " + process.env.PORT);
});

}