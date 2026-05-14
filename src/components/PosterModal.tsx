'use client';

import { Jogador } from '@/data/jogadores';
import { useState } from 'react';

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
  'Goleiro': 'GOLEIROS',
  'Defensor': 'DEFENSORES',
  'Meio-campista': 'MEIO-CAMPISTAS',
  'Atacante': 'ATACANTES',
};

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      const fallback = new Image();
      fallback.crossOrigin = 'anonymous';
      fallback.onload = () => resolve(fallback);
      fallback.onerror = () => resolve(fallback);
      fallback.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(src)}&background=009c3b&color=fff&size=200&bold=true&font-size=0.35`;
    };
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function gerarCanvas(jogadores: Jogador[], nomeUsuario: string): Promise<HTMLCanvasElement> {
  const CARD_W = 80;
  const CARD_H = 110;
  const CARD_GAP = 8;
  const PADDING = 28;
  const SECTION_GAP = 18;
  const HEADER_H = 90;
  const LABEL_H = 22;
  const FOOTER_H = 36;
  const CANVAS_W = 900;

  const grouped: [string, Jogador[]][] = [
    ['Goleiro', jogadores.filter(j => j.posicao === 'Goleiro')],
    ['Defensor', jogadores.filter(j => j.posicao === 'Defensor')],
    ['Meio-campista', jogadores.filter(j => j.posicao === 'Meio-campista')],
    ['Atacante', jogadores.filter(j => j.posicao === 'Atacante')],
  ].filter(([, l]) => (l as Jogador[]).length > 0) as [string, Jogador[]][];

  // Calcula altura total
  let totalH = PADDING + HEADER_H;
  for (const [, lista] of grouped) {
    const cols = Math.floor((CANVAS_W - PADDING * 2) / (CARD_W + CARD_GAP));
    const rows = Math.ceil((lista as Jogador[]).length / cols);
    totalH += SECTION_GAP + LABEL_H + rows * (CARD_H + CARD_GAP);
  }
  totalH += PADDING + FOOTER_H;

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W * 2;
  canvas.height = totalH * 2;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(2, 2);

  // Fundo
  const bgGrad = ctx.createLinearGradient(0, 0, CANVAS_W, totalH);
  bgGrad.addColorStop(0, '#001a10');
  bgGrad.addColorStop(0.5, '#002d1a');
  bgGrad.addColorStop(1, '#001a10');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CANVAS_W, totalH);

  // Borda amarela
  ctx.strokeStyle = '#FFDF00';
  ctx.lineWidth = 5;
  roundRect(ctx, 3, 3, CANVAS_W - 6, totalH - 6, 10);
  ctx.stroke();

  // ── HEADER ──
  let y = PADDING;

  // Linha decorativa esquerda
  const lineGrad1 = ctx.createLinearGradient(PADDING, 0, CANVAS_W / 2 - 20, 0);
  lineGrad1.addColorStop(0, 'rgba(255,223,0,0)');
  lineGrad1.addColorStop(1, 'rgba(255,223,0,0.6)');
  ctx.strokeStyle = lineGrad1;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING, y + 12);
  ctx.lineTo(CANVAS_W / 2 - 22, y + 12);
  ctx.stroke();

  // Estrela
  ctx.font = '22px serif';
  ctx.fillText('⭐', CANVAS_W / 2 - 11, y + 18);

  // Linha direita
  const lineGrad2 = ctx.createLinearGradient(CANVAS_W / 2 + 20, 0, CANVAS_W - PADDING, 0);
  lineGrad2.addColorStop(0, 'rgba(255,223,0,0.6)');
  lineGrad2.addColorStop(1, 'rgba(255,223,0,0)');
  ctx.strokeStyle = lineGrad2;
  ctx.beginPath();
  ctx.moveTo(CANVAS_W / 2 + 22, y + 12);
  ctx.lineTo(CANVAS_W - PADDING, y + 12);
  ctx.stroke();

  y += 28;

  // Título
  ctx.fillStyle = '#FFDF00';
  ctx.font = 'bold 36px "Bebas Neue", Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MINHA SELEÇÃO', CANVAS_W / 2, y);
  y += 24;

  ctx.fillStyle = '#009c3b';
  ctx.font = '16px "Bebas Neue", Impact, sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('COPA DO MUNDO 2026', CANVAS_W / 2, y);
  y += 18;

  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '11px Barlow, Arial, sans-serif';
  ctx.fillText(`CONVOCADO POR ${nomeUsuario.toUpperCase()}`, CANVAS_W / 2, y);
  y += 16;

  // Linha separadora
  ctx.strokeStyle = 'rgba(255,223,0,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING, y);
  ctx.lineTo(CANVAS_W - PADDING, y);
  ctx.stroke();

  // ── SEÇÕES POR POSIÇÃO ──
  for (const [posicao, lista] of grouped) {
    y += SECTION_GAP;
    const cor = POSICAO_COR[posicao];

    // Barra colorida + label
    ctx.fillStyle = cor;
    ctx.fillRect(PADDING, y + 2, 3, 14);

    ctx.fillStyle = cor;
    ctx.font = '12px "Bebas Neue", Impact, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${POSICAO_LABEL[posicao]}  (${lista.length})`, PADDING + 8, y + 14);

    y += LABEL_H;

    // Cards
    const cols = Math.floor((CANVAS_W - PADDING * 2) / (CARD_W + CARD_GAP));
    let col = 0;
    let rowStartY = y;

    for (const jogador of lista) {
      const cx = PADDING + col * (CARD_W + CARD_GAP);
      const cy = rowStartY;

      // Fundo do card (papel)
      const cardGrad = ctx.createLinearGradient(cx, cy, cx, cy + CARD_H);
      cardGrad.addColorStop(0, '#f5f0e8');
      cardGrad.addColorStop(1, '#ede8db');
      ctx.fillStyle = cardGrad;
      roundRect(ctx, cx, cy, CARD_W, CARD_H, 5);
      ctx.fill();

      // Borda branca
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      roundRect(ctx, cx, cy, CARD_W, CARD_H, 5);
      ctx.stroke();

      // Sombra simulada
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Header azul
      const HEADER_CARD = 14;
      ctx.fillStyle = '#002776';
      ctx.beginPath();
      ctx.moveTo(cx + 5, cy);
      ctx.lineTo(cx + CARD_W - 5, cy);
      ctx.quadraticCurveTo(cx + CARD_W, cy, cx + CARD_W, cy + 5);
      ctx.lineTo(cx + CARD_W, cy + HEADER_CARD);
      ctx.lineTo(cx, cy + HEADER_CARD);
      ctx.lineTo(cx, cy + 5);
      ctx.quadraticCurveTo(cx, cy, cx + 5, cy);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFDF00';
      ctx.font = '6px "Bebas Neue", Impact, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🇧🇷 26', cx + 4, cy + 10);
      ctx.textAlign = 'right';
      ctx.fillText(`#${jogador.numero}`, cx + CARD_W - 4, cy + 10);

      // Foto
      const IMG_H = 56;
      const imgY = cy + HEADER_CARD;
      try {
        const img = await loadImage(jogador.foto);
        ctx.save();
        ctx.beginPath();
        ctx.rect(cx, imgY, CARD_W, IMG_H);
        ctx.clip();
        // Proporção: cobrir área mantendo aspect ratio
        const scale = Math.max(CARD_W / img.width, IMG_H / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = cx + (CARD_W - dw) / 2;
        const dy = imgY;
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
      } catch {
        ctx.fillStyle = '#c8dff0';
        ctx.fillRect(cx, imgY, CARD_W, IMG_H);
      }

      // Nome + clube
      const NAME_Y = imgY + IMG_H;
      const NAME_H = 22;
      ctx.fillStyle = '#002776';
      ctx.fillRect(cx, NAME_Y, CARD_W, NAME_H);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7.5px "Bebas Neue", Impact, sans-serif';
      ctx.textAlign = 'center';
      // Trunca nome se necessário
      let nome = jogador.nome;
      while (ctx.measureText(nome).width > CARD_W - 6 && nome.length > 3) {
        nome = nome.slice(0, -1);
      }
      ctx.fillText(nome, cx + CARD_W / 2, NAME_Y + 9);

      ctx.fillStyle = '#FFDF00';
      ctx.font = '5.5px Barlow, Arial, sans-serif';
      let clube = jogador.clube;
      while (ctx.measureText(clube).width > CARD_W - 6 && clube.length > 3) {
        clube = clube.slice(0, -1);
      }
      ctx.fillText(clube, cx + CARD_W / 2, NAME_Y + 18);

      // Footer verde
      const FOOT_H = 14;
      const FOOT_Y = NAME_Y + NAME_H;
      ctx.fillStyle = '#009c3b';
      ctx.beginPath();
      ctx.moveTo(cx, FOOT_Y);
      ctx.lineTo(cx + CARD_W, FOOT_Y);
      ctx.lineTo(cx + CARD_W, FOOT_Y + FOOT_H - 5);
      ctx.quadraticCurveTo(cx + CARD_W, FOOT_Y + FOOT_H, cx + CARD_W - 5, FOOT_Y + FOOT_H);
      ctx.lineTo(cx + 5, FOOT_Y + FOOT_H);
      ctx.quadraticCurveTo(cx, FOOT_Y + FOOT_H, cx, FOOT_Y + FOOT_H - 5);
      ctx.lineTo(cx, FOOT_Y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFDF00';
      ctx.font = '7px "Bebas Neue", Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(posicao === 'Goleiro' ? 'GOL' : posicao === 'Defensor' ? 'DEF' : posicao === 'Meio-campista' ? 'MEI' : 'ATA', cx + CARD_W / 2, FOOT_Y + 10);

      col++;
      if (col >= cols) {
        col = 0;
        rowStartY += CARD_H + CARD_GAP;
      }
    }

    // Avança y para após a última linha de cards
    const rows = Math.ceil(lista.length / cols);
    y = rowStartY + (col === 0 ? 0 : CARD_H + CARD_GAP);
    if (col === 0) y = rowStartY;
    else y = rowStartY + CARD_H + CARD_GAP;
    // Simplificado:
    y = PADDING + HEADER_H;
    // Recalcula posição atual acumulada
  }

  // ── RECALCULA y CORRETAMENTE ──
  // (refaz o loop apenas para calcular y final)
  y = PADDING + HEADER_H + 16;
  for (const [, lista] of grouped) {
    const cols = Math.floor((CANVAS_W - PADDING * 2) / (CARD_W + CARD_GAP));
    const rows = Math.ceil((lista as Jogador[]).length / cols);
    y += SECTION_GAP + LABEL_H + rows * (CARD_H + CARD_GAP);
  }

  // Footer
  ctx.strokeStyle = 'rgba(255,223,0,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING, y);
  ctx.lineTo(CANVAS_W - PADDING, y);
  ctx.stroke();
  y += 10;

  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = '9px Barlow, Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('MONTE SUA SELEÇÃO • 2026', PADDING, y + 12);

  ctx.fillStyle = 'rgba(255,223,0,0.5)';
  ctx.textAlign = 'right';
  ctx.fillText(`${jogadores.length}/26 CONVOCADOS`, CANVAS_W - PADDING, y + 12);

  return canvas;
}

export default function PosterModal({ jogadores, nomeUsuario, onClose }: Props) {
  const [gerando, setGerando] = useState(false);

  const handleDownload = async () => {
    setGerando(true);
    try {
      const canvas = await gerarCanvas(jogadores, nomeUsuario);
      const link = document.createElement('a');
      link.download = `minha-selecao-${nomeUsuario.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar imagem.');
    } finally {
      setGerando(false);
    }
  };

  const grouped: [string, Jogador[]][] = [
    ['Goleiro', jogadores.filter(j => j.posicao === 'Goleiro')],
    ['Defensor', jogadores.filter(j => j.posicao === 'Defensor')],
    ['Meio-campista', jogadores.filter(j => j.posicao === 'Meio-campista')],
    ['Atacante', jogadores.filter(j => j.posicao === 'Atacante')],
  ].filter(([, l]) => (l as Jogador[]).length > 0) as [string, Jogador[]][];

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.92)',
      zIndex: 1000, overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '24px 16px', gap: '20px',
    }}>
      {/* Botões */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={handleDownload} disabled={gerando} style={{
          background: '#FFDF00', color: '#002776', border: 'none',
          borderRadius: '8px', padding: '12px 28px',
          fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px',
          letterSpacing: '1px', cursor: gerando ? 'wait' : 'pointer',
          boxShadow: '0 4px 16px rgba(255,223,0,0.4)', opacity: gerando ? 0.7 : 1,
        }}>
          {gerando ? 'GERANDO...' : '⬇ BAIXAR IMAGEM'}
        </button>
        <button onClick={onClose} style={{
          background: 'transparent', color: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px',
          padding: '12px 28px', fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '18px', letterSpacing: '1px', cursor: 'pointer',
        }}>
          ✕ FECHAR
        </button>
      </div>

      {/* Preview HTML (só visual, não é capturado) */}
      <div style={{
        background: 'linear-gradient(160deg, #001a10 0%, #002d1a 50%, #001a10 100%)',
        border: '5px solid #FFDF00', borderRadius: '12px',
        padding: '20px', maxWidth: '860px', width: '100%',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,223,0,0.2)' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: '#FFDF00', letterSpacing: '3px', lineHeight: 1 }}>⭐ MINHA SELEÇÃO</div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: '#009c3b', letterSpacing: '5px' }}>COPA DO MUNDO 2026</div>
          <div style={{ fontFamily: 'Barlow, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginTop: '4px' }}>
            CONVOCADO POR {nomeUsuario.toUpperCase()}
          </div>
        </div>

        {/* Jogadores */}
        {grouped.map(([posicao, lista]) => (
          <div key={posicao} style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <div style={{ width: '3px', height: '14px', background: POSICAO_COR[posicao], borderRadius: '2px' }} />
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '11px', letterSpacing: '3px', color: POSICAO_COR[posicao] }}>
                {POSICAO_LABEL[posicao]} ({lista.length})
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {lista.map(j => (
                <div key={j.id} style={{
                  background: 'linear-gradient(160deg, #f5f0e8, #ede8db)',
                  borderRadius: '5px', border: '2px solid #fff',
                  width: '64px', overflow: 'hidden',
                  boxShadow: '2px 2px 6px rgba(0,0,0,0.4)',
                }}>
                  <div style={{ background: '#002776', padding: '2px 3px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#FFDF00', fontSize: '6px', fontFamily: 'Bebas Neue, sans-serif' }}>🇧🇷 26</span>
                    <span style={{ color: '#FFDF00', fontSize: '6px', fontFamily: 'Bebas Neue, sans-serif' }}>#{j.numero}</span>
                  </div>
                  <div style={{ height: '48px', overflow: 'hidden', background: '#c8dff0' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={j.foto} alt={j.nome} crossOrigin="anonymous"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(j.nome)}&background=009c3b&color=fff&size=100`; }}
                    />
                  </div>
                  <div style={{ background: '#002776', padding: '2px 3px', textAlign: 'center' }}>
                    <div style={{ color: '#fff', fontFamily: 'Bebas Neue, sans-serif', fontSize: '7px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.nome}</div>
                    <div style={{ color: '#FFDF00', fontSize: '5px', fontFamily: 'Barlow, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.9 }}>{j.clube}</div>
                  </div>
                  <div style={{ background: '#009c3b', padding: '1px 3px', textAlign: 'center' }}>
                    <span style={{ color: '#FFDF00', fontFamily: 'Bebas Neue, sans-serif', fontSize: '7px' }}>
                      {posicao === 'Goleiro' ? 'GOL' : posicao === 'Defensor' ? 'DEF' : posicao === 'Meio-campista' ? 'MEI' : 'ATA'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}