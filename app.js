var express = require('express'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer')
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    app = express();

const PORT = process.env.PORT;

    mongoose.connect("mongodb://localhost/rest_blog");

    app.set("view engine", "ejs");
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({extended: true }));
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));




var blogSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    image: String,
    created:  {
              type: Date, default: Date.now
              }
  });


var Blog = mongoose.model("Blog", blogSchema);

// Blog.create(
//   {
//     title: "Kozhi",
//     body: "This is the common term we use to call Shaheen and Shaheem",
//     image: "https://cdn.pixabay.com/photo/2016/11/23/00/39/animal-1851495_960_720.jpg"
//   })


app.get("/", function (req , res)
{
  res.redirect('/blogs');
});

app.get('/blogs', function(req, res)
{
  Blog.find({}, function(err, blogs)
  {
    if (err)
    {
    console.log(err);
    }
    else
    {
      res.render('index', {blogs: blogs})
    }
  })
});

app.get("/blogs/new", function (req, res)
{
  res.render("new");

});

app.post('/blogs', function(req, res)
{
  Blog.create(req.body.blog, function(err, newBlog)
  {
    if (err)
    {
      res.render("new");
    }
    else
    {
      res.redirect('/blogs');
    }
  })
});

app.get('/blogs/:id', function(req, res)
{
  Blog.findById(req.params.id, function(err, foundBlog)
  {
    if (err)
    {
      res.redirect('/blogs');
    }
    else
    {
      res.render("show", {blog: foundBlog});

    }
  })
});


app.get("/blogs/:id/edit", function(req, res)
{
  Blog.findById(req.params.id, function(err, foundBlog)
  {
    if (err)
    {
      res.redirect('/blogs');
    }
    else
    {
      res.render("edit", {blog: foundBlog});

    }
  })
});

app.put("/blogs/:id", function(req, res)
{
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, UpdatedBlog)
  {
    if (err)
    {
      res.redirect('/blogs');
    }
    else
    {
      res.redirect("/blogs/" + req.params.id );

    }
  })
});

app.delete("/blogs/:id", function(req, res)
{
  Blog.findByIdAndRemove(req.params.id, function(err, UpdatedBlog)
  {
    if (err)
    {
      res.redirect('/blogs');
    }
    else
    {
      res.redirect("/blogs/");

    }
  })
})

app.listen(PORT, function(err)
{
  if (err)
  {
  console.log(err);
  }
  else
  {
      console.log("App listening on port 3000");
  }
})
