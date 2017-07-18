var express = require('express');
var app = express();
var mysql = require('promise-mysql');
var bodyParser = require('body-parser')

var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'mattszabo', 
    password : '',
    database: 'reddit',
    connectionLimit: 10
});

// load our API and pass it the connection
var RedditAPI = require('./reddit');
var myReddit = new RedditAPI(connection);



// app.get('/', function (req, res) {
//   res.send('<h1>Hello World1!</h1>');
 
// });

// app.get('/hello', function(req, res) {
  
//   if (req.query.name == null){
//     res.send('<h1>Hello</h1>' );
//   }
  
//   res.send('<h1>Hello ' + req.query.name + ' ' + req.query.lastname + '</h1>' );
// });


// app.get('/calculator/:operation',function(req,res){
  
//      if (req.query.num1 == null){
//           var a = 0;
//          }
//          else{
//           var a = parseInt(req.query.num1);
//          }
         
//           if (req.query.num2 == null){
//           var b = 0;
//          }
//          else{
//           var b = parseInt(req.query.num2);
//          }
  
  
//   if (req.params.operation == 'add'){
        
//             var solution = {
//                     operation: "add",
//                     firstOperand: a,
//                     secondOperand: b,
//                     solution: a+b
//             }
//   }
    
//     else if (req.params.operation == 'multiply'){
    
//             var solution = {
              
//                     operation: "multiply",
//                     firstOperand: a,
//                     secondOperand: b,
//                     solution: a*b
//             }
          
//       }
      
//       else
    
//     { 
//         res.status(400).send('Something broke!');
//     }
    
//   res.send(JSON.stringify(solution));

// })

app.get('/new-post', function(req, res) {

var formstring = "<form action=\"\/createPost\" method=\"post\"><p><input type=\"text\" name=\"url\" placeholder=\"Enter a URL to content\"\/><\/p><p><input type=\"text\" name=\"title\" placeholder=\"Enter the title of your content\"\/><\/p><button type=\"submit\">Create!<\/button><\/form>";


res.send(formstring);


});


var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.post('/createPost', urlencodedParser, function(req, res) {
    
if (!req.body) return res.sendStatus(400)

myReddit.createPost({
            title: req.body.title,
            url: req.body.url,
            userId: 1,
            subredditId: 14
        });

res.redirect('http://redditnodejs-mattszabo.c9users.io/posts');
})




app.get('/posts', function(req, res) {
 
  myReddit.getAllPosts().then(function(data){
      
    var string1 = "<!DOCTYPE html> <html> <head><title>Lots of Posts are supposed to be here</title></head> <body><div id=posts> <h1>List of posts</h1> <ul class=posts-list>";
    var string2 = "</ul></div></body></html>";
        
    data.forEach(post => {
        
    string1 =  string1 + "<li class=post-item> <h2 class=" + post.id +"> <a href=" + post.url + ">" + post.title + "</a> "+ " </h2> <p> Created by " + post.userId + "</p> </li>" ;
    });
   
  res.send(string1+string2);
      });
      
})



/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening at http://%s', process.env.C9_HOSTNAME);
});
