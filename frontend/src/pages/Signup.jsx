import React from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer} from 'react-toastify'

function Signup(){
    return(
        <div className="container">
            <h1>Signup</h1>
            <form>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type= "text"
                        name= "name"
                        autoFocus
                        placeholder= "Enter yout name"
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type= "email"
                        name= "email"
                        autoFocus
                        placeholder= "Enter your Email"
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
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