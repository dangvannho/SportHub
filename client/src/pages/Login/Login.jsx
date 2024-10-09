import "./Login.scss";
function Login() {
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <p className="logo">SportHub</p>
        <h2 className="title-login">Sign in</h2>
        <div className="sign-up">
          <span>{"Don't have an account?"}</span>
          <a href="#!">Create now</a>
        </div>
        <div className="form-login">
          <div className="form-group">
            <label htmlFor="">E-mail</label>
            <input type="Email" placeholder="example@gmail.com" />
          </div>

          <div className="form-group">
            <label htmlFor="">Password</label>
            <input type="password" placeholder="password123" />
          </div>

          <button className="submit-login">Sign in</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
