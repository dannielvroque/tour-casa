/* Casa Mira — sobrado de 2 andares. Fotos do proprietário (autorizadas para publicação).
   Originais (.heic) ficam nesta pasta, fora do git; as versões otimizadas estão em fotos/.
   Tipos: 'cil' = panorâmica do celular (cobre ~150°–200°, a câmera gira dentro dela)
          'foto' = foto comum (preenche a tela; arraste para olhar os cantos)
   Os nomes dos quartos/banheiros são palpites pelas fotos: renomeie à vontade.
   Pontos: aperte E no site e clique para ler as coordenadas. */
const TOUR = {
  titulo: 'Casa Mira',
  subtitulo: 'Sobrado com pé-direito duplo, lareira e spa. Escolha por onde entrar.',

  fachada: {
    img: 'fotos/fachada.jpg',
    pontos: [
      { area: [0.275, 0.22, 0.385, 0.60], para: 'sala',    rotulo: 'Sala · pé-direito duplo' },
      { area: [0.435, 0.47, 0.495, 0.67], para: 'entrada', rotulo: 'Entrada' },
      { area: [0.540, 0.27, 0.650, 0.40], para: 'suite1',  rotulo: 'Suíte com sacada' },
    ],
  },

  comodos: {
    /* ---------------- térreo ---------------- */
    entrada: {
      nome: 'Entrada', texto: 'Garagem coberta e porta pivotante de madeira.',
      img: 'fotos/entrada.jpg', tipo: 'foto',
      pontos: [ { x: 0.22, y: 0.55, para: 'sala', rotulo: 'Entrar' } ],
    },
    sala: {
      nome: 'Sala de estar', texto: 'Pé-direito duplo, lareira e escada para o andar de cima. Arraste para girar.',
      img: 'fotos/sala.jpg', tipo: 'cil', yaw: -10,
      pontos: [
        { yaw: -88, pitch: -4, para: 'cozinha',    rotulo: 'Cozinha' },
        { yaw: -47, pitch:  4, para: 'lavanderia', rotulo: 'Lavanderia' },
        { yaw:  24, pitch: -3, para: 'entrada',    rotulo: 'Porta de entrada' },
        { yaw:  45, pitch: 27, para: 'pedireito',  rotulo: 'Olhar para cima' },
        { yaw:  54, pitch: -6, para: 'escada',     rotulo: 'Escada' },
      ],
    },
    pedireito: {
      nome: 'Pé-direito duplo', texto: 'Vista vertical da sala até o mezanino. Arraste para cima e para baixo.',
      img: 'fotos/pedireito.jpg', tipo: 'foto',
      pontos: [ { x: 0.50, y: 0.88, para: 'sala', rotulo: 'Sala' } ],
    },
    cozinha: {
      nome: 'Cozinha', texto: 'Ilha com cooktop, armários amadeirados e porta para o pátio.',
      img: 'fotos/cozinha.jpg', tipo: 'cil', yaw: 0,
      pontos: [
        { yaw: -64, pitch: -4, para: 'patio',      rotulo: 'Pátio' },
        { yaw: -19, pitch:  4, para: 'lavanderia', rotulo: 'Lavanderia' },
        { yaw:   8, pitch:  4, para: 'sala',       rotulo: 'Sala' },
        { yaw:  27, pitch:  0, para: 'escada',     rotulo: 'Escada' },
      ],
    },
    lavanderia: {
      nome: 'Lavanderia', texto: 'Tanque, armários e espaço para máquina.',
      img: 'fotos/lavanderia.jpg', tipo: 'foto',
      pontos: [ { x: 0.10, y: 0.60, para: 'cozinha', rotulo: 'Cozinha' } ],
    },
    patio: {
      nome: 'Pátio', texto: 'Churrasqueira, jardim e spa com deck de madeira.',
      img: 'fotos/patio.jpg', tipo: 'cil', yaw: 0,
      pontos: [
        { yaw: -38, pitch:  0, para: 'churrasqueira', rotulo: 'Churrasqueira' },
        { yaw:  21, pitch: -9, para: 'spa',           rotulo: 'Spa' },
        { yaw:  66, pitch:  0, para: 'cozinha',       rotulo: 'Cozinha' },
      ],
    },
    churrasqueira: {
      nome: 'Churrasqueira', texto: 'Área gourmet coberta por pergolado.',
      img: 'fotos/churrasqueira.jpg', tipo: 'foto',
      pontos: [ { x: 0.50, y: 0.82, para: 'patio', rotulo: 'Pátio' } ],
    },
    spa: {
      nome: 'Spa', texto: 'Banheira de hidromassagem com deck e jardim.',
      img: 'fotos/spa.jpg', tipo: 'foto',
      pontos: [ { x: 0.50, y: 0.88, para: 'patio', rotulo: 'Pátio' } ],
    },
    escada: {
      nome: 'Escada', texto: 'Escada em granito preto com guarda-corpo de inox.',
      img: 'fotos/escada.jpg', tipo: 'cil', yaw: 0,
      pontos: [
        { yaw: -23, pitch: 14, para: 'mezanino', rotulo: 'Subir' },
        { yaw:   3, pitch: -4, para: 'sala',     rotulo: 'Sala' },
      ],
    },

    /* ---------------- andar de cima ---------------- */
    mezanino: {
      nome: 'Mezanino', texto: 'Corredor dos quartos, aberto para a sala.',
      img: 'fotos/mezanino.jpg', tipo: 'cil', yaw: 0,
      pontos: [
        { yaw: -60, pitch:   4, para: 'suite1',  rotulo: 'Suíte' },
        { yaw: -47, pitch:   3, para: 'quarto2', rotulo: 'Quartos' },
        { yaw:  28, pitch: -14, para: 'escada',  rotulo: 'Descer' },
      ],
    },
    suite1: {
      nome: 'Suíte principal', texto: 'Piso amadeirado e porta de vidro para a sacada.',
      img: 'fotos/suite1.jpg', tipo: 'foto',
      pontos: [
        { x: 0.62, y: 0.55, para: 'sacada',   rotulo: 'Sacada' },
        { x: 0.08, y: 0.55, para: 'banho1',   rotulo: 'Banheiro' },
        { x: 0.92, y: 0.50, para: 'mezanino', rotulo: 'Mezanino' },
      ],
    },
    sacada: {
      nome: 'Sacada', texto: 'Sacada de frente para a rua.',
      img: 'fotos/sacada.jpg', tipo: 'foto',
      pontos: [
        { x: 0.58, y: 0.55, para: 'suite1',  rotulo: 'Suíte' },
        { x: 0.37, y: 0.50, para: 'quarto4', rotulo: 'Quarto' },
      ],
    },
    banho1: {
      nome: 'Banheiro da suíte', texto: 'Box em porcelanato amadeirado e cuba de apoio.',
      img: 'fotos/banho1.jpg', tipo: 'foto',
      pontos: [ { x: 0.90, y: 0.60, para: 'suite1', rotulo: 'Suíte' } ],
    },
    quarto2: {
      nome: 'Suíte 2', texto: 'Persiana elétrica e banheiro privativo.',
      img: 'fotos/quarto2.jpg', tipo: 'foto',
      pontos: [
        { x: 0.51, y: 0.50, para: 'banho2',   rotulo: 'Banheiro' },
        { x: 0.90, y: 0.50, para: 'mezanino', rotulo: 'Mezanino' },
      ],
    },
    banho2: {
      nome: 'Banheiro da suíte 2', texto: 'Revestimento em mármore cinza e nicho no box.',
      img: 'fotos/banho2.jpg', tipo: 'foto',
      pontos: [ { x: 0.90, y: 0.60, para: 'quarto2', rotulo: 'Suíte 2' } ],
    },
    quarto3: {
      nome: 'Quarto 3', texto: 'Quarto com banheiro anexo.',
      img: 'fotos/quarto3.jpg', tipo: 'foto',
      pontos: [
        { x: 0.86, y: 0.50, para: 'banho3',   rotulo: 'Banheiro' },
        { x: 0.72, y: 0.50, para: 'mezanino', rotulo: 'Mezanino' },
      ],
    },
    banho3: {
      nome: 'Banheiro 3', texto: 'Box de vidro e bancada branca.',
      img: 'fotos/banho3.jpg', tipo: 'foto',
      pontos: [ { x: 0.90, y: 0.60, para: 'quarto3', rotulo: 'Quarto 3' } ],
    },
    quarto4: {
      nome: 'Quarto 4', texto: 'Porta de vidro para a sacada.',
      img: 'fotos/quarto4.jpg', tipo: 'foto',
      pontos: [
        { x: 0.20, y: 0.55, para: 'sacada',   rotulo: 'Sacada' },
        { x: 0.48, y: 0.50, para: 'mezanino', rotulo: 'Mezanino' },
      ],
    },
  },
};
