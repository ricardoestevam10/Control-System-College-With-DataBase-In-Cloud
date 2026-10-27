import { NavLink } from 'react-router-dom'
import { Laptop, GraduationCap, School } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <School size={22} />
        </span>
        <span className="brand-name">Abu-Yaghi Control</span>
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
        
        {/* CORRIGIDO: Agora segue exatamente o mesmo padrão visual dos outros botões */}
        <NavLink to="/alunosSemAcesso" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <GraduationCap size={20} />
          <span>Alunos Sem Acesso</span>
        </NavLink>
      </nav>
    </aside>
  )
}
