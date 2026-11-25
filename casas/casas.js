/* Lista das casas. Uma por linha. Use  python tools/nova_casa.py <id> "Nome"  para acrescentar.
   id        = nome da pasta em casas/ e valor de ?casa=
   capa      = foto de capa (caminho dentro da pasta da casa)
   base      = (opcional) endereço de outro lugar onde ficam as fotos, ex.: 'https://cdn.seudominio.com/casas/minha-casa/'
               (o servidor precisa liberar CORS, senão os panoramas 360° não carregam) */
const CASAS=[
  { id: 'minha-casa', nome: 'Casa de exemplo', descricao: 'Sobrado com sala, cozinha, quarto e banheiro. Fotos de exemplo (CC0).', capa: 'fotos/fachada.jpg' },
  { id: 'casa_mira', nome: 'Casa Mira', descricao: 'Sobrado de 2 andares com pé-direito duplo, lareira, pátio com churrasqueira e spa.', capa: 'fotos/fachada.jpg' },
];
