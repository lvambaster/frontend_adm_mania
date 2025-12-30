import { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/consultas.css'

export default function Consultas() {
  const [motoqueiros, setMotoqueiros] = useState([])
  const [resultados, setResultados] = useState([])
  const [filtro, setFiltro] = useState({
    motoqueiroId: '',
    data: ''
  })

  const token = localStorage.getItem('token')
   const headers = {
  Authorization: `Bearer ${token}`
}


  useEffect(() => {
    axios
      .get('http://localhost:3000/motoqueiros', { headers })
      .then(res => setMotoqueiros(res.data))
      .catch(() => setMotoqueiros([]))
  }, [])

  function consultar(e) {
    e.preventDefault()

    axios
      .get('http://localhost:3000/totais', {
        headers,
        params: {
          motoqueiroId: filtro.motoqueiroId || undefined,
          data: filtro.data || undefined
        }
      })
      .then(res => setResultados(res.data))
      .catch(() => setResultados([]))
  }

  function marcarComoPago(id) {
    axios
      .put(`http://localhost:3000/totais/${id}/pagar`, {}, { headers })
      .then(() => {
        setResultados(prev =>
          prev.map(r =>
            r.id === id ? { ...r, pago: true } : r
          )
        )
      })
  }

  const totalGeral = resultados.reduce(
    (soma, r) => soma + Number(r.total || 0),
    0
  )

  return (
    <div className="consultas-container">
      <div className="card">
        <h2>Consulta de Totais</h2>

        <form onSubmit={consultar} className="filtros">
          <select
            value={filtro.motoqueiroId}
            onChange={e =>
              setFiltro({ ...filtro, motoqueiroId: e.target.value })
            }
          >
            <option value="">Selecione o Motoqueiro</option>
            {motoqueiros.map(m => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filtro.data}
            onChange={e =>
              setFiltro({ ...filtro, data: e.target.value })
            }
          />

          <button type="submit">Consultar</button>
        </form>
      </div>

      <div className="card">
        <h2>Resultados</h2>

        {resultados.length === 0 && (
          <p>Nenhum resultado encontrado</p>
        )}

        <div className="lista">
          {resultados.map(r => (
            <div
              key={r.id}
              className={`item ${r.pago ? 'pago' : ''}`}
            >
              <div>
                <strong>{r.Motoqueiro?.nome}</strong>
                <span>
                  {new Date(r.data).toLocaleDateString()}
                </span>
              </div>

              <div className="total">
                R$ {Number(r.total).toFixed(2)}
              </div>

              {!r.pago && (
                <button
                  className="btn-pagar"
                  onClick={() => marcarComoPago(r.id)}
                >
                  Marcar como pago
                </button>
              )}

              {r.pago && <span className="badge">Pago</span>}
            </div>
          ))}
        </div>

        {resultados.length > 0 && (
          <div className="total-geral">
            Total Geral: R$ {totalGeral.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  )
}
