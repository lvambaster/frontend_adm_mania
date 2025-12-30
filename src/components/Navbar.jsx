import { useState } from 'react'
import 'frontend_adm_mania/src/style.css'

export default function Navbar({ setPage }) {
  const [open, setOpen] = useState(false)

  function navegar(pagina) {
    setPage(pagina)
    setOpen(false) // fecha menu no mobile
  }

  return (
    <nav className="navbar">

      {/* LOGO / TÍTULO */}
      <div className="nav-left">
        <span className="logo">Gestão</span>
      </div>

      {/* BOTÃO HAMBÚRGUER */}
      <button
        className={`hamburger ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* MENU */}
      <div className={`nav-menu ${open ? 'open' : ''}`}>
        <button onClick={() => navegar('motoqueiros')}>Motoqueiros</button>
        <button onClick={() => navegar('lancamentos')}>Lançamentos</button>
        <button onClick={() => navegar('consultas')}>Consultas</button>
        <button
          className="danger"
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
