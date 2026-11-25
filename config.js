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
      { x: 0.49, y: 0.57, para: 'sala',    rotulo: 'Sala' },
      { x: 0.60, y: 0.44, para: 'cozinha', rotulo: 'Cozinha' },
      { x: 0.46, y: 0.33, para: 'quarto',  rotulo: 'Quarto' },
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
