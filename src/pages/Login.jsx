import { useState } from 'react'
import axios from 'axios'
import '../styles/login.css'
import logo from '../assets/logo.png'


export default function Login() {
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  async function entrar(e) {
    e.preventDefault()
    setErro('')

    try {
      const res = await axios.post('http://localhost:3000/login', {
        login,
        senha
      })

      localStorage.setItem('token', res.data.token)
      window.location.href = '/'
    } catch (err) {
      setErro('Login ou senha inválidos')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Mania Delivery" className="login-logo" />
        <h1>Login do Administrador</h1>

        {erro && <div className="login-error">{erro}</div>}

        <form className="login-form" onSubmit={entrar}>
          <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={e => setLogin(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  )
}
