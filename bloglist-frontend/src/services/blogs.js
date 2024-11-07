import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl, {
    headers: {
      Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('loggedUser')).token}`
    }
  })
  return response.data
}

const insert = async (newBlog) => {
  console.log(`insertando -> ${newBlog}`);
  try {
    const response = axios.post(baseUrl, {}, {
      headers: {
        Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('loggedUser')).token}`
      }
    });
  } catch (error) {
    return error
  }
}

export default {
  getAll,
  insert
}
