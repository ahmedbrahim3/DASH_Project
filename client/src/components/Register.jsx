import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'
const Register = () => {
  const navigate = useNavigate();
  const [imgStatus,setImageStatus]=useState("Empty")
  const [user, setUser] = useState({ firstName: '',lastName:'',bio:'', email: '', password: '', confirmPW: '' , image : ''})
  const [errors, setErrors] = useState("")
  const register = async (e) => {
      e.preventDefault()
      try {
          const response = await axios.post('http://localhost:8000/api/users/signup', user,{withCredentials:true})
          console.log('SERVER RESPONSE:', response.data)
          localStorage.setItem('token',response.data.token)
          navigate('/posts')
      } catch (error) {
        setErrors(error.response.data.error)
      }
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
    
            setUser({ ...user, image: response.data.secure_url });
            setImage(response.data.secure_url);
            setImageStatus("Uploaded")
            console.log("IMAGE UPLOADED")
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
<div className=" mt-5 me-5" >
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-xl-12">
          <div className="card reg text-light">
            <div className="card-body">
              <form onSubmit={register}>
              <h2 className='text-center'>Create An Account</h2>
              <p className="text-danger">{errors}</p>
    <div className="row">
        <div className='col-6'>

                <div className="mb-3">
                  <label htmlFor="inputFirstName" className="form-label">
                    First Name
                  </label>
                  <input type="text" id="inputFirstName" className="form-control form-style" name="firstName" onChange={e => setUser({ ...user, firstName: e.target.value })}
                            value={user.firstName} />
                </div>

                <div className="mb-3">
                  <label htmlFor="inputLastName" className="form-label">
                    Last Name
                  </label>
                  <input type="text" id="inputLastName" className="form-control" name="lastName" onChange={e => setUser({ ...user, lastName: e.target.value })}
                            value={user.lastName}/>
                </div>

                <div className="mb-3">
                  <label htmlFor="inputEmail" className="form-label">
                    Email
                  </label>
                  <input type="email" id="inputEmail" className="form-control" name="email" onChange={e => setUser({ ...user, email: e.target.value })}
                            value={user.email}/>
                </div>

                <div className="mb-3">
                  <label htmlFor="inputPassword" className="form-label">
                    Password
                  </label>
                  <input type="password" id="inputPassword" className="form-control" name="password" onChange={e => setUser({ ...user, password: e.target.value })}
                            value={user.password}/>
                </div>

                <div className="mb-3">
                  <label htmlFor="inputConfirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input type="password" id="inputConfirmPassword" className="form-control" name="confirmPW" onChange={e => setUser({ ...user, confirmPW: e.target.value })}
                            value={user.confirmPW}/>
                </div>
        </div>

            <div className='col-6'>
                <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">Bio</label>
                    <textarea className="form-control" id="bio" rows="8" onChange={e => setUser({ ...user, bio: e.target.value })}
                            value={user.bio}></textarea>
                </div>

                <div className="mb-3 btn log-btn btn-rounded">
                    <label className="form-label">Profile Picture</label>
                    { imgStatus === "Empty"?<p></p>: imgStatus ==="Uploading"? <div className="spinner-border text-light" role="status"><span className="visually-hidden">Loading...</span></div> :<img src={img} alt="uploading" width={100} className='uploaded'/>}
                    <input type="file" id="img" onChange={handleFileChange} className="form-control"/>
                </div>
            </div>
    </div>

                <button type="submit" className="btn btn-primary btn-block reg-btn w-100">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};

export default Register;
