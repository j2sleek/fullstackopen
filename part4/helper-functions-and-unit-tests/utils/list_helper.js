const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const arr = []
    blogs.map( blog => arr.push(blog.likes))
    return arr.reduce((a,c) => a + c, 0)
}

const favoriteBlog = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    const maxLikes = Math.max(...likes)
    
    return blogs[likes.indexOf(maxLikes)]
}

const mostBlogs = (allBlogs) => {
    const maxBlogger = _.chain(allBlogs)
        .countBy('author')
        .toPairs()
        .maxBy(_.last)
        .thru(([author, blogs]) => ({ author, blogs }))
        .value()
    
    return maxBlogger
}

module.exports = { 
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}