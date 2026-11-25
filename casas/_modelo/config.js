/* Modelo de casa. O script tools/nova_casa.py copia esta pasta e coloca o nome da casa em "titulo".
   Passo a passo (detalhes em README.md):
   1. Coloque as fotos em fotos/ e troque os nomes em "img".
   2. Sem foto de fachada? Apague o bloco "fachada" inteiro: o tour começa direto no primeiro cômodo.
   3. Sem maquete 3D? Apague o bloco "casa3d" inteiro.
   4. Aperte E no site para ler as coordenadas dos pontos (yaw/pitch nos panoramas, x/y nas fotos comuns). */
const TOUR = {
  titulo: '__NOME__',
  subtitulo: 'Escolha um ambiente e entre.',

  fachada: {
    img: 'fotos/fachada.jpg',
    pontos: [
      { area: [0.30, 0.55, 0.45, 0.75], para: 'sala', rotulo: 'Sala' },
    ],
  },

  comodos: {
    sala: {
      nome: 'Sala',
      texto: 'Descreva o ambiente aqui.',
      img: 'fotos/sala.jpg',
      tipo: 'pano',            // 'pano' = panorama 360° | 'foto' = foto comum
      yaw: 0,
      cor: '#c9a27a',
      pontos: [
        { yaw: 90, pitch: -4, para: 'cozinha', rotulo: 'Cozinha' },
      ],
    },
    cozinha: {
      nome: 'Cozinha',
      texto: 'Descreva o ambiente aqui.',
      img: 'fotos/cozinha.jpg',
      tipo: 'pano',
      yaw: 0,
      cor: '#8fb0a4',
      pontos: [
        { yaw: -90, pitch: -4, para: 'sala', rotulo: 'Sala' },
      ],
    },
  },

  casa3d: {
    andares: [
      { nome: 'Térreo', comodos: [
        { id: 'sala', nome: 'Sala', x: 0, z: 0, w: 5, d: 4, olhar: 90,
          aberturas: [ { lado: 'e', pos: 2, larg: 1.0, tipo: 'porta' }, { lado: 'n', pos: 2.5, larg: 1.6, tipo: 'janela' } ],
          moveis: [ { m: 'sofa', x: 1, z: 2.8, rot: 180 }, { m: 'mesinha', x: 1.5, z: 1.7 } ] },
        { id: 'cozinha', nome: 'Cozinha', x: 5, z: 0, w: 4, d: 4, olhar: 270,
          aberturas: [ { lado: 'w', pos: 2, larg: 1.0, tipo: 'porta' }, { lado: 'n', pos: 2, larg: 1.2, tipo: 'janela' } ],
          moveis: [ { m: 'bancada', x: 0.4, z: 3.3 }, { m: 'geladeira', x: 3.2, z: 0.15 } ] },
      ] },
    ],
  },
};
