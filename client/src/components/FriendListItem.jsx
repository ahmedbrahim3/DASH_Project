import React from 'react'
import { useNavigate } from 'react-router-dom'

const FriendListItem = ({friend}) => {
    const navigate = useNavigate();
  return (
    <div key={friend._id} className="card-header btn d-flex align-items-center text-light" onClick={()=>{navigate(`/profile/${friend._id}`)}}>
    <div ><img src={friend.image} alt="" width={50} className="image"/></div>
    <div>
        <span className="logged-in me-2">●</span>
        <p className='onlineName d-inline'>{friend.firstName} {friend.lastName}</p>
    </div>
</div>
  )
}

export default FriendListItem
