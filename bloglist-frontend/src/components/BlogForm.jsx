import { useState } from "react"

const BlogForm = (props) => {

    const [newAuthor, setNewAuthor] = useState('')
    const [newTitle, setNewTitle] = useState('')
    const [newUrl, setNewUrl] = useState('')

    const addBlog = (e) => {
        e.preventDefault()
        props.createBlog({
            author: newAuthor,
            title: newTitle,
            url: newUrl
        })
    }

    return (
        <div>
            <h2>Create a new blog entrance</h2>
            <form onSubmit={addBlog}>
                <p>Author<input value={newAuthor} onChange={event => setNewAuthor(event.target.value)}/></p>
                <p>Title<input value={newTitle} onChange={event => setNewTitle(event.target.value)}/></p>
                <p>Url<input value={newUrl} onChange={event => setNewUrl(event.target.value)}/></p>
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default BlogForm