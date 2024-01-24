import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Create = ({setLoad, load}) => {
  const [imgStatus,setImageStatus]=useState("Empty")
  const navigate = useNavigate()
  function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;}
  const currUser = getCookie('userId')
  const [post, setPost] = useState({ description: '', code: '', image: '', comments:[], likes:[] })
  const [postError, setPostError] = useState("")
  
  const createPost = (e) => {
    e.preventDefault()
    axios.post(`http://localhost:8000/api/posts/${currUser}`, post)
      .then(response => {
        console.log(response.data)
        navigate('/posts')
        setLoad(!load)
      })
      .catch(error => {
        setPostError(error.response.data.errors.description.message)
      })
  }
  const [file, setFile] = useState(null);
    const [img, setImage] = useState("");
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setImageStatus("Uploading");
    
    
    
        try {
            const form = new FormData();
            form.append("file", selectedFile);
            form.append("upload_preset", "ahmedsm");
    
            const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dljarbi3r/image/upload",
            form
        );
    
            setPost({ ...post, image: response.data.secure_url });
            setImage(response.data.secure_url);
            setImageStatus("Uploaded")
        } catch (error) {
            console.error("Error uploading image:", error);
    
            if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            } else if (error.request) {
            console.error("No response received:", error.request);
            } else {
            console.error("Error setting up the request:", error.message);
            }
        }
    };
  return (
    <div className='container'>
      <div className="card container createbg text-center post mb-3 text-start">
      <div className="card-header d-flex align-items-center log-btn mb-3">
        Do you have something to Share ?
      </div>
      <p className="text-danger">{postError}</p>
      <form onSubmit={createPost}>
        <div className="form-group mb-3 text-start">
          <label htmlFor="">Description</label>
          <input type="text" className="form-control"
            onChange={e => setPost({ ...post, description: e.target.value })}
            value={post.description}
          />
        </div>
        <div className="form-group mb-3 text-start d-flex">
          <p>Code</p>
          <textarea
            className='form-control' cols="25" rows="2"
            onChange={e => setPost({ ...post, code: e.target.value })}
            value={post.code}
          ></textarea>

        
        <div className="btn reg-btn">
                    <label className="form-label">Attach a picture</label>
                    { imgStatus === "Empty"?<p></p>: imgStatus ==="Uploading"? <div className="spinner-border text-light" role="status"><span className="visually-hidden">Loading...</span></div> :<img src={img} alt="uploading" width={100} className='uploaded'/>}
                    <input type="file" id="img" onChange={handleFileChange} className="form-control"/>
                </div>
        <div className="text-right">
        </div></div>
          <button className="btn btn-primary w-50 log-btn">Create</button>
      </form>
      </div>
    </div>
  )
}

export default Create