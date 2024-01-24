import { Link, useNavigate } from 'react-router-dom'
import postStyle from './PostListItem.module.css'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PostListItem = ({post, setLoadHome, loadHome}) => {
    const createdAtDate = new Date(post.createdAt);
    const day = createdAtDate.getDate();
    const month = createdAtDate.toLocaleString('default', { month: 'long' });
    const year = createdAtDate.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;
    

    const [commentInputs, setCommentInputs] = useState({});
    const [commentVisibility, setCommentVisibility] = useState({});
    const [load,setLoad] = useState(false);
    const [comments, setComments] = useState("");
    const [likes, setLikes] = useState("");

    useEffect(() => {
        async function fetchData(){
    
          try {
            const response = await axios.get(`http://localhost:8000/api/comments/post/${post._id}`,{withCredentials:true})
            setComments(response.data)
            console.log("Post comments :",comments.length);
          } catch (error) {
            console.log(error)
          }
        }
        fetchData();
        },[load])

    useEffect(() => {
        async function fetchPostLikes(){
    
          try {
            const response = await axios.get(`http://localhost:8000/api/posts/${post._id}`,{withCredentials:true})
            setLikes(response.data.likes)
            console.log("Post Lieks :",likes.length);
          } catch (error) {
            console.log(error)
          }
        }
        fetchPostLikes();
        },[load])

        const handleLikePost = async (postId) => {
            try {
            await axios.put(`http://localhost:8000/api/posts/like/${userId}/${postId}`);
            load? setLoad(false):setLoad(true)
            } catch (error) {
            console.error(`Error liking post ${postId}:`, error);
            }
        };

        const handleDisLikePost = async (postId) => {
            try {
            await axios.put(`http://localhost:8000/api/posts/dislike/${userId}/${postId}`);
            load? setLoad(!load):setLoad(!load)
            } catch (error) {
            console.error(`Error liking post ${postId}:`, error);
            }
        };
        
        const handleLikeComment = async (postId, commentId) => {
            try {
            await axios.put(`http://localhost:8000/api/comments/like/${userId}/${commentId}`);
            load? setLoad(!load):setLoad(!load)
            } catch (error) {
            console.error(`Error liking comment ${commentId}:`, error);
            }
        };
        
        const handleDisLikeComment = async (postId, commentId) => {
            try {
            await axios.put(`http://localhost:8000/api/comments/dislike/${userId}/${commentId}`);
            load? setLoad(!load):setLoad(!load)
            } catch (error) {
            console.error(`Error liking comment ${commentId}:`, error);
            }
        };
        
        const handleAddComment = async (postId) => {
            try {
            const response = await axios.post(`http://localhost:8000/api/comments/${userId}/${postId}`, {
                content: commentInputs[postId] || "",
            });
            load? setLoad(false):setLoad(true)
            console.log(load)
            setCommentInputs({})
            const newCommentData = response.data;
        
            setPosts((prevPosts) =>
                prevPosts.map((post) => {
                if (post._id === postId) {
                    return {
                    ...post,
                    comments: [...(post.comments || []), newCommentData],
                    };
                }
                return post;
                })
            );
        
            setCommentInputs((prevInputs) => {
                const newInputs = { ...prevInputs };
                delete newInputs[postId];
                return newInputs;
            });
            } catch (error) {
            console.error(`Error adding comment to post ${postId}:`, error);
            }
        };
        
        const handleCommentInputChange = (postId, value) => {
            setCommentInputs((prevInputs) => ({
            ...prevInputs,
            [postId]: value,
            }));
        };
        
        const toggleCommentVisibility = (postId) => {
            setCommentVisibility((prevVisibility) => ({
            ...prevVisibility,
            [postId]: !prevVisibility[postId],
            }));
        };
        
        function getCookie(name) {
            const cookies = document.cookie.split("; ");
            for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split("=");
            if (cookieName === name) {
                return cookieValue;
            }
            }
            return null;
        }
        const userId = getCookie("userId");
    const navigate = useNavigate()

    const handleDelete = (id)=>{
        axios.delete(`http://localhost:8000/api/posts/${id}`)
        .then(res=>{console.log(res);setLoadHome(!loadHome)})
        .catch(err=>console.log(err))
    }
    return ( 
        <div className='container'>
            <div className="card cardbg text-center post mb-3 ">

                <div className="card-header d-flex align-items-center ">
                    <div ><img src={post.author.image} alt="" width={50} className={postStyle.image}/></div>
                    <div className='ms-4'>
                        <a href={`/profile/${post.author._id}`}><h6>{post.author.firstName} {post.author.lastName}</h6></a>
                        <p>{formattedDate}</p>
                    </div>
                    {post.author._id == userId &&
                    <div>
                        <Link to={`/edit/${post._id}`}><i className="btn ms-3 bi bi-pencil"></i></Link>
                        <i className="btn bi bi-trash3 text-danger" onClick={()=>handleDelete(post._id)}></i>
                    </div>
                    }
                </div>

                <div className="card-body d-flex row justify-content-center">
                <div className="card-header text-start ">{post.description}</div>
                {post.code !== ""?
                    <div className={post.image!==""?"card codebg  col-6":"card codebg"}>
                            <div className="card-body">
                                <SyntaxHighlighter language="javascript" style={a11yDark}>
                                        {post.code}
                                </SyntaxHighlighter>
                            </div>
                    </div>:<></>
                    }
                    { post.image!==""?
                        <div className={post.code!==""?"card cardbgNS col-6":"card cardbgNS w-50 h-50"}>
                            <div className="card-body">
                                <img src={post.image} alt="" className='img-fluid'/>
                            </div>
                        </div>:<></>
                    }

                </div>

                    
                    

                <div className="card-footer text-body-secondary">
                    {likes.includes(userId)?<i className="btn text-danger bi bi-heartbreak-fill" onClick={()=>handleDisLikePost(post._id)}>{likes.length}</i>:
                    <i className="btn text-danger bi bi-heart-fill" onClick={()=>handleLikePost(post._id)}>{likes.length}</i>}
                    <i className="btn text-dark bi bi-chat-left-text" onClick={() => toggleCommentVisibility(post._id)}> {comments.length}</i>
                </div>
                {commentVisibility[post._id] && post.comments && (
                    <div className="card-footer text-body-secondary">
                    <div className="card-footer text-body-secondary">
                        
                            <input className='form-control' type="text" key={`commentInput-${post._id}`} placeholder="Add a comment" value={commentInputs[post._id] || ""}  onChange={(e) => handleCommentInputChange(post._id, e.target.value)} />
                            <button className='btn' onClick={(e) => handleAddComment(post._id)}>Send</button>
                        
                    </div>
                    {comments.map((comment) => (
                        <div className='row text-start ' key={comment._id}>
                        <h6><img src={comment.author.image} alt="" width={25} className={postStyle.imageComment} />{comment.author.firstName} {comment.author.lastName}</h6>
                        <div className='d-flex align-items-center align-content-center justify-content-between'><p>{comment.content}</p>
                        {comment.likes.includes(userId)?<i className="btn text-danger bi bi-heartbreak-fill" onClick={()=>handleDisLikeComment(post._id, comment._id)}>{likes.length}</i>:
                    <i className="btn text-danger bi bi-heart-fill" onClick={() => handleLikeComment(post._id, comment._id)}>{comment.likes.length}</i>}</div>
                        <hr />
                        </div>
                    ))}
                    </div>
                )}
            </div>
                    

        </div>
        
    )
}

export default PostListItem



// <div className={postStyle.post}>
            
        //     <div className='d-flex align-items-center mb-3 w-25'>
        //         <img src={post.author.image} alt="" width={50} className={postStyle.image}/>
        //         <div>
        //             <h5 className='ms-2'>{post.author.firstName} {post.author.lastName}</h5>
        //             <p className='ms-2 fs-6'>{formattedDate}</p>
        //         </div>
        //     </div>
        //     <h6 onClick={() => navigate(`/posts/${post._id}`)}>{post.description}</h6>
        //     <div className='d-flex'>

        //     { post.code.length> 0 ?
        //         <div className='w-50 syntax'>
        //             <SyntaxHighlighter language="javascript" style={a11yDark}>
        //                 {post.code}
        //             </SyntaxHighlighter>
        //         </div> : <p></p>
        //     }
        //     <div><img src={post.image} alt="" srcset="" width={128}/></div>
        //     </div>
        //     <div className="footer text-center">
        //         <button className='btn btn-primary'><i className="bi bi-heart"></i></button>
        //         <button className='btn btn-secondary' onClick={() => toggleCommentVisibility(post._id)}><i className="bi bi-chat-left-text"> {comments.length}</i></button>
        //     </div>

        //     {commentVisibility[post._id] && post.comments && (
        //     <ul>
        //       {post.comments.map((comment) => (
        //         <li key={comment._id}>
        //           {comment.content}{" "}
        //           <button onClick={() => handleLikeComment(post._id, comment._id)}>
        //             Like Comment
        //           </button>
        //         </li>
        //       ))}
        //     </ul>
        //   )}
        //   <input
        //     key={`commentInput-${post._id}`}
        //     type="text"
        //     placeholder="Add a comment"
        //     value={commentInputs[post._id] || ""}
        //     onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
        //   />
        //   <button onClick={() => handleAddComment(post._id)}>Add Comment</button>
        //   <button onClick={() => handleLikePost(post._id)}>Like Post</button>
        // </div>