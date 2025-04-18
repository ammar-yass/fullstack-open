const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'First Blog',
        author: 'John Doe',
        url: 'http://example.com/first',
        likes: 5
    },
    {
        title: 'Second Blog',
        author: 'Jane Doe',
        url: 'http://example.com/second',
        likes: 10
    }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: "Temporary Blog",
    author: "Temp Author",
    url: "http://example.com/temp",
    likes: 0,
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
}; 

const blogsInDb = async () =>  (await Blog.find({})).map(b => b.toJSON())


module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}