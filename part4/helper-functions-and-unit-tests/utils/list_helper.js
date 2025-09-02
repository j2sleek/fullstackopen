const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const arr = []
    blogs.map( blog => arr.push(blog.likes))
    return arr.reduce((a,c) => a + c, 0)
}

const favoriteBlog = (blogs) => {
    return Math.max(...blogs.map(blog => blog.likes))
}

module.exports = { 
    dummy,
    totalLikes,
    favoriteBlog
}