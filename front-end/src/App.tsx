import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import NotebooksPage from './pages/NotebooksPage'
import AlunosPage from './pages/AlunosPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<NotebooksPage />} />
            <Route path="/alunos" element={<AlunosPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
