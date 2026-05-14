'use client';

import { Jogador } from '@/data/jogadores';
import { useRef, useState } from 'react';

interface Props {
  jogadores: Jogador[];
  nomeUsuario: string;
  onClose: () => void;
}

const POSICAO_COR: Record<string, string> = {
  'Goleiro': '#f59e0b',
  'Defensor': '#3b82f6',
  'Meio-campista': '#8b5cf6',
  'Atacante': '#ef4444',
};

const POSICAO_LABEL: Record<string, string> = {
  'Goleiro': 'Goleiros',
  'Defensor': 'Defensores',
  'Meio-campista': 'Meio-campistas',
  'Atacante': 'Atacantes',
};

function MiniCard({ j }: { j: Jogador }) {
  return (
    <div style={{
      background: 'linear-gradient(160deg, #f5f0e8 0%, #ede8db 100%)',
      borderRadius: '5px',
      border: '2px solid #fff',
      boxShadow: '2px 2px 6px rgba(0,0,0,0.4)',
      width: '64px',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <div style={{ background: '#002776', padding: '2px 3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#FFDF00', fontSize: '6px', fontFamily: 'Bebas Neue, sans-serif' }}>🇧🇷 26</span>
        <span style={{ color: '#FFDF00', fontSize: '6px', fontFamily: 'Bebas Neue, sans-serif' }}>#{j.numero}</span>
      </div>
      <div style={{ height: '52px', overflow: 'hidden', background: '#c8dff0' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={j.foto}
          alt={j.nome}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            t.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(j.nome)}&background=009c3b&color=fff&size=100&bold=true&font-size=0.35`;
          }}
          crossOrigin="anonymous"
        />
      </div>
      <div style={{ background: '#002776', padding: '2px 3px', textAlign: 'center' }}>
        <div style={{ color: '#fff', fontFamily: 'Bebas Neue, sans-serif', fontSize: '7.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
          {j.nome}
        </div>
        <div style={{ color: '#FFDF00', fontSize: '5.5px', fontFamily: 'Barlow, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.9 }}>
          {j.clube}
        </div>
      </div>
    </div>
  );
}

function PosterContent({ jogadores, nomeUsuario }: { jogadores: Jogador[], nomeUsuario: string }) {
  const grouped: [string, Jogador[]][] = [
    ['Goleiro', jogadores.filter(j => j.posicao === 'Goleiro')],
    ['Defensor', jogadores.filter(j => j.posicao === 'Defensor')],
    ['Meio-campista', jogadores.filter(j => j.posicao === 'Meio-campista')],
    ['Atacante', jogadores.filter(j => j.posicao === 'Atacante')],
  ].filter(([, lista]) => (lista as Jogador[]).length > 0) as [string, Jogador[]][];

  return (
    <div style={{
      background: 'linear-gradient(160deg, #001a10 0%, #002d1a 50%, #001a10 100%)',
      border: '5px solid #FFDF00',
      borderRadius: '12px',
      padding: '20px 20px 16px',
      width: '860px',
      fontFamily: 'Bebas Neue, sans-serif',
    }}>
      {/* Header compacto horizontal */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(255,223,0,0.25)',
      }}>
        <span style={{ fontSize: '28px', lineHeight: 1 }}>⭐</span>
        <div>
          <div style={{ fontSize: '32px', letterSpacing: '4px', color: '#FFDF00', lineHeight: 1 }}>
            MINHA SELEÇÃO
          </div>
          <div style={{ fontSize: '14px', letterSpacing: '5px', color: '#009c3b', lineHeight: 1.2 }}>
            COPA DO MUNDO 2026
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', fontFamily: 'Barlow, sans-serif', textTransform: 'uppercase' }}>
            Convocado por
          </div>
          <div style={{ fontSize: '18px', letterSpacing: '2px', color: '#fff' }}>
            {nomeUsuario}
          </div>
        </div>
        <div style={{
          background: 'rgba(255,223,0,0.1)',
          border: '1px solid rgba(255,223,0,0.3)',
          borderRadius: '6px',
          padding: '6px 12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '24px', color: '#FFDF00', lineHeight: 1 }}>{jogadores.length}</div>
          <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', fontFamily: 'Barlow, sans-serif', letterSpacing: '1px' }}>/ 26</div>
        </div>
      </div>

      {/* Seções por posição */}
      {grouped.map(([posicao, lista]) => (
        <div key={posicao} style={{ marginBottom: '12px' }}>
          {/* Label inline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <div style={{ width: '3px', height: '14px', background: POSICAO_COR[posicao], borderRadius: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '11px', letterSpacing: '3px', color: POSICAO_COR[posicao] }}>
              {POSICAO_LABEL[posicao]}
            </span>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: 'Barlow, sans-serif' }}>
              ({lista.length})
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>
          {/* Cards */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {lista.map(j => <MiniCard key={j.id} j={j} />)}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{
        marginTop: '12px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(255,223,0,0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '2px' }}>
          MONTE SUA SELEÇÃO • 2026
        </div>
        <div style={{ fontSize: '9px', color: 'rgba(255,223,0,0.5)', letterSpacing: '2px' }}>
          PRÉ-LISTA ANCELOTTI
        </div>
      </div>
    </div>
  );
}

export default function PosterModal({ jogadores, nomeUsuario, onClose }: Props) {
  const offscreenRef = useRef<HTMLDivElement>(null);
  const [gerando, setGerando] = useState(false);

  const handleDownload = async () => {
    if (!offscreenRef.current) return;
    setGerando(true);

    // Aguarda imagens carregarem
    const imgs = offscreenRef.current.querySelectorAll('img');
    await Promise.all(Array.from(imgs).map(img =>
      img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; img.onerror = res; })
    ));

    try {
      const html2canvas = (await import('html2canvas')).default;
      const el = offscreenRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#001a10',
        logging: false,
        width: el.offsetWidth,
        height: el.offsetHeight,
      });
      const link = document.createElement('a');
      link.download = `minha-selecao-${nomeUsuario.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
      alert('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setGerando(false);
    }
  };

  return (
    <>
      {/* Poster renderizado FORA da tela para captura completa */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', zIndex: -1 }}>
        <div ref={offscreenRef}>
          <PosterContent jogadores={jogadores} nomeUsuario={nomeUsuario} />
        </div>
      </div>

      {/* Modal de preview + ações */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.92)',
        zIndex: 1000,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px',
        gap: '20px',
      }}>
        {/* Botões */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleDownload}
            disabled={gerando}
            style={{
              background: '#FFDF00',
              color: '#002776',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 28px',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '18px',
              letterSpacing: '1px',
              cursor: gerando ? 'wait' : 'pointer',
              boxShadow: '0 4px 16px rgba(255,223,0,0.4)',
              opacity: gerando ? 0.7 : 1,
            }}
          >
            {gerando ? 'GERANDO...' : '⬇ BAIXAR IMAGEM'}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              padding: '12px 28px',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '18px',
              letterSpacing: '1px',
              cursor: 'pointer',
            }}
          >
            ✕ FECHAR
          </button>
        </div>

        {/* Preview escalado para caber na tela */}
        <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
          <PosterContent jogadores={jogadores} nomeUsuario={nomeUsuario} />
        </div>
      </div>
    </>
  );
}