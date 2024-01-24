import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'
const Login = (props) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState("")
    const login = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:8000/api/users/login', user, { withCredentials: true })
            console.log('SERVER RESPONSE:', response.data)
            localStorage.setItem('token', response.data.token)
            navigate('/posts')
        } catch (error) {
            setErrors(error.response.data.error)
        }
    }
    return (
        <div className='card log mt-5 me-5 text-light'>
            <div className="card-head text-center ">
                <h2 className=''>Login</h2>
                <p className="text-danger">{errors}</p>
            </div>
            <div className="card-body">
                <form onSubmit={login}>
                    <div className="row align-items-center mb-3">
                        <label htmlFor="" className="col-2">Email</label>
                        <input name='email' type="email" className="form-control col"
                            onChange={e => setUser({ ...user, email: e.target.value })}
                            value={user.email} />
                        <span className="text-danger">{errors.email}</span>

                    </div>
                    <div className="row align-items-center mb-3">
                        <label htmlFor="" className="col-2">Password</label>
                        <input name='password' type="password" className="form-control col"
                            onChange={e => setUser({ ...user, password: e.target.value })}
                            value={user.password} />
                        <span className="text-danger">{errors.password}</span>
                    </div>
                    <div className="text-center">
                        <button className="btn btn-dark w-50 reg-btn">Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login