'use client';

import { Jogador } from '@/data/jogadores';
import Image from 'next/image';

const POSICAO_CORES: Record<string, { bg: string; text: string; label: string }> = {
  'Goleiro': { bg: '#f59e0b', text: '#fff', label: 'GOL' },
  'Defensor': { bg: '#2563eb', text: '#fff', label: 'DEF' },
  'Meio-campista': { bg: '#7c3aed', text: '#fff', label: 'MEI' },
  'Atacante': { bg: '#dc2626', text: '#fff', label: 'ATA' },
};

interface Props {
  jogador: Jogador;
  selecionado: boolean;
  onToggle: (id: number) => void;
  podeSelecionar: boolean;
}

export default function JogadorCard({ jogador, selecionado, onToggle, podeSelecionar }: Props) {
  const pos = POSICAO_CORES[jogador.posicao] || POSICAO_CORES['Defensor'];

  const handleClick = () => {
    if (!podeSelecionar && !selecionado) return;
    onToggle(jogador.id);
  };

  return (
    <div
      className={`sticker ${selecionado ? 'selected' : ''} ${!podeSelecionar && !selecionado ? 'opacity-60 cursor-not-allowed' : ''}`}
      onClick={handleClick}
      style={{ width: '140px', userSelect: 'none' }}
    >
      {/* Header da figurinha */}
      <div className="sticker-header flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Bandeira do Brasil */}
          <span style={{ fontSize: '14px' }}>🇧🇷</span>
          <span style={{ color: '#FFDF00', fontSize: '10px', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '1px' }}>
            BRASIL 2026
          </span>
        </div>
        <span
          style={{
            background: pos.bg,
            color: pos.text,
            fontSize: '9px',
            fontFamily: 'Bebas Neue, sans-serif',
            padding: '2px 5px',
            borderRadius: '3px',
            letterSpacing: '0.5px',
          }}
        >
          {pos.label}
        </span>
      </div>

      {/* Foto do jogador */}
      <div className="sticker-img" style={{ height: '110px', position: 'relative' }}>
        <Image
          src={jogador.foto}
          alt={jogador.nome}
          fill
          style={{ objectFit: 'cover', objectPosition: 'top center' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(jogador.nome)}&background=009c3b&color=fff&size=200&bold=true&font-size=0.35`;
          }}
          unoptimized
        />
        {/* Número overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            left: '4px',
            background: 'rgba(0,39,118,0.85)',
            color: '#FFDF00',
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '20px',
            lineHeight: 1,
            padding: '2px 6px',
            borderRadius: '3px',
          }}
        >
          {jogador.numero}
        </div>
      </div>

      {/* Nome */}
      <div
        style={{
          background: 'linear-gradient(135deg, #002776 0%, #001a55 100%)',
          padding: '4px 6px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: '#fff',
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '13px',
            letterSpacing: '0.5px',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {jogador.nome}
        </div>
        <div
          style={{
            color: '#FFDF00',
            fontSize: '9px',
            fontFamily: 'Barlow, sans-serif',
            letterSpacing: '0.3px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            opacity: 0.9,
          }}
        >
          {jogador.clube}
        </div>
      </div>

      {/* Stats footer */}
      <div className="sticker-footer" style={{ display: 'flex', justifyContent: 'space-around', padding: '4px 6px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#FFDF00', fontFamily: 'Bebas Neue, sans-serif', fontSize: '13px', lineHeight: 1 }}>
            {jogador.caps}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', fontFamily: 'Barlow, sans-serif' }}>JOGOS</div>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#FFDF00', fontFamily: 'Bebas Neue, sans-serif', fontSize: '13px', lineHeight: 1 }}>
            {jogador.gols}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', fontFamily: 'Barlow, sans-serif' }}>GOLS</div>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#FFDF00', fontFamily: 'Bebas Neue, sans-serif', fontSize: '13px', lineHeight: 1 }}>
            {jogador.idade}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', fontFamily: 'Barlow, sans-serif' }}>ANOS</div>
        </div>
      </div>

      {/* Overlay de selecionado */}
      <div className="check-overlay">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', lineHeight: 1 }}>✓</div>
          <div style={{ color: '#FFDF00', fontFamily: 'Bebas Neue, sans-serif', fontSize: '11px', marginTop: '2px' }}>
            CONVOCADO
          </div>
        </div>
      </div>
    </div>
  );
}
