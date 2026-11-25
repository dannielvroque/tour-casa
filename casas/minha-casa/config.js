/* ------------------------------------------------------------------
   CONFIGURAÇÃO DO TOUR  —  é aqui que você troca as fotos e os textos.

   Como usar suas fotos:
   1. Coloque as imagens na pasta  fotos/
   2. Troque o caminho em "img" (ex.: 'fotos/sala.jpg').
      Enquanto o arquivo não existir, o site desenha uma imagem de exemplo.
   3. Para posicionar os pontos clicáveis: abra o site, aperte a tecla E
      (modo edição) e clique onde o ponto deve ficar. As coordenadas
      aparecem na tela — copie para cá.

   Tipos de cômodo:
   - tipo: 'pano'  -> foto panorâmica 360° (equiretangular, proporção 2:1).
                      Pontos usam  yaw (graus, -180..180)  e  pitch (-85..85).
   - tipo: 'foto'  -> foto comum. Pontos usam  x e y  (0 a 1, dentro da foto).
   ------------------------------------------------------------------ */
const TOUR = {
  titulo: 'Tour da Casa',
  subtitulo: 'Escolha um ambiente e entre.',

  // Foto da casa por fora. Pontos: x e y de 0 a 1 (esquerda→direita, cima→baixo).
  fachada: {
    img: 'fotos/fachada.jpg',
    pontos: [
      // "area": [x0, y0, x1, y1] retângulo que acende ao passar o mouse (opcional; sem ele vale só o ponto x,y)
      { area: [0.470, 0.51, 0.530, 0.61], para: 'sala',    rotulo: 'Sala' },
      { area: [0.572, 0.55, 0.610, 0.64], para: 'cozinha', rotulo: 'Cozinha' },
      { area: [0.385, 0.32, 0.525, 0.44], para: 'quarto',  rotulo: 'Quarto' },
    ],
  },

  /* Maquete 3D (medidas em metros; x = leste, z = sul, o norte é o z menor).
     Cada cômodo é um retângulo: x,z = canto noroeste, w = largura, d = profundidade.
     "aberturas": lado 'n','s','w','e'; pos = distância (m) do canto até o centro da abertura;
                  larg = largura; tipo 'porta' ou 'janela'.
     "moveis": m = tipo (sofa, poltrona, mesa, mesinha, cadeira, tapete, estante, armario, cama,
                criado, bancada, ilha, geladeira, fogao, banheira, vaso, pia, planta, caixa),
                x,z = posição dentro do cômodo, rot = 0/90/180/270, e opcionais w,d,h,cor.
     "olhar": direção (graus) em que você aparece ao entrar caminhando (0 = norte, 90 = leste).
     O "id" do cômodo deve ser o mesmo de "comodos" abaixo para o botão "Ver fotos 360°" funcionar. */
  casa3d: {
    andares: [
      { nome: 'Térreo', comodos: [
        { id: 'sala', nome: 'Sala de estar', x: 0, z: 0, w: 6, d: 5, piso: '#b99c78', olhar: 90,
          aberturas: [
            { lado: 'e', pos: 2.5, larg: 1.0, tipo: 'porta' },
            { lado: 's', pos: 3.0, larg: 1.2, tipo: 'porta' },
            { lado: 'n', pos: 3.0, larg: 2.0, tipo: 'janela' },
            { lado: 'w', pos: 2.5, larg: 1.4, tipo: 'janela' } ],
          moveis: [
            { m: 'tapete',  x: 0.9, z: 1.4 },
            { m: 'sofa',    x: 1.0, z: 3.5, rot: 180 },
            { m: 'mesinha', x: 1.6, z: 2.3 },
            { m: 'poltrona',x: 3.6, z: 0.9, rot: 270, cor: '#a0654a' },
            { m: 'estante', x: 4.3, z: 0.14 },
            { m: 'mesa',    x: 3.6, z: 3.4 },
            { m: 'cadeira', x: 3.9, z: 2.9 }, { m: 'cadeira', x: 4.8, z: 2.9 },
            { m: 'planta',  x: 0.3, z: 0.3 } ] },
        { id: 'cozinha', nome: 'Cozinha', x: 6, z: 0, w: 4, d: 5, piso: '#cfc7b8', olhar: 270, parede: '#e8efe9',
          aberturas: [
            { lado: 'w', pos: 2.5, larg: 1.0, tipo: 'porta' },
            { lado: 'n', pos: 2.0, larg: 1.4, tipo: 'janela' },
            { lado: 'e', pos: 2.5, larg: 1.2, tipo: 'janela' } ],
          moveis: [
            { m: 'bancada',   x: 0.4, z: 4.2 },
            { m: 'fogao',     x: 3.2, z: 4.3 },
            { m: 'geladeira', x: 3.2, z: 0.15 },
            { m: 'ilha',      x: 1.2, z: 2.3 } ] },
      ] },
      { nome: 'Superior', comodos: [
        { id: 'quarto', nome: 'Quarto', x: 0, z: 0, w: 6, d: 5, piso: '#a98f73', olhar: 180, parede: '#e9e4f0',
          aberturas: [
            { lado: 'e', pos: 2.5, larg: 0.9, tipo: 'porta' },
            { lado: 'n', pos: 3.0, larg: 2.0, tipo: 'janela' },
            { lado: 'w', pos: 2.5, larg: 1.4, tipo: 'janela' },
            { lado: 's', pos: 3.0, larg: 2.0, tipo: 'janela' } ],
          moveis: [
            { m: 'cama',    x: 2.0, z: 0.14 },
            { m: 'criado',  x: 1.4, z: 0.2 }, { m: 'criado', x: 4.1, z: 0.2 },
            { m: 'armario', x: 0.2, z: 4.25, w: 1.7 },
            { m: 'tapete',  x: 1.8, z: 2.3, w: 2.4, d: 1.5, cor: '#7f8fb3' } ] },
        { id: 'banheiro', nome: 'Banheiro', x: 6, z: 0, w: 4, d: 5, piso: '#b9c4c9', olhar: 270, parede: '#eaf1f4',
          aberturas: [
            { lado: 'w', pos: 2.5, larg: 0.9, tipo: 'porta' },
            { lado: 'n', pos: 2.0, larg: 0.9, tipo: 'janela' },
            { lado: 'e', pos: 2.5, larg: 0.9, tipo: 'janela' } ],
          moveis: [
            { m: 'banheira', x: 1.0, z: 0.14, rot: 0 },
            { m: 'vaso',     x: 3.2, z: 0.15 },
            { m: 'pia',      x: 1.5, z: 4.35, rot: 0 } ] },
      ] },
    ],
  },

  comodos: {
    sala: {
      nome: 'Sala de estar',
      texto: 'Ambiente amplo e iluminado. Arraste para olhar ao redor.',
      img: 'fotos/sala.jpg',
      tipo: 'pano',
      yaw: 17,                       // para onde a câmera olha ao entrar
      cor: '#c9a27a',               // cor do exemplo (só enquanto não há foto)
      pontos: [
        { yaw: 155, pitch: -4, para: 'cozinha', rotulo: 'Cozinha' },
        { yaw: -59, pitch: -4, para: 'quarto',  rotulo: 'Quarto' },
      ],
    },
    cozinha: {
      nome: 'Cozinha',
      texto: 'Bancada e fogão à esquerda; a porta de entrada ao fundo.',
      img: 'fotos/cozinha.jpg',
      tipo: 'pano',
      yaw: -150,
      cor: '#8fb0a4',
      pontos: [
        { yaw: 140, pitch: -3, para: 'sala', rotulo: 'Sala' },
      ],
    },
    quarto: {
      nome: 'Quarto',
      texto: 'Cama de casal, escrivaninha e janela com cortinas.',
      img: 'fotos/quarto.jpg',
      tipo: 'pano',
      yaw: 100,
      cor: '#a597c9',
      pontos: [
        { yaw: 155, pitch: -6, para: 'banheiro', rotulo: 'Banheiro' },
        { yaw: -153, pitch: -6, para: 'sala',    rotulo: 'Sala' },
      ],
    },
    banheiro: {
      nome: 'Banheiro',
      texto: 'Banheiro da suíte.',
      img: 'fotos/banheiro.jpg',
      tipo: 'pano',
      yaw: -20,
      cor: '#7fa6c9',
      pontos: [
        { yaw: 115, pitch: -10, para: 'quarto', rotulo: 'Quarto' },
      ],
    },
  },
};
