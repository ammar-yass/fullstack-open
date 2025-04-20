const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const { error } = require("../utils/logger");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1});
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const user = request.user 
  if(!user) {
    return response.status(401).json({error: 'unauthorized to post a blog please login'})
  }
  const blog = new Blog(request.body);
  blog.user = user.id;
  if (!blog.title || !blog.url)
    return response.status(400).send({ error: "title or url is missing" });
  if (!blog.likes) blog.likes = 0;
  const result = await blog.save();
  response.status(201).json(result);
});

blogRouter.delete("/:id", async (request, response) => {
  try {
    const id = request.params.id;
    console.log("id",id)
    const result  = await Blog.findById(id);
    console.log('result', result)
    if(result.user.toString() !== request.user.id) { 
      return response.status(401).json({ error: 'unauthorized to delete this blog'})
    }
    await Blog.findByIdAndDelete(id);
    response.status(204).end();
  } catch (error) {
    console.log(error)
    response.status(400).send({ error: "malformatted id" });
  }
});

blogRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;

  const updatedBlog = {
    title,
    author,
    url,
    likes,
  };
  console.error('updatedBlog', updatedBlog)

  try {
    const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {new: true});
    console.error('result', result)
    if (result) {
      response.json(result);
    } else {
      response.status(404).send({ error: "blog not found" });
    }
  } catch (error) {
    response.status(400).send({ error: "malformatted id or validation error" });
  }
});

module.exports = blogRouter;
