import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import NotebooksPage from './pages/NotebooksPage'
import AlunosPage from './pages/AlunosPage'
import AlunosSemAcesso from './pages/AlunosSemAcesso'

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<NotebooksPage />} />
            <Route path="/alunos" element={<AlunosPage />} />
             <Route path="/alunosSemAcesso" element={<AlunosSemAcesso />} />

          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
