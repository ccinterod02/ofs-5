import { useState } from 'react'
import blogs from '../services/blogs'

const Blog = ({ blog }) => {
    const { title, author, url, likes, user } = blog
    console.log({ title, author, url, likes, user })
    const [expanded, setExpanded] = useState(false)
    const style = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const toggleExpanded = () => {
        setExpanded(!expanded)
    }

    return (
        <div style={style}>
            <p>{blog.title} {blog.author}<button onClick={toggleExpanded}>{expanded ? 'hide':'show' }</button></p>
            {expanded && (
                <>
                    <p>url {blog.url}</p>
                    <p>likes {blog.likes}<button onClick={() => blogs.addLike(blog)}>like</button></p>
                    {blog.user && blog.user.name && (
                        <p>name {blog.user.name}</p>
                    )}
                    <button onClick={() => {
                        confirm(`Do you really want to remove [ ${blog.title} ]`)
                        blogs.remove(blog.id)
                    }}>delete</button>
                </>
            )}
        </div>
    )
}


export default Blog