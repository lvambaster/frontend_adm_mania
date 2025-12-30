import { useState } from 'react'
import '../style.css'

export default function Navbar({ setPage }) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar">
      {/* ESQUERDA: LOGO + HAMBURGUER */}
  <div className="nav-left">
  <img
    src="/logo.png"
    alt="Logo"
    className="logo"
  />
</div>

<button
  className="hamburger"
  onClick={() => setOpen(!open)}
>
  ☰
</button>


      {/* MENU */}
      <div className={`nav-menu ${open ? 'open' : ''}`}>
        <button onClick={() => { setPage('motoqueiros'); setOpen(false) }}>
          Motoqueiros
        </button>

        <button onClick={() => { setPage('lancamentos'); setOpen(false) }}>
          Lançamentos
        </button>

        <button onClick={() => { setPage('consultas'); setOpen(false) }}>
          Consultas
        </button>

        <button
          className="logout"
          onClick={() => {
            localStorage.clear()
            location.reload()
          }}
        >
          Sair
        </button>
      </div>
    </nav>
  )
}
