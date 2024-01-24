import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import postStyle from '../components/PostListItem.module.css'

const OnePost = () => {
  const [post, setPost] = useState({ title: '', content: '', isImportant: false })
  const {id} = useParams()
  useEffect(() => {
    axios.get('http://localhost:8000/api/posts/'+id)
      .then(response => {
        // console.log('Response.data : ',response.data)
        setPost(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [id])
  return (
    <div className={postStyle.post}>
      <h1 className='display-4 fst-italic'>{post.isImportant && "📌"} {post.title}</h1>
      <p>{post.content}</p>
      <div className='d-flex justify-content-between'>
        <p>{post.createdAt}</p>
      </div>
    </div>
  )
}

export default OnePost