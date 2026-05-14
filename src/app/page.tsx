'use client';

import { useState, useMemo } from 'react';
import { jogadoresUnicos, Posicao } from '@/data/jogadores';
import JogadorCard from '@/components/JogadorCard';
import PosterModal from '@/components/PosterModal';

const MAX_CONVOCADOS = 26;

const POSICOES: (Posicao | 'Todos')[] = ['Todos', 'Goleiro', 'Defensor', 'Meio-campista', 'Atacante'];

const POSICAO_LABEL: Record<string, string> = {
  'Goleiro': 'GOL',
  'Defensor': 'DEF',
  'Meio-campista': 'MEI',
  'Atacante': 'ATA',
  'Todos': 'TODOS',
};

export default function Home() {
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [filtro, setFiltro] = useState<Posicao | 'Todos'>('Todos');
  const [busca, setBusca] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [mostrarPoster, setMostrarPoster] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false); // modal de nome

  const jogadoresFiltrados = useMemo(() => {
    return jogadoresUnicos.filter(j => {
      const matchPosicao = filtro === 'Todos' || j.posicao === filtro;
      const matchBusca = j.nome.toLowerCase().includes(busca.toLowerCase()) ||
                         j.clube.toLowerCase().includes(busca.toLowerCase());
      return matchPosicao && matchBusca;
    });
  }, [filtro, busca]);

  const toggleJogador = (id: number) => {
    setSelecionados(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= MAX_CONVOCADOS) return prev;
        next.add(id);
      }
      return next;
    });
  };

  const jogadoresSelecionados = jogadoresUnicos.filter(j => selecionados.has(j.id));
  const podeSelecionar = selecionados.size < MAX_CONVOCADOS;

  const handleGerarPoster = () => {
    if (selecionados.size === 0) {
      alert('Selecione pelo menos 1 jogador para gerar o poster!');
      return;
    }
    setMostrarModal(true);
  };

  const handleConfirmarNome = () => {
    const nome = nomeUsuario.trim() || 'Torcedor';
    setNomeUsuario(nome);
    setMostrarModal(false);
    setMostrarPoster(true);
  };

  const contsPosicao = useMemo(() => ({
    'Goleiro': jogadoresSelecionados.filter(j => j.posicao === 'Goleiro').length,
    'Defensor': jogadoresSelecionados.filter(j => j.posicao === 'Defensor').length,
    'Meio-campista': jogadoresSelecionados.filter(j => j.posicao === 'Meio-campista').length,
    'Atacante': jogadoresSelecionados.filter(j => j.posicao === 'Atacante').length,
  }), [jogadoresSelecionados]);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background decorativo */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,156,59,0.15) 0%, transparent 70%),
          radial-gradient(ellipse 60% 40% at 100% 100%, rgba(0,39,118,0.1) 0%, transparent 60%),
          #001a10
        `,
        zIndex: -1,
      }} />

      {/* Header */}
      <header style={{
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,223,0,0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          padding: '12px 0',
        }}>
          {/* Logo / Título */}
          <div>
            <div style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '28px',
              letterSpacing: '3px',
              lineHeight: 1,
              background: 'linear-gradient(90deg, #FFDF00, #fff 60%, #009c3b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              MONTE SUA SELEÇÃO
            </div>
            <div style={{
              fontFamily: 'Barlow, sans-serif',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}>
              Copa do Mundo 2026 • Pré-lista Ancelotti
            </div>
          </div>

          {/* Contador + botão */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Barra de progresso circular */}
            <div style={{ position: 'relative', width: '52px', height: '52px' }}>
              <svg width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                <circle
                  cx="26" cy="26" r="22" fill="none"
                  stroke={selecionados.size >= MAX_CONVOCADOS ? '#FFDF00' : '#009c3b'}
                  strokeWidth="3"
                  strokeDasharray={`${(selecionados.size / MAX_CONVOCADOS) * 138} 138`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.3s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Bebas Neue, sans-serif',
              }}>
                <span style={{ fontSize: '16px', color: '#fff', lineHeight: 1 }}>{selecionados.size}</span>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>/{MAX_CONVOCADOS}</span>
              </div>
            </div>

            <button
              onClick={handleGerarPoster}
              style={{
                background: selecionados.size > 0
                  ? 'linear-gradient(135deg, #FFDF00 0%, #f0c800 100%)'
                  : 'rgba(255,255,255,0.1)',
                color: selecionados.size > 0 ? '#002776' : 'rgba(255,255,255,0.4)',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '16px',
                letterSpacing: '1px',
                cursor: selecionados.size > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                boxShadow: selecionados.size > 0 ? '0 4px 20px rgba(255,223,0,0.3)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              🏆 GERAR POSTER
            </button>
          </div>
        </div>
      </header>

      {/* Painel de convocados resumido */}
      {selecionados.size > 0 && (
        <div style={{
          background: 'rgba(0,39,118,0.3)',
          borderBottom: '1px solid rgba(0,39,118,0.5)',
          padding: '8px 24px',
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px' }}>
              CONVOCADOS:
            </span>
            {(['Goleiro', 'Defensor', 'Meio-campista', 'Atacante'] as Posicao[]).map(pos => (
              <span key={pos} style={{
                fontFamily: 'Barlow, sans-serif',
                fontSize: '12px',
                color: contsPosicao[pos] > 0 ? '#FFDF00' : 'rgba(255,255,255,0.2)',
              }}>
                {POSICAO_LABEL[pos]}: {contsPosicao[pos]}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Controles de filtro */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px 24px 0',
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
          {/* Filtros de posição */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {POSICOES.map(pos => (
              <button
                key={pos}
                onClick={() => setFiltro(pos)}
                style={{
                  background: filtro === pos
                    ? '#009c3b'
                    : 'rgba(255,255,255,0.07)',
                  border: filtro === pos
                    ? '1px solid #009c3b'
                    : '1px solid rgba(255,255,255,0.15)',
                  color: filtro === pos ? '#fff' : 'rgba(255,255,255,0.6)',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '14px',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {POSICAO_LABEL[pos]}
              </button>
            ))}
          </div>

          {/* Busca */}
          <input
            type="text"
            placeholder="🔍  Buscar jogador ou clube..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '6px',
              padding: '6px 14px',
              color: '#fff',
              fontFamily: 'Barlow, sans-serif',
              fontSize: '14px',
              outline: 'none',
              width: '220px',
            }}
          />

          <span style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.35)',
            marginLeft: 'auto',
          }}>
            {jogadoresFiltrados.length} jogadores
          </span>
        </div>
      </div>

      {/* Instrução */}
      {selecionados.size === 0 && (
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 16px',
          fontFamily: 'Barlow, sans-serif',
          fontSize: '14px',
          color: 'rgba(255,255,255,0.4)',
          textAlign: 'center',
        }}>
          Clique nas figurinhas para convocar até <strong style={{ color: '#FFDF00' }}>26 jogadores</strong> para a Copa do Mundo 2026 🏆
        </div>
      )}

      {/* Grid de jogadores */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px 48px',
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'flex-start',
        }}>
          {jogadoresFiltrados.map((jogador, idx) => (
            <div
              key={jogador.id}
              className="fade-in"
              style={{ animationDelay: `${Math.min(idx * 0.03, 0.5)}s`, animationFillMode: 'both', opacity: 0 }}
            >
              <JogadorCard
                jogador={jogador}
                selecionado={selecionados.has(jogador.id)}
                onToggle={toggleJogador}
                podeSelecionar={podeSelecionar}
              />
            </div>
          ))}
        </div>

        {jogadoresFiltrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚽</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', letterSpacing: '2px' }}>
              Nenhum jogador encontrado
            </div>
          </div>
        )}
      </main>

      {/* Modal de nome */}
      {mostrarModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <div style={{
            background: 'linear-gradient(160deg, #001f12 0%, #002d1a 100%)',
            border: '2px solid rgba(255,223,0,0.4)',
            borderRadius: '16px',
            padding: '36px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
            <div style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '28px',
              letterSpacing: '2px',
              color: '#FFDF00',
              marginBottom: '8px',
            }}>
              QUASE LÁ!
            </div>
            <div style={{
              fontFamily: 'Barlow, sans-serif',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '24px',
            }}>
              Como você quer assinar sua convocação?
            </div>
            <input
              type="text"
              placeholder="Seu nome ou apelido"
              value={nomeUsuario}
              onChange={e => setNomeUsuario(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleConfirmarNome()}
              autoFocus
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,223,0,0.4)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#fff',
                fontFamily: 'Barlow, sans-serif',
                fontSize: '16px',
                outline: 'none',
                textAlign: 'center',
                marginBottom: '16px',
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setMostrarModal(false)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: '10px',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '15px',
                  cursor: 'pointer',
                }}
              >
                CANCELAR
              </button>
              <button
                onClick={handleConfirmarNome}
                style={{
                  flex: 2,
                  background: 'linear-gradient(135deg, #FFDF00 0%, #f0c800 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px',
                  color: '#002776',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '15px',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                }}
              >
                GERAR POSTER →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Poster modal */}
      {mostrarPoster && (
        <PosterModal
          jogadores={jogadoresSelecionados}
          nomeUsuario={nomeUsuario || 'Torcedor'}
          onClose={() => setMostrarPoster(false)}
        />
      )}
    </div>
  );
}
