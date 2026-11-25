# Tour de Casas

Site com vários tours de casas. Cada casa tem: fachada (opcional) com áreas que acendem ao passar o mouse,
voo da câmera até o cômodo, panoramas 360° (ou fotos comuns), caminhada entre cômodos e uma maquete 3D
mobiliada pela qual dá para andar. Sem dependências e sem internet: HTML + JavaScript + fotos.

```
index.html, casa3d.js      o visualizador (igual para todas as casas)
casas/casas.js             lista das casas (aparece na página inicial)
casas/<id>/config.js       os dados de UMA casa: cômodos, pontos, planta da maquete
casas/<id>/fotos/          as fotos dessa casa
casas/_modelo/             modelo copiado ao criar casa nova
tools/                     nova_casa.py e otimizar_fotos.py
```

## Ver no computador
Dois cliques em `iniciar.bat` (precisa do Python) → http://localhost:8080.
Abrir o `index.html` direto (file://) não serve: o navegador bloqueia as fotos dos panoramas.
Cada casa abre em `?casa=<id>` (ex.: `?casa=minha-casa`). Com uma casa só, o site abre direto nela.

## Criar uma casa nova
```
python tools/nova_casa.py praia "Casa de Praia" "Descrição curta"
```
Cria `casas/praia/` a partir do modelo e registra em `casas/casas.js`. Depois:
1. Ponha as fotos em `casas/praia/fotos/` e rode `python tools/otimizar_fotos.py casas/praia/fotos`
   (reduz panoramas para 4096 px e as demais para 2000 px; precisa de `pip install pillow`).
2. Edite `casas/praia/config.js`: nomes de arquivo (`img`), textos, `tipo` de cada cômodo e os pontos.
3. Sem foto de fachada? Apague o bloco `fachada`: o tour começa direto no primeiro cômodo.
   Sem maquete? Apague o bloco `casa3d`.

## Posicionar os pontos clicáveis
Aperte **E** no site (modo edição), clique onde o ponto deve ficar; as coordenadas aparecem e vão para a área
de transferência. Fachada e fotos comuns usam `x`,`y` (0 a 1); panoramas usam `yaw` (-180 a 180) e `pitch`.
Na fachada, `area: [x0,y0,x1,y1]` cria o retângulo que acende ao passar o mouse.
Ao entrar de um cômodo em outro, a câmera olha para a porta, avança e chega de costas para a porta por onde entrou
(`chegada: <yaw>` num ponto força outra direção).

## Maquete 3D (`casa3d` no config.js)
Medidas em metros (x = leste, z = sul). Cada cômodo é um retângulo com `aberturas` (portas/janelas) e `moveis`
(sofa, poltrona, mesa, mesinha, cadeira, tapete, estante, armario, cama, criado, bancada, ilha, geladeira, fogao,
banheira, vaso, pia, planta, caixa). Portas de cômodos vizinhos devem ficar alinhadas. Veja o exemplo em
`casas/minha-casa/config.js`. Controles: arrastar = olhar/girar, WASD ou setas = andar, Esc = voltar.

## Controles gerais
Arrastar = olhar · Roda = zoom · Setas = girar · **Esc** = voltar · **E** = modo edição · ⛶ = tela cheia.

## Publicar
É um site estático. GitHub Pages (https://dannielvroque.github.io/tour-casa/), Netlify ou S3 + CloudFront.
Peso: ~4 MB por cômodo panorâmico. Para muitas casas, guarde as fotos fora do repositório e aponte `base`
em `casas/casas.js` para o endereço delas (o servidor precisa liberar CORS).
Fotos de exemplo: ver `casas/minha-casa/fotos/CREDITOS.md`.
