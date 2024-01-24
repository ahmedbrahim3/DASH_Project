import axios from 'axios'
import React from 'react'

const AddButton = ({id,friendId, setLoad, load, user, loguser}) => {
const handleReq = () => {
    axios.put(`http://localhost:8000/api/users/send/${id}/${friendId}`)
    .then (res=> console.log(res))
    .catch(err=> console.log(err))
    setLoad(!load)

}
const handleCancel = () => {
    axios.put(`http://localhost:8000/api/users/cancel/${id}/${friendId}`)
    .then (res=> console.log(res))
    .catch(err=> console.log(err))
    setLoad(!load)
}

  return (
    <div>{user.requests.includes(loguser._id)?<i className="btn pb-3 ms-2 text-danger fs-3 bi bi-person-x" onClick={()=>handleCancel(id,friendId)}></i>:

        <i className="btn pb-3 ms-2 nav-icon2 fs-3 bi bi-person-fill-add" onClick={()=>handleReq(id,friendId)}> </i>}
    </div>

  )
}

export default AddButton
