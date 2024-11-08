import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import { login } from './services/login'
import { jwtDecode } from "jwt-decode";
import './styles.css'
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglabe';

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState("")
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      try {
        setBlogs(await blogService.getAll())
      } catch (error) {
        handleNewErrorMessage('Error obteniendo los blogs')
      }
    }
    fetchData()
  }, [user])

  useEffect(() => {
    try {
      const {username, id} = jwtDecode(window.localStorage.getItem('jwt'))
      console.log(`username -> ${username}   id -> ${id}`);
      if (username && id) {
        setUser({username, id})
      }
    } catch (error) {
      
    }
  }, [])

const handleLogin = async (event) => {
  event.preventDefault();
  try {
    const { token } = await login({ username, password });
    window.localStorage.setItem('jwt', token);
    const { username: decodedUsername, id } = jwtDecode(token);
    setUser({ username: decodedUsername, id });
    handleNewSuccessMessage(`${username} logged correctly`)
    setUsername('');
    setPassword('');
  } catch (error) {
    handleNewErrorMessage('Wrong credentials');
  }
};

  const handleLogout = async (event) => {
    window.localStorage.removeItem('jwt');
    setUser(null)
  }

  const handleNewErrorMessage = (message) => {
    setErrorMessage(message)
    
    setTimeout(() => {
      setErrorMessage('')}, 3000)
    }

  const handleNewSuccessMessage = (message) => {
    setSuccessMessage(message)
    
    setTimeout(() => {
      setSuccessMessage('')}, 3000)
    }


  const handleNewBlog = async (newBlog) => {
    console.log(newBlog)
    try {
      console.log(`Creando nuevo blog`);
      const response = await blogService.insert(newBlog)
      setBlogs(blogs.concat(response.data))
      handleNewSuccessMessage(`a new blog ${response.data.title} by ${response.data.author} added`)
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      handleNewErrorMessage(error.message)
    }
  }

  const handleDeleteBlog = async (blog) => {
    try {
      const response = await blogService.remove(blog.id)
      handleNewSuccessMessage(`blog ${blog.title} by ${blog.author} removed correctly`)
    } catch (error) {
      handleNewErrorMessage(error.message)
    }
  }

  const loginForm = () => (
    <div>
    <h2>log in to application</h2>
    {errorMessage && (<div className='error-card'>{errorMessage}</div>)}
    {successMessage && (<div className='success-card'>{successMessage}</div>)}
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
      {errorMessage && (<div className='error-card'>
        {errorMessage}
      </div>)}
      {successMessage && (<div className='success-card'>
        {successMessage}
      </div>)}
      <p>{user.username} logged in<button onClick={handleLogout}>logout</button></p>
      {blogs.sort((a,b) => b.likes - a.likes).map(blog => (
      <div>
        <Blog key={blog.id} blog={blog}/>
      </div>
      
      ))}
      <Togglable buttonLabel='new Blog' ref={blogFormRef}>
        <h2>create new</h2>
        <BlogForm createBlog={handleNewBlog}/>
      </Togglable>
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