import axios from 'axios'
import { jwtDecode } from "jwt-decode"
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('jwt')}`
    }
  })
  console.log(response.data)
  return response.data
}

const insert = async (newBlog) => {

  try {
    const { id } = jwtDecode(window.localStorage.getItem('jwt'))
    console.log(`insertando -> ${JSON.stringify({ ...newBlog, id })}`);
    const response = await axios.post(baseUrl, {
      user: id,
      author: newBlog.author,
      title: newBlog.title,
      url: newBlog.url
    }, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('jwt')}`
      }
    });
    return response
  } catch (error) {
    console.log(`Error -> ${error.message}`);
    return error
  }
}

const remove = async (id) => {
  console.log(`Borrando el blog con id ${id}`);
  try {
    return await axios.delete(`${baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('jwt')}`
      }
    })

  } catch (error) {
    console.log(`Error -> ${error.message}`);
  }
}

const addLike = async (blog) => {
  try {
    console.log(blog);
    const response = await axios.put(`${baseUrl}/${blog.id}`, {
      author: blog.author,
      title: blog.title,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    })
  } catch (error) {
    console.log(`Error -> ${error.message}`);
  }
}

export default {
  getAll,
  insert,
  remove,
  addLike
}
