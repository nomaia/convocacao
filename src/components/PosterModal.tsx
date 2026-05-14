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

const POSICAO_SHORT: Record<string, string> = {
  'Goleiro': 'GOL',
  'Defensor': 'DEF',
  'Meio-campista': 'MEI',
  'Atacante': 'ATA',
};

async function loadImage(src: string, fallbackName: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const tryLoad = (url: string, isFallback = false) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        if (!isFallback) {
          tryLoad(
            `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=009c3b&color=fff&size=200&bold=true&font-size=0.35`,
            true
          );
        } else {
          resolve(img);
        }
      };
      img.src = url;
    };
    tryLoad(src);
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number
) {
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

function truncate(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '…').width > maxWidth) {
    t = t.slice(0, -1);
  }
  return t + '…';
}

async function gerarCanvas(jogadores: Jogador[], nomeUsuario: string): Promise<HTMLCanvasElement> {
  const SCALE = 2;
  const CANVAS_W = 960;
  const PADDING = 28;
  const CARD_W = 92;
  const CARD_GAP = 7;
  const COLS = Math.floor((CANVAS_W - PADDING * 2) / (CARD_W + CARD_GAP));

  const CARD_HEADER_H = 16;
  const CARD_IMG_H = 60;
  const CARD_NAME_H = 28;
  const CARD_FOOT_H = 14;
  const CARD_H = CARD_HEADER_H + CARD_IMG_H + CARD_NAME_H + CARD_FOOT_H;

  const HEADER_H = 110;
  const SECTION_LABEL_H = 24;
  const SECTION_GAP = 16;
  const FOOTER_H = 40;

  const grouped: Array<{ posicao: string; lista: Jogador[] }> = [
    { posicao: 'Goleiro', lista: jogadores.filter(j => j.posicao === 'Goleiro') },
    { posicao: 'Defensor', lista: jogadores.filter(j => j.posicao === 'Defensor') },
    { posicao: 'Meio-campista', lista: jogadores.filter(j => j.posicao === 'Meio-campista') },
    { posicao: 'Atacante', lista: jogadores.filter(j => j.posicao === 'Atacante') },
  ].filter(g => g.lista.length > 0);

  // Calcula altura total
  let totalH = PADDING + HEADER_H;
  for (const { lista } of grouped) {
    const rows = Math.ceil(lista.length / COLS);
    totalH += SECTION_GAP + SECTION_LABEL_H + rows * (CARD_H + CARD_GAP);
  }
  totalH += FOOTER_H + PADDING;

  // Cria canvas
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W * SCALE;
  canvas.height = totalH * SCALE;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(SCALE, SCALE);

  // ── Fundo ──
  const bg = ctx.createLinearGradient(0, 0, 0, totalH);
  bg.addColorStop(0, '#001a10');
  bg.addColorStop(0.5, '#002d1a');
  bg.addColorStop(1, '#001a10');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_W, totalH);

  // ── Borda ──
  ctx.strokeStyle = '#FFDF00';
  ctx.lineWidth = 5;
  roundRect(ctx, 3, 3, CANVAS_W - 6, totalH - 6, 10);
  ctx.stroke();

  // ── Header ──
  let curY = PADDING;

  // Linha esquerda
  const lg1 = ctx.createLinearGradient(PADDING, 0, CANVAS_W / 2 - 22, 0);
  lg1.addColorStop(0, 'rgba(255,223,0,0)');
  lg1.addColorStop(1, 'rgba(255,223,0,0.5)');
  ctx.strokeStyle = lg1;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING, curY + 12);
  ctx.lineTo(CANVAS_W / 2 - 22, curY + 12);
  ctx.stroke();

  // Estrela
  ctx.font = '20px serif';
  ctx.textAlign = 'center';
  ctx.fillText('⭐', CANVAS_W / 2, curY + 16);

  // Linha direita
  const lg2 = ctx.createLinearGradient(CANVAS_W / 2 + 22, 0, CANVAS_W - PADDING, 0);
  lg2.addColorStop(0, 'rgba(255,223,0,0.5)');
  lg2.addColorStop(1, 'rgba(255,223,0,0)');
  ctx.strokeStyle = lg2;
  ctx.beginPath();
  ctx.moveTo(CANVAS_W / 2 + 22, curY + 12);
  ctx.lineTo(CANVAS_W - PADDING, curY + 12);
  ctx.stroke();

  curY += 28;

  ctx.fillStyle = '#FFDF00';
  ctx.font = '42px Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MINHA SELEÇÃO', CANVAS_W / 2, curY);
  curY += 26;

  ctx.fillStyle = '#009c3b';
  ctx.font = '18px Impact, sans-serif';
  ctx.fillText('COPA DO MUNDO 2026', CANVAS_W / 2, curY);
  curY += 18;

  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '12px Arial, sans-serif';
  ctx.fillText(`CONVOCADO POR ${nomeUsuario.toUpperCase()}`, CANVAS_W / 2, curY);
  curY += 16;

  // Linha separadora
  ctx.strokeStyle = 'rgba(255,223,0,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING, curY);
  ctx.lineTo(CANVAS_W - PADDING, curY);
  ctx.stroke();

  // ── Seções ──
  for (const { posicao, lista } of grouped) {
    curY += SECTION_GAP;

    // Label da posição
    ctx.fillStyle = POSICAO_COR[posicao];
    ctx.fillRect(PADDING, curY + 4, 3, 14);
    ctx.font = '13px Impact, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${POSICAO_LABEL[posicao]}  (${lista.length})`, PADDING + 8, curY + 16);
    curY += SECTION_LABEL_H;

    // Cards
    for (let i = 0; i < lista.length; i++) {
      const j = lista[i];
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const cx = PADDING + col * (CARD_W + CARD_GAP);
      const cy = curY + row * (CARD_H + CARD_GAP);

      // Papel (fundo card)
      const cardBg = ctx.createLinearGradient(cx, cy, cx, cy + CARD_H);
      cardBg.addColorStop(0, '#f5f0e8');
      cardBg.addColorStop(1, '#ede8db');
      ctx.fillStyle = cardBg;
      roundRect(ctx, cx, cy, CARD_W, CARD_H, 5);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      roundRect(ctx, cx, cy, CARD_W, CARD_H, 5);
      ctx.stroke();

      // Header do card (azul)
      const hy = cy;
      ctx.fillStyle = '#002776';
      ctx.beginPath();
      ctx.moveTo(cx + 5, hy);
      ctx.lineTo(cx + CARD_W - 5, hy);
      ctx.quadraticCurveTo(cx + CARD_W, hy, cx + CARD_W, hy + 5);
      ctx.lineTo(cx + CARD_W, hy + CARD_HEADER_H);
      ctx.lineTo(cx, hy + CARD_HEADER_H);
      ctx.lineTo(cx, hy + 5);
      ctx.quadraticCurveTo(cx, hy, cx + 5, hy);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFDF00';
      ctx.font = '7px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🇧🇷 26', cx + 4, hy + 11);
      ctx.textAlign = 'right';
      ctx.fillText(`#${j.numero}`, cx + CARD_W - 4, hy + 11);

      // Foto
      const imgY = cy + CARD_HEADER_H;
      const img = await loadImage(j.foto, j.nome);
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx, imgY, CARD_W, CARD_IMG_H);
      ctx.clip();
      const sc = Math.max(CARD_W / img.width, CARD_IMG_H / img.height);
      const dw = img.width * sc;
      const dh = img.height * sc;
      ctx.drawImage(img, cx + (CARD_W - dw) / 2, imgY, dw, dh);
      ctx.restore();

      // Área nome
      const nameY = cy + CARD_HEADER_H + CARD_IMG_H;
      ctx.fillStyle = '#002776';
      ctx.fillRect(cx, nameY, CARD_W, CARD_NAME_H);

      const maxW = CARD_W - 8;

      // Nome — tenta caber em 1 linha, senão quebra em 2
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      const nomeCompleto = j.nome;
      ctx.font = 'bold 9px Impact, sans-serif';

      if (ctx.measureText(nomeCompleto).width <= maxW) {
        // Cabe em 1 linha
        ctx.fillText(nomeCompleto, cx + CARD_W / 2, nameY + 12);
      } else {
        // Divide em 2 partes
        const words = nomeCompleto.split(' ');
        let l1 = '';
        let l2 = '';
        for (const w of words) {
          const test = l1 ? l1 + ' ' + w : w;
          if (!l2 && ctx.measureText(test).width <= maxW) {
            l1 = test;
          } else {
            l2 = l2 ? l2 + ' ' + w : w;
          }
        }
        // Se l2 ainda não cabe, trunca
        ctx.font = 'bold 8px Impact, sans-serif';
        l2 = truncate(ctx, l2, maxW);
        ctx.fillText(l1, cx + CARD_W / 2, nameY + 9);
        ctx.fillText(l2, cx + CARD_W / 2, nameY + 18);
      }

      // Clube
      ctx.fillStyle = '#FFDF00';
      ctx.font = '6.5px Arial, sans-serif';
      ctx.fillText(truncate(ctx, j.clube, maxW), cx + CARD_W / 2, nameY + CARD_NAME_H - 3);

      // Footer verde
      const footY = nameY + CARD_NAME_H;
      ctx.fillStyle = '#009c3b';
      ctx.beginPath();
      ctx.moveTo(cx, footY);
      ctx.lineTo(cx + CARD_W, footY);
      ctx.lineTo(cx + CARD_W, footY + CARD_FOOT_H - 5);
      ctx.quadraticCurveTo(cx + CARD_W, footY + CARD_FOOT_H, cx + CARD_W - 5, footY + CARD_FOOT_H);
      ctx.lineTo(cx + 5, footY + CARD_FOOT_H);
      ctx.quadraticCurveTo(cx, footY + CARD_FOOT_H, cx, footY + CARD_FOOT_H - 5);
      ctx.lineTo(cx, footY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFDF00';
      ctx.font = 'bold 8px Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(POSICAO_SHORT[posicao], cx + CARD_W / 2, footY + 10);
    }

    // Avança curY para após os cards desta seção
    const rows = Math.ceil(lista.length / COLS);
    curY += rows * (CARD_H + CARD_GAP);
  }

  // ── Footer ──
  curY += 8;
  ctx.strokeStyle = 'rgba(255,223,0,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING, curY);
  ctx.lineTo(CANVAS_W - PADDING, curY);
  ctx.stroke();
  curY += 14;

  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = '10px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('MONTE SUA SELEÇÃO • 2026', PADDING, curY);

  ctx.fillStyle = 'rgba(255,223,0,0.5)';
  ctx.textAlign = 'right';
  ctx.fillText(`${jogadores.length}/26 CONVOCADOS`, CANVAS_W - PADDING, curY);

  return canvas;
}

export default function PosterModal({ jogadores, nomeUsuario, onClose }: Props) {
  const [gerando, setGerando] = useState(false);

  const grouped = [
    { posicao: 'Goleiro', lista: jogadores.filter(j => j.posicao === 'Goleiro') },
    { posicao: 'Defensor', lista: jogadores.filter(j => j.posicao === 'Defensor') },
    { posicao: 'Meio-campista', lista: jogadores.filter(j => j.posicao === 'Meio-campista') },
    { posicao: 'Atacante', lista: jogadores.filter(j => j.posicao === 'Atacante') },
  ].filter(g => g.lista.length > 0);

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

      {/* Preview */}
      <div style={{
        background: 'linear-gradient(160deg, #001a10, #002d1a, #001a10)',
        border: '5px solid #FFDF00', borderRadius: '12px',
        padding: '20px', maxWidth: '860px', width: '100%',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,223,0,0.2)' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: '#FFDF00', letterSpacing: '3px' }}>⭐ MINHA SELEÇÃO</div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: '#009c3b', letterSpacing: '5px' }}>COPA DO MUNDO 2026</div>
          <div style={{ fontFamily: 'Barlow, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginTop: '4px' }}>
            CONVOCADO POR {nomeUsuario.toUpperCase()}
          </div>
        </div>

        {grouped.map(({ posicao, lista }) => (
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
                    <span style={{ color: '#FFDF00', fontSize: '6px', fontFamily: 'Bebas Neue, sans-serif' }}>🇧🇷</span>
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
                    <div style={{ color: '#FFDF00', fontSize: '5px', fontFamily: 'Barlow, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.clube}</div>
                  </div>
                  <div style={{ background: '#009c3b', padding: '1px 3px', textAlign: 'center' }}>
                    <span style={{ color: '#FFDF00', fontFamily: 'Bebas Neue, sans-serif', fontSize: '7px' }}>
                      {POSICAO_SHORT[posicao]}
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