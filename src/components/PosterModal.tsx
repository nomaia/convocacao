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

async function loadImage(jogador: Jogador): Promise<HTMLImageElement> {
  const slug = jogador.nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const base = `/players/${jogador.id}-${slug}`;

  const tryUrl = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

  // Tenta jpg, depois png, depois foto remota, depois avatar
  for (const url of [
    base + '.jpg',
    base + '.png',
    jogador.foto,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(jogador.nome)}&background=009c3b&color=fff&size=200&bold=true`,
  ]) {
    try {
      return await tryUrl(url);
    } catch {
      continue;
    }
  }
  return new Image(); // nunca deve chegar aqui
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
  const W = 960;
  const PAD = 28;
  const CW = 90;   // card width
  const CH_HDR = 15;
  const CH_IMG = 58;
  const CH_NAM = 26;
  const CH_FT = 13;
  const CARD_H = CH_HDR + CH_IMG + CH_NAM + CH_FT;
  const GAP = 7;
  const COLS = Math.floor((W - PAD * 2 + GAP) / (CW + GAP));

  const grouped = [
    { pos: 'Goleiro', label: 'GOLEIROS', cor: '#f59e0b', short: 'GOL', lista: jogadores.filter(j => j.posicao === 'Goleiro') },
    { pos: 'Defensor', label: 'DEFENSORES', cor: '#3b82f6', short: 'DEF', lista: jogadores.filter(j => j.posicao === 'Defensor') },
    { pos: 'Meio-campista', label: 'MEIO-CAMPISTAS', cor: '#8b5cf6', short: 'MEI', lista: jogadores.filter(j => j.posicao === 'Meio-campista') },
    { pos: 'Atacante', label: 'ATACANTES', cor: '#ef4444', short: 'ATA', lista: jogadores.filter(j => j.posicao === 'Atacante') },
  ].filter(g => g.lista.length > 0);

  // 1. Calcula altura total primeiro
  let totalH = PAD + 110; // header
  for (const g of grouped) {
    const rows = Math.ceil(g.lista.length / COLS);
    totalH += 20 + 22 + rows * (CARD_H + GAP);
  }
  totalH += 40 + PAD;

  // 2. Cria canvas
  const canvas = document.createElement('canvas');
  canvas.width = W * SCALE;
  canvas.height = totalH * SCALE;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(SCALE, SCALE);

  // 3. Fundo
  ctx.fillStyle = '#002010';
  ctx.fillRect(0, 0, W, totalH);

  // 4. Borda
  ctx.strokeStyle = '#FFDF00';
  ctx.lineWidth = 5;
  roundRect(ctx, 3, 3, W - 6, totalH - 6, 10);
  ctx.stroke();

  // 5. Header
  let Y = PAD + 10;
  ctx.fillStyle = '#FFDF00';
  ctx.font = 'bold 40px Impact';
  ctx.textAlign = 'center';
  ctx.fillText('MINHA SELECAO', W / 2, Y);
  Y += 28;

  ctx.fillStyle = '#009c3b';
  ctx.font = 'bold 18px Impact';
  ctx.fillText('COPA DO MUNDO 2026', W / 2, Y);
  Y += 20;

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '13px Arial';
  ctx.fillText('CONVOCADO POR ' + nomeUsuario.toUpperCase(), W / 2, Y);
  Y += 20;

  ctx.strokeStyle = 'rgba(255,223,0,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, Y);
  ctx.lineTo(W - PAD, Y);
  ctx.stroke();
  Y += 4;

  // 6. Seções
  for (const g of grouped) {
    Y += 16;

    // Label
    ctx.fillStyle = g.cor;
    ctx.fillRect(PAD, Y, 3, 15);
    ctx.font = 'bold 13px Impact';
    ctx.textAlign = 'left';
    ctx.fillText(g.label + '  (' + g.lista.length + ')', PAD + 8, Y + 13);
    Y += 22;

    // Desenha cards
    for (let i = 0; i < g.lista.length; i++) {
      const j = g.lista[i];
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const X = PAD + col * (CW + GAP);
      const cardY = Y + row * (CARD_H + GAP);

      // Fundo card (papel)
      ctx.fillStyle = '#f0ebe0';
      roundRect(ctx, X, cardY, CW, CARD_H, 5);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      roundRect(ctx, X, cardY, CW, CARD_H, 5);
      ctx.stroke();

      // Header azul
      ctx.fillStyle = '#002776';
      ctx.fillRect(X, cardY, CW, CH_HDR);
      ctx.fillStyle = '#FFDF00';
      ctx.font = '7px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('BR 26', X + 4, cardY + 11);
      ctx.textAlign = 'right';
      ctx.fillText('#' + j.numero, X + CW - 4, cardY + 11);

      // Foto
      const imgY = cardY + CH_HDR;
      try {
        const img = await loadImage(j);
        ctx.save();
        ctx.beginPath();
        ctx.rect(X, imgY, CW, CH_IMG);
        ctx.clip();
        const sc = Math.max(CW / img.width, CH_IMG / img.height);
        ctx.drawImage(img, X + (CW - img.width * sc) / 2, imgY, img.width * sc, img.height * sc);
        ctx.restore();
      } catch {
        ctx.fillStyle = '#c8dff0';
        ctx.fillRect(X, imgY, CW, CH_IMG);
      }

      // Nome
      const namY = cardY + CH_HDR + CH_IMG;
      ctx.fillStyle = '#002776';
      ctx.fillRect(X, namY, CW, CH_NAM);

      const maxW = CW - 6;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';

      // Tenta 1 linha
      ctx.font = 'bold 9px Impact';
      if (ctx.measureText(j.nome).width <= maxW) {
        ctx.fillText(j.nome, X + CW / 2, namY + 13);
      } else {
        // 2 linhas
        const words = j.nome.split(' ');
        let l1 = '', l2 = '';
        for (const w of words) {
          ctx.font = 'bold 8px Impact';
          if (!l2 && ctx.measureText((l1 ? l1 + ' ' : '') + w).width <= maxW) {
            l1 += (l1 ? ' ' : '') + w;
          } else {
            l2 += (l2 ? ' ' : '') + w;
          }
        }
        ctx.font = 'bold 8px Impact';
        ctx.fillText(l1, X + CW / 2, namY + 9);
        ctx.fillText(truncate(ctx, l2, maxW), X + CW / 2, namY + 19);
      }

      // Clube
      ctx.fillStyle = '#FFDF00';
      ctx.font = '6px Arial';
      ctx.fillText(truncate(ctx, j.clube, maxW), X + CW / 2, namY + CH_NAM - 2);

      // Footer verde
      const ftY = namY + CH_NAM;
      ctx.fillStyle = '#009c3b';
      ctx.fillRect(X, ftY, CW, CH_FT);
      ctx.fillStyle = '#FFDF00';
      ctx.font = 'bold 8px Impact';
      ctx.textAlign = 'center';
      ctx.fillText(g.short, X + CW / 2, ftY + 10);
    }

    // Avança Y após os cards desta seção
    const rows = Math.ceil(g.lista.length / COLS);
    Y += rows * (CARD_H + GAP);
  }

  // Footer
  Y += 10;
  ctx.strokeStyle = 'rgba(255,223,0,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, Y);
  ctx.lineTo(W - PAD, Y);
  ctx.stroke();
  Y += 16;

  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.font = '10px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('MONTE SUA SELECAO • 2026', PAD, Y);

  ctx.fillStyle = 'rgba(255,223,0,0.6)';
  ctx.textAlign = 'right';
  ctx.fillText(jogadores.length + '/26 CONVOCADOS', W - PAD, Y);

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