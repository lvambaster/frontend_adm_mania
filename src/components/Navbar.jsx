import { useState } from 'react'

export default function Navbar({ setPage }) {
  const [aberto, setAberto] = useState(false)

  function ir(pagina) {
    setPage(pagina)
    setAberto(false)
  }

  return (
    <header className="navbar">
      <div className="navbar-top">
        <span className="logo">Mania</span>

        <button
          className="hamburguer"
          onClick={() => setAberto(!aberto)}
        >
          ☰
        </button>
      </div>

      <nav className={`menu ${aberto ? 'aberto' : ''}`}>
        <button onClick={() => ir('motoqueiros')}>Motoqueiros</button>
        <button onClick={() => ir('lancamentos')}>Lançamentos</button>
        <button onClick={() => ir('consultas')}>Consultas</button>
        <button
          className="sair"
          onClick={() => {
            localStorage.clear()
            location.reload()
          }}
        >
          Sair
        </button>
      </nav>
    </header>
  )
}
