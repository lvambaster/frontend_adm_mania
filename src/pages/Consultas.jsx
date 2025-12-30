import { useEffect, useState } from 'react'
import api from '../api/api'
import '../styles/consultas.css'

export default function Consultas() {
  const [motoqueiros, setMotoqueiros] = useState([])
  const [resultados, setResultados] = useState([])
  const [filtro, setFiltro] = useState({
    motoqueiroId: '',
    data: ''
  })

  // ===============================
  // FORMATAR DATA (SEM BUG)
  // ===============================
  function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    })
  }

  // ===============================
  // CARREGAR MOTOQUEIROS
  // ===============================
  useEffect(() => {
    api.get('/motoqueiros')
      .then(res => setMotoqueiros(res.data))
      .catch(() => setMotoqueiros([]))
  }, [])

  // ===============================
  // CONSULTAR TOTAIS
  // ===============================
  async function consultar(e) {
    e.preventDefault()

    try {
      const res = await api.get('/totais', {
        params: {
          motoqueiroId: filtro.motoqueiroId || undefined,
          data: filtro.data || undefined
        }
      })

      setResultados(res.data)
    } catch {
      setResultados([])
    }
  }

  // ===============================
  // MARCAR COMO PAGO
  // ===============================
  async function marcarComoPago(id) {
    try {
      await api.put(`/totais/${id}/pagar`)

      setResultados(prev =>
        prev.map(r =>
          r.id === id ? { ...r, pago: true } : r
        )
      )
    } catch (err) {
      console.error(err)
      alert('Erro ao marcar como pago')
    }
  }

  // ===============================
  // TOTAL GERAL
  // ===============================
  const totalGeral = resultados.reduce(
    (soma, r) => soma + Number(r.total || 0),
    0
  )

  return (
    <div className="consultas-container">

      {/* FILTROS */}
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

      {/* RESULTADOS */}
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
                <span>Data: {formatarData(r.data)}</span>
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
