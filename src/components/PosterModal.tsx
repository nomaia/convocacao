// Nome + clube
const NAME_Y = imgY + IMG_H;
const NAME_H = 26;
ctx.fillStyle = '#002776';
ctx.fillRect(cx, NAME_Y, CARD_W, NAME_H);

// Nome — quebra em duas linhas se necessário
ctx.fillStyle = '#ffffff';
ctx.textAlign = 'center';
const nomeMax = CARD_W - 8;
const nomeParts = jogador.nome.split(' ');
let linha1 = '';
let linha2 = '';
for (const part of nomeParts) {
  const test = linha1 ? linha1 + ' ' + part : part;
  ctx.font = 'bold 8px "Bebas Neue", Impact, sans-serif';
  if (ctx.measureText(test).width <= nomeMax) {
    linha1 = test;
  } else {
    linha2 = linha2 ? linha2 + ' ' + part : part;
  }
}
if (linha2) {
  ctx.font = 'bold 7px "Bebas Neue", Impact, sans-serif';
  ctx.fillText(linha1, cx + CARD_W / 2, NAME_Y + 9);
  ctx.fillText(linha2, cx + CARD_W / 2, NAME_Y + 17);
} else {
  ctx.font = 'bold 8.5px "Bebas Neue", Impact, sans-serif';
  ctx.fillText(linha1, cx + CARD_W / 2, NAME_Y + 13);
}

// Clube
ctx.fillStyle = '#FFDF00';
ctx.font = '6px Barlow, Arial, sans-serif';
let clube = jogador.clube;
while (ctx.measureText(clube).width > nomeMax && clube.length > 3) {
  clube = clube.slice(0, -1);
}
if (clube !== jogador.clube) clube += '…';
ctx.fillText(clube, cx + CARD_W / 2, NAME_Y + 23);