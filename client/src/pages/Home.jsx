import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import Create from "./Create"
import FriendListItem from "../components/FriendListItem"

import PostListItem from "../components/PostListItem"
import AI from "../components/AI"
const Home = (props) => {
  const [notif, setNotif]=useState(0);
  const [toggleNotif,setToggleNotif]=useState(false)
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
  const [createbutton,setCreatebutton]= useState(false)
  const currUser = getCookie('userId')
  const [posts, setPosts] = useState([])
  const token = localStorage.getItem('token')
  const [load,setLoad]=useState(false);
  const [user,setUser]=useState("");

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
      axios.get(`http://localhost:8000/api/posts`)
        .then(response => {
          setPosts(response.data.allPosts)
        })
        .catch(error => console.log(error))
    }
  }, [load])
  useEffect(() => {
    async function fetchData(){

      try {
        const response = await axios.get(`http://localhost:8000/api/users/${currUser}/f`,{withCredentials:true})
        const loggedUser = response.data
        console.log("++++++++",loggedUser.requests);
        setUser(response.data)
        setNotif(response.data.requests.length)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
    },[token,toggleNotif,currUser,load])

    const handleAccept = (id,friendId) => {
      axios.put(`http://localhost:8000/api/users/accept/${id}/${friendId}`)
      .then(res=>{
        axios.post("http://localhost:8000/api/conversation",{senderId:res.data.me,receiverId:res.data.friendId})
        .then((response)=>{
          console.log(response)
  
        }).catch(err=>console.log(err))
        console.log(res.data);setLoad(!load)
      })
      .catch(err=> console.log(err))
      
    }

    const handleReject = (id,friendId) => {
      axios.put(`http://localhost:8000/api/users/reject/${id}/${friendId}`)
      .then(res=>{console.log(res.data);setLoad(!load)})
      .catch(err=> console.log(err))
      
    } 

  return (
    <div className='w-100 row text-center'>
      <div className="col-3">
        <div className="ms-3 card-body">
          <AI/>
        </div>
      </div>
      <div className="col-6">
      {createbutton===true? <Create setLoad={setLoad} load={load}/> :<i className="bi bi-plus-circle-fill createbtn" onClick={()=>setCreatebutton(true)}></i>}
      {posts.map(post => <PostListItem post={post} key={post._id} setLoadHome={setLoad} loadHome={load} />)}
      </div>

      <div className="col-3">
      <div className="card">
        <div className="card-header">
          {notif<1?<i className="btn bi bi-bell-fill" onClick={()=>setToggleNotif(!toggleNotif)}></i>:
          <i className="text-danger btn bi bi-bell-fill" onClick={()=>setToggleNotif(!toggleNotif)}>{notif}</i>
          }
        </div>
        {toggleNotif?
        <div className="card-body">
        {user.requests.map(req=><div key={req._id} className="d-flex">
        <img src={req.image} alt="req" className="imageComment"/>
        <p className="text-dark ms-2">{req.firstName} {req.lastName}</p>
        <i className="ms-5 me-2 text-success bi bi-check-circle" onClick={()=>handleAccept(currUser,req._id)}></i>
        <i className="text-danger bi bi-x-circle" onClick={()=>handleReject(currUser,req._id)}></i>
        </div>
        )}
        </div>:<></>
        }
      </div>
      {user && user.friends.map(friend=><FriendListItem friend={friend}/>)}
      </div>
    </div>
  )
}

export default Home