import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';

interface Aluno {
  _id: string;
  nome: string;
  RA?: number;
  sala: string;
  ano: string;
  atividadeEntregue: boolean;
  temAcesso: boolean;
}

export default function AlunosSemAcesso() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estados para as ferramentas de filtragem e busca
  const [termoBusca, setTermoBusca] = useState<string>('');
  const [anoSelecionado, setAnoSelecionado] = useState<string>('');

  // Estados para o formulário de cadastro/edição rápido
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [ra, setRa] = useState('');
  const [sala, setSala] = useState('');
  const [ano, setAno] = useState('');

  // 1. Busca os alunos do banco ao carregar a página
  const buscarAlunos = () => {
    fetch('http://localhost:8080/alunos')
      .then((res) => res.json())
      .then((data) => {
        setAlunos(data.alunos || data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar alunos:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    buscarAlunos();
  }, []);

  // 2. Função para Salvar (Cadastrar Novo ou Atualizar Existente)
  const handleSalvarFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !sala || !ano) {
      alert("Por favor, preencha o Nome, Sala e Ano!");
      return;
    }

    const dadosAluno = {
      nome,
      RA: ra ? Number(ra) : undefined,
      sala,
      ano,
      temAcesso: false
    };

    try {
      if (editingId) {
        const response = await fetch(`http://localhost:8080/aluno/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosAluno)
        });

        if (!response.ok) throw new Error();
        setEditingId(null);
      } else {
        const response = await fetch('http://localhost:8080/aluno', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosAluno)
        });

        if (!response.ok) throw new Error();
      }

      setNome('');
      setRa('');
      setSala('');
      setAno('');
      buscarAlunos();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar os dados do aluno no servidor.");
    }
  };

  // 3. Função para carregar dados do aluno no formulário para editar
  const handleIniciarEdicao = (aluno: Aluno) => {
    setEditingId(aluno._id);
    setNome(aluno.nome);
    setRa(aluno.RA ? String(aluno.RA) : '');
    setSala(aluno.sala);
    setAno(aluno.ano);
  };

  // 4. Função para deletar um aluno
  const handleDelete = async (id: string, nomeAluno: string) => {
    if (!window.confirm(`Tem certeza que deseja apagar o aluno ${nomeAluno}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/aluno/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        buscarAlunos();
      } else {
        alert("Erro ao deletar o aluno no servidor.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão ao tentar deletar.");
    }
  };

  // 5. Função do checkbox de atividade concluída
  const handleCheckboxChange = async (aluno: Aluno) => {
    const novoStatus = !aluno.atividadeEntregue;

    setAlunos((prevAlunos) =>
      prevAlunos.map((a) =>
        a._id === aluno._id ? { ...a, atividadeEntregue: novoStatus } : a
      )
    );

    try {
      const response = await fetch(`http://localhost:8080/aluno/${aluno._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: aluno.nome,
          RA: aluno.RA,
          sala: aluno.sala,
          ano: aluno.ano,
          atividadeEntregue: novoStatus,
          temAcesso: aluno.temAcesso
        }),
      });

      if (!response.ok) throw new Error();
    } catch (error) {
      console.error(error);
      alert("Não foi possível salvar o check.");
      buscarAlunos();
    }
  };

  if (loading) return <p style={{ padding: '20px', color: '#fff' }}>Carregando alunos...</p>;

  // Extrai dinamicamente todos os anos existentes na lista de alunos sem acesso para preencher o select
  const anosDisponiveis = Array.from(
    new Set(
      alunos
        .filter((aluno) => aluno.temAcesso === false)
        .map((aluno) => aluno.ano)
    )
  ).sort();

  // Executa os filtros combinados por Texto (Nome/Sala) e Ano Letivo de forma simultânea
  const alunosFiltrados = alunos
    .filter((aluno) => aluno.temAcesso === false)
    .filter((aluno) => {
      // Filtro por ano selecionado
      if (anoSelecionado !== '' && aluno.ano !== anoSelecionado) {
        return false;
      }

      // Filtro de termo digitado (procura por Nome ou Sala)
      const termo = termoBusca.toLowerCase();
      return (
        aluno.nome.toLowerCase().includes(termo) ||
        aluno.sala.toLowerCase().includes(termo)
      );
    });

  return (
    <div style={{ padding: '20px', color: '#fff', fontFamily: 'sans-serif', width: '80vw' }}>
      <h2 style={{ marginBottom: '20px', color: '#000' }}>Controle de Atividades - Alunos Sem Acesso</h2>
      
      {/* SEÇÃO DE BUSCA POR TEXTO E FILTRAGEM POR ANO */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', maxWidth: '100%', flexWrap: 'wrap' }}>
        
        {/* Barra de Pesquisa de Texto */}
        <div style={{ position: 'relative', flex: 2, minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
          <input 
            type="text" 
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Buscar aluno por nome ou sala..." 
            style={{ 
              width: '100%', 
              padding: '10px 10px 10px 40px', 
              background: '#1e1e1e', 
              color: '#fff', 
              border: '1px solid #444', 
              borderRadius: '6px',
              boxSizing: 'border-box'
            }} 
          />
        </div>

        {/* Menu Seletor Dinâmico por Ano */}
        <div style={{ flex: 1, minWidth: '150px' }}>
          <select
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: '#1e1e1e',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '6px',
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Todos os anos</option>
            {anosDisponiveis.map((anoItem) => (
              <option key={anoItem} value={anoItem}>
                Ano: {anoItem}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* SEÇÃO DO FORMULÁRIO DE CADASTRO / EDIÇÃO */}
      <form onSubmit={handleSalvarFormulario} style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 2, minWidth: '200px' }}>
          <label style={{ marginBottom: '6px', fontSize: '14px', color: '#aaa' }}>Nome do Aluno</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={{ padding: '8px', background: '#2d2d2d', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} placeholder="Ex: João Silva" />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '100px' }}>
          <label style={{ marginBottom: '6px', fontSize: '14px', color: '#aaa' }}>RA (Opcional)</label>
          <input type="number" value={ra} onChange={(e) => setRa(e.target.value)} style={{ padding: '8px', background: '#2d2d2d', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} placeholder="Ex: 12345" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '100px' }}>
          <label style={{ marginBottom: '6px', fontSize: '14px', color: '#aaa' }}>Sala</label>
          <input type="text" value={sala} onChange={(e) => setSala(e.target.value)} style={{ padding: '8px', background: '#2d2d2d', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} placeholder="Ex: 3º Ano A" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '100px' }}>
          <label style={{ marginBottom: '6px', fontSize: '14px', color: '#aaa' }}>Ano Letivo</label>
          <input type="text" value={ano} onChange={(e) => setAno(e.target.value)} style={{ padding: '8px', background: '#2d2d2d', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} placeholder="Ex: 2026" />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ padding: '9px 20px', background: editingId ? '#eab308' : '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {editingId ? 'Atualizar' : 'Cadastrar'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setNome(''); setRa(''); setSala(''); setAno(''); }} style={{ padding: '9px 15px', background: '#444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* TABELA DE ALUNOS COM AS TAGS E ESTRUTURA DE CORREÇÃO INTEGRADAS */}

      {/* BARRA DE PESQUISA ADICIONADA */}
    

      {/* TABELA DE ALUNOS COM ARRAY FILTRADO */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#2d2d2d', color: '#aaa' }}>
            <th style={{ padding: '12px 16px' }}>Nome do Aluno</th>
            <th style={{ padding: '12px 16px' }}>Sala</th>
            <th style={{ padding: '12px 16px' }}>Ano</th>
            <th style={{ padding: '12px 16px', textAlign: 'center', width: '120px' }}>Entregou?</th>
            <th style={{ padding: '12px 16px', textAlign: 'center', width: '120px' }}>Ações</th>
          </tr>
        </thead>
  <tbody>
          {alunosFiltrados.map((aluno) => (
            <tr key={aluno._id} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{aluno.nome}</td>
              <td style={{ padding: '12px 16px' }}>{aluno.sala}</td>
              <td style={{ padding: '12px 16px' }}>{aluno.ano}</td>
              <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={aluno.atividadeEntregue || false}
                  onChange={() => handleCheckboxChange(aluno)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </td> {/* FECHAMENTO DA TD DO CHECKBOX */}
              <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                  <button 
                    onClick={() => handleIniciarEdicao(aluno)} 
                    style={{ background: 'none', border: 'none', color: '#eab308', cursor: 'pointer', padding: '4px' }}
                    title="Editar Aluno"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(aluno._id, aluno.nome)} 
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    title="Excluir Aluno"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table> {/* FECHAMENTO DA TABELA */}

      {alunosFiltrados.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>
          {alunos.filter(a => !a.temAcesso).length === 0
            ? 'Nenhum aluno cadastrado sem acesso.'
            : 'Nenhum resultado encontrado para a pesquisa.'}
        </p>
      )}
    </div>
  );
}