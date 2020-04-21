/// REQUIRE NPM MODULES
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

/// SET UP EXPRESS
const app = express();

/// SET UP TEMPLATE EJS
app.set('view engine', "ejs");

/// SET UP BODY PARSER
app.use(bodyParser.urlencoded({extended:true}));

/// SET UP EXPRESS PUCLIC (CSS, IMAGES)
app.use(express.static("public"));

/// SET UP MONGODB
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true});

/// CREATE NEW MONGOOSE SCHEMA
const articleSchema = new mongoose.Schema({
    title : String,
    content : String
});

/// CREATE NEW MONGOOSE MODEL
const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////////////////

/// REQUEST ALL ARTICLES ///

app.route("/articles")

.get(function(req,res){

        Article.find(function(err, foundArticles){
            if(!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });

    })

.post(function(req,res){

    const newArticle = new Article({
        title : req.body.title,
        content : req.body.content
    });

    newArticle.save(function(err){
        if (!err){
            res.send("Successfully added new article");
        } else {
            res.send(err);
        }
    });

})

.delete(function(req,res){

    Article.deleteMany(function(err){
        if (!err){
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        };
    });

});

/// REQUEST A SPECIFIC ARTICLE ///

app.route("/articles/:articleTitle")

.get(function(req,res){

    Article.findOne({title : req.params.articleTitle },function(err,foundArticle){
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found")
        };
    });

})

.put(function(req,res){

    Article.update(
        {title : req.params.articleTitle }, 
        {title : req.body.title, content : req.body.content}, 
        {overwrite: true}, 
        function(err){
            if (!err){
                res.send("Successfully udpated article.")
            } else {
                res.send(err);
            }
        }
    );

})

.patch(function(req,res){

    Article.update(
        { title : req.params.articleTitle },
        { $set: req.body },
        function(err){
            if (!err){
                res.send("Successfully udpated article.")
            } else {
                res.send(err);
            }
        }
    )

})

.delete(function(req,res){

    Article.deleteOne({title:req.params.articleTitle}, function(err){
        if(!err){
            res.send("Succesfully deleted the corresponding article.")
        } else {
            res.send(err);
        }
    });

});

///////////////////////////////////////////////

/// SET UP SERVER
app.listen(3000,()=>{
    console.log("Server started on port 3000")
});
