export default function Navbar({ setPage }) {
  return (
    <nav>
      <button onClick={() => setPage('motoqueiros')}>Motoqueiros</button>
      <button onClick={() => setPage('lancamentos')}>Lançamentos</button>
      <button onClick={() => setPage('consultas')}>Consultas</button>
      <button onClick={() => { localStorage.clear(); location.reload() }}>Sair</button>
    </nav>
  )
}