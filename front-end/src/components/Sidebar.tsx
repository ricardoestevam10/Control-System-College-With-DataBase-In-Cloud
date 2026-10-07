import { NavLink } from 'react-router-dom'
import { Laptop, GraduationCap } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <Laptop size={22} />
        </span>
        <span className="brand-name">Notebooks da Escola</span>
      </div>
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <Laptop size={20} />
          <span>Notebooks</span>
        </NavLink>
        <NavLink to="/alunos" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <GraduationCap size={20} />
          <span>Alunos</span>
        </NavLink>
      </nav>
    </aside>
  )
}
