const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
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
    const result  = await Blog.findByIdAndDelete(id);
    console.error("result", result)
    response.status(204).end();
  } catch (error) {
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
