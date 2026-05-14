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
      const el = posterRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#001a10',
        logging: false,
        width: el.scrollWidth,
        height: el.scrollHeight,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
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
            fontFamily: 'Bebas