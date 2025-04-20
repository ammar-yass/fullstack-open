const Blog = require('../models/blog')
const User = require('../models/user')

let initialBlogs = [
    {
        title: 'First Blog',
        author: 'John Doe',
        url: 'http://example.com/first',
        likes: 5,
        user: '68040a129240b456fc392b3b'
    },
    {
        title: 'Second Blog',
        author: 'Jane Doe',
        url: 'http://example.com/second',
        likes: 10,
        user: '68040a129240b456fc392b3b'
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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}