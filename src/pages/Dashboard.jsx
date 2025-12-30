import { useState } from 'react'
import Navbar from '../components/Navbar'
import Motoqueiros from './Motoqueiros'
import Lancamentos from './Lancamentos'
import Consultas from './Consultas'

import logo from '../assets/logo.png'


export default function Dashboard() {
  const [page, setPage] = useState('motoqueiros')

  return (
    <>
      <Navbar setPage={setPage} />
      {page === 'motoqueiros' && <Motoqueiros />}
      {page === 'lancamentos' && <Lancamentos />}
      {page === 'consultas' && <Consultas />}
    </>
  )
}