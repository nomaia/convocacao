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

export default function PosterModal({ jogadores, nomeUsuario, onClose }: Props) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [gerando, setGerando] = useState(false);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setGerando(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#001a10',
        logging: false,
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

  const grouped = {
    'Goleiro': jogadores.filter(j => j.posicao === 'Goleiro'),
    'Defensor': jogadores.filter(j => j.posicao === 'Defensor'),
    'Meio-campista': jogadores.filter(j => j.posicao === 'Meio-campista'),
    'Atacante': jogadores.filter(j => j.posicao === 'Atacante'),
  };

  return (
    <div
      style={{
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
      }}
    >
      {/* Botões de ação */}
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

      {/* POSTER */}
      <div
        ref={posterRef}
        style={{
          background: 'linear-gradient(160deg, #001a10 0%, #002d1a 50%, #001a10 100%)',
          border: '6px solid #FFDF00',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '900px',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorativo */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(0,156,59,0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 50%, rgba(0,39,118,0.1) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px', position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '8px',
          }}>
            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(90deg, transparent, #FFDF00)' }} />
            <span style={{ fontSize: '32px' }}>⭐</span>
            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(90deg, #FFDF00, transparent)' }} />
          </div>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '42px',
            letterSpacing: '4px',
            color: '#FFDF00',
            textShadow: '0 2px 20px rgba(255,223,0,0.3)',
            lineHeight: 1,
          }}>
            MINHA SELEÇÃO
          </div>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '22px',
            letterSpacing: '6px',
            color: '#009c3b',
            marginTop: '4px',
          }}>
            COPA DO MUNDO 2026
          </div>
          <div style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
            marginTop: '6px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}>
            Convocado por {nomeUsuario}
          </div>
        </div>

        {/* Jogadores por posição */}
        {(Object.entries(grouped) as [string, Jogador[]][]).map(([posicao, lista]) => {
          if (lista.length === 0) return null;
          return (
            <div key={posicao} style={{ marginBottom: '20px' }}>
              {/* Label da posição */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
              }}>
                <div style={{
                  width: '4px',
                  height: '20px',
                  background: POSICAO_COR[posicao] || '#fff',
                  borderRadius: '2px',
                }} />
                <span style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '15px',
                  letterSpacing: '3px',
                  color: POSICAO_COR[posicao] || '#fff',
                }}>
                  {posicao === 'Defensor' ? 'Defensores' :
                   posicao === 'Goleiro' ? 'Goleiros' :
                   posicao === 'Meio-campista' ? 'Meio-campistas' : 'Atacantes'}
                  {' '}<span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>({lista.length})</span>
                </span>
              </div>

              {/* Grid de mini-figurinhas */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                {lista.map((j) => (
                  <div
                    key={j.id}
                    style={{
                      background: 'linear-gradient(160deg, #f5f0e8 0%, #ede8db 100%)',
                      borderRadius: '6px',
                      border: '2px solid #fff',
                      boxShadow: '3px 3px 8px rgba(0,0,0,0.4)',
                      width: '72px',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Header mini */}
                    <div style={{ background: '#002776', padding: '2px 4px' }}>
                      <span style={{ color: '#FFDF00', fontSize: '7px', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.5px' }}>
                        🇧🇷 2026
                      </span>
                    </div>
                    {/* Foto mini */}
                    <div style={{ height: '58px', overflow: 'hidden', background: '#c8dff0', position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={j.foto}
                        alt={j.nome}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(j.nome)}&background=009c3b&color=fff&size=100&bold=true&font-size=0.35`;
                        }}
                        crossOrigin="anonymous"
                      />
                    </div>
                    {/* Nome mini */}
                    <div style={{ background: '#002776', padding: '2px 3px', textAlign: 'center' }}>
                      <div style={{
                        color: '#fff',
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '8px',
                        letterSpacing: '0.3px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.2,
                      }}>
                        {j.nome}
                      </div>
                      <div style={{
                        color: '#FFDF00',
                        fontSize: '6px',
                        fontFamily: 'Barlow, sans-serif',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        opacity: 0.85,
                      }}>
                        {j.clube}
                      </div>
                    </div>
                    {/* Rodapé mini */}
                    <div style={{ background: '#009c3b', padding: '1px 3px', textAlign: 'center' }}>
                      <span style={{ color: '#FFDF00', fontFamily: 'Bebas Neue, sans-serif', fontSize: '8px' }}>
                        #{j.numero}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255,223,0,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '2px',
          }}>
            MONTE SUA SELEÇÃO • 2026
          </div>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '12px',
            color: '#FFDF00',
            letterSpacing: '2px',
          }}>
            {jogadores.length}/26 CONVOCADOS
          </div>
        </div>
      </div>
    </div>
  );
}
