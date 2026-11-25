# Tour da Casa

Site que mostra a casa por fora; você clica num ambiente, a câmera "voa" até a janela
e entra no cômodo (panorama 360° ou foto comum), com pontos clicáveis para ir aos outros cômodos.
Sem dependências, sem internet: só `index.html` + `config.js` + suas fotos.

## Ver no computador
Dê dois cliques em `iniciar.bat` (precisa do Python instalado). Abre em http://localhost:8080.
> Abrir o `index.html` direto (file://) mostra a fachada, mas o navegador bloqueia as fotos nos panoramas 360°. Use o `iniciar.bat`.

## Colocar suas fotos
1. Copie as imagens para a pasta `fotos/` (jpg ou png).
2. Abra `config.js` e ajuste o `img` de cada cômodo (`fotos/sala.jpg` etc.), os textos e os nomes.
   Enquanto uma foto não existir, aparece uma imagem de exemplo no lugar.
3. Para cada cômodo escolha o `tipo`:
   - `'pano'`: panorama 360° (proporção 2:1, "equiretangular"). Dá para olhar em todas as direções.
     Gere no celular pelo modo Panorama/Photo Sphere do Google Câmera, ou com uma câmera 360.
   - `'foto'`: foto comum. A imagem só se move de leve ao arrastar.

## Posicionar os pontos clicáveis
Aperte **E** (modo edição), clique onde o ponto deve ficar e as coordenadas aparecem na tela
(e são copiadas). Cole em `pontos` no `config.js`:
- fachada e `'foto'`: `x` e `y` (0 a 1);
- `'pano'`: `yaw` (-180 a 180, o 0 é para onde a câmera olha ao entrar) e `pitch` (-85 a 85).

## Controles
Arrastar = olhar · Roda do mouse = zoom · Setas = girar · **Esc** = voltar · **E** = modo edição · ⛶ = tela cheia.

## Publicar para os amigos
É um site estático (4 arquivos + fotos). Opções grátis: Netlify Drop (arrastar a pasta),
GitHub Pages ou o S3 + CloudFront que você já usa no Aldoria. Dica: reduza as fotos para
no máximo 4096 px de largura (panoramas) e 2000 px (fotos comuns) para carregar rápido.
