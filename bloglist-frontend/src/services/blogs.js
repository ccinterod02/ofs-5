import axios from 'axios'
import { jwtDecode } from "jwt-decode"
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('jwt')}`
    }
  })
  return response.data
}

const insert = async (newBlog) => {
  console.log(`insertando -> ${JSON.stringify(newBlog)}`);
  const { id } = jwtDecode.jwtDecode(window.localStorage.getItem('jwt'))

  try {
    const response = axios.post(baseUrl, {
      user: id,
      author: newBlog.newAuthor,
      title: newBlog.newTitle,
      url: newBlog.newUrl
    }, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('jwt')}`
      }
    });

  } catch (error) {
    console.log(`Error -> ${error.message}`);
    return error
  }
}

export default {
  getAll,
  insert
}
