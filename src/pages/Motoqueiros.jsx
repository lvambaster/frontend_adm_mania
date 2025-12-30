import { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/motoqueiros.css'

export default function Motoqueiros() {
  const [lista, setLista] = useState([])
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    login: '',
    senha: ''
  })

  const token = localStorage.getItem('token')

  const headers = {
    Authorization: `Bearer ${token}`
  }

  // 🔹 LISTAR
  async function carregar() {
    try {
      const res = await axios.get(
        'http://localhost:3000/motoqueiros',
        { headers }
      )
      setLista(res.data)
    } catch (err) {
      console.error(err)
      alert('Erro ao carregar motoqueiros')
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  // 🔹 SALVAR / ATUALIZAR
  async function salvar(e) {
    e.preventDefault()

    try {
      if (editando) {
        // remove senha vazia
        const dados = { ...form }
        if (!dados.senha) delete dados.senha

        await axios.put(
          `http://localhost:3000/motoqueiros/${editando.id}`,
          dados,
          { headers }
        )
      } else {
        await axios.post(
          'http://localhost:3000/motoqueiros',
          form,
          { headers }
        )
      }

      limpar()
      carregar()
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar motoqueiro')
    }
  }

  // 🔹 EDITAR
  function editar(m) {
    setEditando(m)
    setForm({
      nome: m.nome,
      telefone: m.telefone,
      login: m.login,
      senha: ''
    })
  }

  // 🔹 EXCLUIR
  async function excluir(id) {
    if (!confirm('Deseja excluir este motoqueiro?')) return

    try {
      await axios.delete(
        `http://localhost:3000/motoqueiros/${id}`,
        { headers }
      )
      carregar()
    } catch (err) {
      console.error(err)
      alert('Erro ao excluir motoqueiro')
    }
  }

  function limpar() {
    setEditando(null)
    setForm({
      nome: '',
      telefone: '',
      login: '',
      senha: ''
    })
  }

  return (
    <div className="motoqueiros-container">

      {/* CADASTRO */}
      <div className="card">
        <h2>{editando ? 'Editar Motoqueiro' : 'Cadastrar Motoqueiro'}</h2>

        <form onSubmit={salvar}>
          <input
            placeholder="Nome"
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
            required
          />

          <input
            placeholder="Telefone"
            value={form.telefone}
            onChange={e => setForm({ ...form, telefone: e.target.value })}
            required
          />

          <input
            placeholder="Login"
            value={form.login}
            onChange={e => setForm({ ...form, login: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder={editando ? 'Nova senha (opcional)' : 'Senha'}
            value={form.senha}
            onChange={e => setForm({ ...form, senha: e.target.value })}
          />

          <div className="actions">
            <button type="submit">
              {editando ? 'Atualizar' : 'Cadastrar'}
            </button>

            {editando && (
              <button
                type="button"
                className="secondary"
                onClick={limpar}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LISTA */}
      <div className="card">
        <h2>Motoqueiros Cadastrados</h2>

        {lista.length === 0 && <p>Nenhum motoqueiro cadastrado</p>}

        <div className="lista">
          {lista.map(m => (
            <div className="item" key={m.id}>
              <div>
                <strong>{m.nome}</strong>
                <span>{m.telefone}</span>
              </div>

              <div className="botoes">
                <button onClick={() => editar(m)}>Editar</button>
                <button
                  className="danger"
                  onClick={() => excluir(m.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
