import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer} from 'react-toastify'

function Signup(){

    const[loginInfo , setLoginInfo] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const {name,value} = e.target;
        console.log(name,value);
        const copyLoginInfo = {...loginInfo};
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    console.log("login info ->" , loginInfo)

    return(
        <div className="container">
            <h1>Signup</h1>
            <form>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        onChange={handleChange}
                        type= "text"
                        name= "name"
                        autoFocus
                        placeholder= "Enter your name"
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={handleChange}
                        type= "email"
                        name= "email"
                        autoFocus
                        placeholder= "Enter your Email"
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={handleChange}
                        type= "password"
                        name= "password"
                        autoFocus
                        placeholder= "Enter a Password"
                    />
                </div>
                <button>Signup</button>
                <span>Already have an account?
                    <Link to="/login">Login</Link>
                </span>
            </form>
            <ToastContainer/>
        </div>
    )
}

export default Signup