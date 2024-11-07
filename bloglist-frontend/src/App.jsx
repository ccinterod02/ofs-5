import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import axios from 'axios'
import { login } from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState("")
  const [newAuthor, setNewAuthor] = useState("")
  const [newUrl, setNewUrl] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      try {
        setBlogs(await blogService.getAll())
      } catch (error) {
        console.log(`Error obteniendo blogs`);
        setErrorMessage('Error obteniendo los blogs')
      }
    }
    fetchData()
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      console.log(`username ${username}   password ${password}`);
      const user = await login({username, password})
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    
    } catch (error) {
      setErrorMessage('Wrong credentials')
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.setItem('loggedUser', null)
    setUser(null)
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    try {
      console.log(`Creando nuevo blog`);
      const response = await blogService.insert({
        newTitle,
        newAuthor,
        newUrl,
      })
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const loginForm = () => (
    <div>
    <h2>log in to application</h2>
    <form onSubmit={handleLogin}>
      <div>
        username
        <input 
        type='text'
        value={username}
        name="Username"
        onChange={({target}) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input 
        type='password'
        value={password}
        name='Password'
        onChange={({target}) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>
        login
      </button>
    </form>
    </div>
  )

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <div>
        <h2>create new</h2>
        <form onSubmit={handleNewBlog}>
          <div>
            <input 
            type='text'
            value={newTitle}
            onChange={({target}) => setNewTitle(target.value)}
            name='New Title'
            />
          </div>
          <div>
            <input 
            type='text'
            value={newAuthor}
            onChange={({target}) => setNewAuthor(target.value)}
            name='New Author'
            />
          </div>
          <div>
            <input 
            type='text'
            value={newUrl}
            onChange={({target}) => setNewUrl(target.value)}
            name='New Url'
            />
          </div>
          <button type='submit'>create</button>
        </form>
          
      </div>
      <p>{user.username} logged in<button onClick={handleLogout}>logout</button></p>
      {blogs.map(blog => <Blog key={blog.id} blog={blog}/>)}
    </div>
  )

  if (user === null) {
    return loginForm()
  }
  else {
    return blogList()
  }
}

export default App