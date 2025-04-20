const { test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);
const helper = require("./test_helper");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')

let token;
beforeEach(async () => {
  await User.deleteMany({});
  const newUser = new User({
    username: "Ammar",
    name: "Ammar User",
    passwordHash:  await bcrypt.hash("sekret", 12),
  });
  
  const savedUser = await newUser.save();

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  };
  token = jwt.sign(userForToken, process.env.SECRET);
  await Blog.deleteMany({});
  helper.initialBlogs = helper.initialBlogs.map(blog => ({
    ...blog,
    user: savedUser._id,
  }));
  await Blog.insertMany(helper.initialBlogs);
});

test("fetch all blogs", async () => {
  const response = await api
    .get("/api/blogs")
    .set(
      "authorization",
      `Bearer ${token}`
    )
    .expect(200)
    .expect("Content-Type", /application\/json/);
  assert.strictEqual(response.body.length, 2);
});

test("unique identifier property of blog posts is named id", async () => {
  const response = await api
    .get("/api/blogs")
    .set(
      "authorization",
      `Bearer ${token}`
    )
    .expect(200)
    .expect("Content-Type", /application\/json/);

  response.body.forEach((blog) => {
    assert.ok(blog.id);
    assert.strictEqual(blog._id, undefined);
  });
});

test("creating a new blog post increases the total number of blogs by one", async () => {
  const newBlog = {
    title: "New Blog Post",
    author: "Test Author",
    url: "http://example.com/new-blog",
    likes: 5,
  };

  const initialBlogs = await helper.blogsInDb();

  await api
    .post("/api/blogs")
    .set(
      "authorization",
      `Bearer ${token}`
    )
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAfterPost = await helper.blogsInDb();
  assert.strictEqual(blogsAfterPost.length, initialBlogs.length + 1);

  const titles = blogsAfterPost.map((blog) => blog.title);
  assert(titles.includes(newBlog.title));
});

test("if likes property is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "Blog Without Likes",
    author: "Test Author",
    url: "http://example.com/no-likes",
  };

  const response = await api
    .post("/api/blogs")
    .set(
      "authorization",
      `Bearer ${token}`
    )
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test("fails with status code 400 if title is missing", async () => {
  const newBlog = {
    author: "Test Author",
    url: "http://example.com/no-title",
    likes: 5,
  };

  const initialBlogs = await helper.blogsInDb();

  await api
    .post("/api/blogs")
    .set(
      "authorization",
      `Bearer ${token}`
    )
    .send(newBlog)
    .expect(400);

  const blogsAfterPost = await helper.blogsInDb();
  assert.strictEqual(blogsAfterPost.length, initialBlogs.length);
});

test("fails with status code 400 if url is missing", async () => {
  const newBlog = {
    title: "Blog Without URL",
    author: "Test Author",
    likes: 5,
  };

  const initialBlogs = await helper.blogsInDb();

  await api
    .post("/api/blogs")
    .set(
      "authorization",
      `Bearer ${token}`
    )
    .send(newBlog)
    .expect(400);

  const blogsAfterPost = await helper.blogsInDb();
  assert.strictEqual(blogsAfterPost.length, initialBlogs.length);
});

test("updating a blog post updates its information", async () => {
  const initialBlogs = await helper.blogsInDb();
  const blogToUpdate = initialBlogs[0];

  const updatedBlogData = {
    title: "Updated Blog Title",
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 1,
  };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set(
      "authorization",
      `Bearer ${token}`
    )
    .send(updatedBlogData)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.title, updatedBlogData.title);
  assert.strictEqual(response.body.likes, updatedBlogData.likes);

  const blogsAfterUpdate = await helper.blogsInDb();
  const updatedBlog = blogsAfterUpdate.find(
    (blog) => blog.id === blogToUpdate.id
  );
  assert.strictEqual(updatedBlog.title, updatedBlogData.title);
  assert.strictEqual(updatedBlog.likes, updatedBlogData.likes);
});

test("updating a blog post with an invalid id returns 404", async () => {
  const invalidId = "123456789012345678901234"; // Valid format but non-existent ID
  const updatedBlogData = {
    title: "Non-existent Blog",
    author: "Test Author",
    url: "http://example.com/non-existent",
    likes: 10,
  };

  await api
    .put(`/api/blogs/${invalidId}`)
    .set(
      "authorization",
      `Bearer ${token}`
    )
    .send(updatedBlogData)
    .expect(404);
});

test("deleting a blog post removes it from the database", async () => {
  const initialBlogs = await helper.blogsInDb();
  const blogToDelete = initialBlogs[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set(
      "authorization", 
      `Bearer ${token}`
    )
    .expect(204);

  const blogsAfterDelete = await helper.blogsInDb();
  assert.strictEqual(blogsAfterDelete.length, initialBlogs.length - 1);

  const deletedBlog = blogsAfterDelete.find(
    (blog) => blog.id === blogToDelete.id
  );
  assert.strictEqual(deletedBlog, undefined);
});

after(async () => {
  await mongoose.connection.close();
});
