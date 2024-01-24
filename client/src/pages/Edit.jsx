import {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const Edit = (props) => {
  const [imgStatus,setImageStatus]=useState("Empty")
  const navigate = useNavigate();
  const {id} = useParams();
  const [post, setPost] = useState({ description: '', code: '', image:'' })
  const [postError, setPostError] = useState("")
  const updatePost = (e) => {
    e.preventDefault()
    axios.put('http://localhost:8000/api/posts/'+id, post)
      .then(response => {
        console.log(response.data)
        navigate('/posts')
      })
      .catch(error => {
      setPostError(error.response.data)
        }
      )}
  
  useEffect(() => {
    axios.get('http://localhost:8000/api/posts/'+id)
      .then(response => {
        console.log('Response.data : ',response.data)
        setPost(response.data)
      })
      .catch(error => {
        console.log(error.response.data)
      })
  }, [id])

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
    <div className='container mt-3'>
      {/* <h4>{JSON.stringify(postError)}</h4> */}
      <form onSubmit={updatePost}>
        <div className="form-group mb-3">
          <label htmlFor="">Description</label>
          <input type="text" className="form-control"
            onChange={e => setPost({ ...post, description: e.target.value })}
            value={post.description}
          />
          <span className="h4 text-danger">{postError.title && postError.title}</span>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="">Code</label>
          <textarea
            className='form-control' cols="30" rows="3"
            onChange={e => setPost({ ...post, content: e.target.value })}
            value={post.code}
          ></textarea>
          <span className="h4 text-danger">{postError.content && postError.content}</span>

        </div>
        <div className="btn reg-btn">
                    <label className="form-label">Attach a picture</label>
                    { imgStatus === "Empty"?<img src={post.image} alt="uploading" width={100} className='uploaded'/>: imgStatus ==="Uploading"? <div className="spinner-border text-light" role="status"><span className="visually-hidden">Loading...</span></div> :<img src={img} alt="uploading" width={100} className='uploaded'/>}
                    <input type="file" id="img" onChange={handleFileChange} className="form-control"/>
                </div>

        <div className="text-right">
          <button className="btn log-btn btn-info w-50">Update</button>
        </div>
      </form>
    </div>
  )
  }

export default Edit