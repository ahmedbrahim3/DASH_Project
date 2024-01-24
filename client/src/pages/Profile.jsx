import { useState, useEffect, Children } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios'

import PostListItem from "../components/PostListItem"
import ProfileModal from "../components/ProfileModal"
import AddButton from "../components/AddButton"
import CancelReq from "../components/CancelReq"
const Profile = (props) => {
  const [load, setLoad]=useState(false);
  const [openModal, setOpenModal]= useState(false);
  const [user,setUser]= useState({requests:[]});
  const [loguser,setLoguser]= useState({friends:[]});
  const navigate = useNavigate();
  function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;}
  const { id } = useParams();
  const currUser = getCookie('userId')
  const [posts, setPosts] = useState([])
  const token = localStorage.getItem('token')

  const deletePost = (postId) => {
    axios.delete('http://localhost:8000/api/posts/'+postId)
      .then(response => {
        console.log(response.data)
        const filteredPosts = posts.filter(post => post._id != postId);
        setPosts(filteredPosts)
      })
      .catch(error => console.log(error))
  }

  useEffect(() => {
    if (!token) {
      navigate('/')
    } else {
      axios.get(`http://localhost:8000/api/profilePosts/${id}`)
        .then(response => {
          setPosts(response.data)
          console.log(posts)
        })
        .catch(error => console.log(error))
    }
  }, [id])

  useEffect(() => {
    if (!token) {
      navigate('/')
    } else {
      axios.get(`http://localhost:8000/api/users/${id}`,{withCredentials:true})
        .then(response => {
          setUser(response.data)
          console.log(user)
        })
        .catch(error => console.log(error))
    }
  }, [id,load])

  useEffect(() => {
    if (!token) {
      navigate('/')
    } else {
      axios.get(`http://localhost:8000/api/users/${currUser}`,{withCredentials:true})
        .then(response => {
          setLoguser(response.data)
          console.log(user)
        })
        .catch(error => console.log(error))
    }
  }, [currUser,load])

  const handleRemove=()=>{
    axios.put(`http://localhost:8000/api/users/${currUser}/${user._id}`)
    .then (res=>{console.log(res);setLoad(!load)})
    .catch(err=>console.log(err))
  }


  return (
    <div className='container'>
        <div className="card cardbg text-center post mb-3 ">
          <div className="card-header d-flex align-items-center ">
              <div ><img src={user.image} alt="" width={50} className="imageProfile"/></div>
              <div className='ms-4'>
                  <h6 className=" display-4">{user.firstName} {user.lastName}</h6>
                  <h6 className="text-start">{user.bio}</h6>
              </div>
              {currUser == id?
              <i className="btn bi bi-gear-fill" onClick={()=>setOpenModal(true)}></i>:
              loguser.friends.includes(id)?<div><i className="btn pb-3 ms-2 nav-icon2 fs-3 bi bi-chat-square-dots-fill"></i><i className="btn pe-3 pb-3 text-danger nav-icon2 bi bi-person-dash" onClick={handleRemove}></i></div>: 
              <AddButton id={currUser} friendId={id} setLoad={setLoad} load={load} loguser={loguser} user={user}/>
              }
          </div>
        </div>
        {openModal? <ProfileModal id={id} closeModal={setOpenModal}/>:
      posts.map(post => <PostListItem post={post} key={post._id} setLoadHome={setLoad} loadHome={load} />)
    }
    </div>
  )
}

export default Profile