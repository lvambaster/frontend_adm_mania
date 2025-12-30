import { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/lancamentos.css'

export default function Lancamentos() {
  const [motoqueiros, setMotoqueiros] = useState([])
  const [resultado, setResultado] = useState([])
  const [editando, setEditando] = useState(null)

  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  const [form, setForm] = useState({
    MotoqueiroId: '',
    data: '',
    diaria: '',
    taxa: '',
    qtd_entregas: '',
    qtd_taxas_acima_10: '',
    vales: ''
  })

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  // ===============================
  // FORMATAR DATA (SEM BUG)
  // ===============================
  function formatarData(data) {
    const d = new Date(data)
    return d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  }

  useEffect(() => {
    axios.get('http://localhost:3000/motoqueiros', { headers })
      .then(res => setMotoqueiros(res.data))
  }, [])

  // ===============================
  // SALVAR / EDITAR (FIX DATA)
  // ===============================
  function salvar(e) {
    e.preventDefault()

    const payload = {
      ...form,
      data: `${form.data}T12:00:00`, // ✅ FIX DEFINITIVO
      diaria: Number(form.diaria),
      taxa: Number(form.taxa),
      qtd_entregas: Number(form.qtd_entregas),
      qtd_taxas_acima_10: Number(form.qtd_taxas_acima_10),
      vales: Number(form.vales)
    }

    if (editando) {
      axios.put(
        `http://localhost:3000/lancamentos/${editando.id}`,
        payload,
        { headers }
      )
    } else {
      axios.post(
        'http://localhost:3000/lancamentos',
        payload,
        { headers }
      )
    }

    limpar()
  }

  // ===============================
  // CONSULTA BETWEEN
  // ===============================
  function consultar() {
    if (!dataInicio || !dataFim) return

    axios.get('http://localhost:3000/lancamentos', { headers })
      .then(res => {
        const filtrados = res.data.filter(l => {
          const d = l.data.slice(0, 10)
          return d >= dataInicio && d <= dataFim
        })
        setResultado(filtrados)
      })
  }

  function editar(l) {
    setEditando(l)
    setForm({
      MotoqueiroId: l.MotoqueiroId,
      data: l.data.slice(0, 10),
      diaria: l.diaria,
      taxa: l.taxa,
      qtd_entregas: l.qtd_entregas,
      qtd_taxas_acima_10: l.qtd_taxas_acima_10,
      vales: l.vales
    })
  }

  function excluir(id) {
    if (confirm('Deseja excluir este lançamento?')) {
      axios.delete(`http://localhost:3000/lancamentos/${id}`, { headers })
        .then(consultar)
    }
  }

  function limpar() {
    setEditando(null)
    setForm({
      MotoqueiroId: '',
      data: '',
      diaria: '',
      taxa: '',
      qtd_entregas: '',
      qtd_taxas_acima_10: '',
      vales: ''
    })
  }

  return (
    <div className="lancamentos-container">

      {/* FORM */}
      <div className="card">
        <h2>{editando ? 'Editar Lançamento' : 'Novo Lançamento'}</h2>

        <form onSubmit={salvar} className="form">

          <select required value={form.MotoqueiroId}
            onChange={e => setForm({ ...form, MotoqueiroId: e.target.value })}
          >
            <option value="">Selecione o Motoqueiro</option>
            {motoqueiros.map(m => (
              <option key={m.id} value={m.id}>{m.nome}</option>
            ))}
          </select>

          <input type="date" required
            value={form.data}
            onChange={e => setForm({ ...form, data: e.target.value })}
          />

          <input type="number" placeholder="Diária"
            value={form.diaria}
            onChange={e => setForm({ ...form, diaria: e.target.value })}
          />

          <input type="number" placeholder="Taxa"
            value={form.taxa}
            onChange={e => setForm({ ...form, taxa: e.target.value })}
          />

          <input type="number" placeholder="Qtd Entregas"
            value={form.qtd_entregas}
            onChange={e => setForm({ ...form, qtd_entregas: e.target.value })}
          />

          <input type="number" placeholder="Qtd Taxas > 10"
            value={form.qtd_taxas_acima_10}
            onChange={e => setForm({ ...form, qtd_taxas_acima_10: e.target.value })}
          />

          <input type="number" placeholder="Vales"
            value={form.vales}
            onChange={e => setForm({ ...form, vales: e.target.value })}
          />

          <div className="actions">
            <button type="submit">
              {editando ? 'Atualizar' : 'Salvar'}
            </button>
            {editando && (
              <button type="button" className="secondary" onClick={limpar}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* CONSULTA */}
      <div className="card">
        <h2>Consulta por Período</h2>

        <div className="consulta">
          <input type="date" value={dataInicio}
            onChange={e => setDataInicio(e.target.value)}
          />
          <input type="date" value={dataFim}
            onChange={e => setDataFim(e.target.value)}
          />
          <button onClick={consultar}>Consultar</button>
        </div>

        <div className="lista">
          {resultado.map(l => (
            <div className="item" key={l.id}>
              <strong>{l.Motoqueiro?.nome}</strong>
              <span>Data: {formatarData(l.data)}</span>
              <small>
                Diária: R$ {l.diaria} | Taxa: R$ {l.taxa} |
                Entregas: {l.qtd_entregas} |
                Taxas &gt; 10: {l.qtd_taxas_acima_10} |
                Vales: R$ {l.vales}
              </small>

              <div className="botoes">
                <button onClick={() => editar(l)}>Editar</button>
                <button className="danger" onClick={() => excluir(l.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
