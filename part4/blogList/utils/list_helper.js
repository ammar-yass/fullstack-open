const _ = require('lodash');

require('lodash')

const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => { 
    return _.sumBy(blogs, 'likes');
}

const favoriteBlog = (blogs) => { 
    return _.maxBy(blogs, 'likes')
}

const mostBlogs = (blogs) => { 
    const blogsByAuthor = _.groupBy(blogs, 'author')
    const authorWithMostBlogs = _.maxBy(Object.entries(blogsByAuthor), ([author, blogs]) => blogs.length);
    return { author:authorWithMostBlogs[0], blogs: authorWithMostBlogs[1].length }
}

const mostLikes = (blogs) => {
    const likesByAuthor = _.reduce(blogs, (result, blog) => {
        result[blog.author] = (result[blog.author] || 0) + blog.likes;
        return result;
    }, {});
    const authorWithMostLikes = _.maxBy(Object.entries(likesByAuthor), ([author, likes]) => likes);
    return { author: authorWithMostLikes[0], likes: authorWithMostLikes[1] };
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,

};