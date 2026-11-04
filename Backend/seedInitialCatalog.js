const mongoose = require('mongoose');
const Servicio = require('./models/servicio');

const catalogoInicial = [
  { nombre: "JACK DANIEL'S", descripcion: 'Whisky Tennessee con notas de vainilla, caramelo y roble.', precio: 28000, categoria: 'Bebidas', ingredientes: ['Whisky', 'Vainilla', 'Caramelo'], disponible: true },
  { nombre: 'JOHNNIE WALKER', descripcion: 'Whisky escocés con frutas maduras, vainilla y un final ahumado.', precio: 24000, categoria: 'Bebidas', ingredientes: ['Whisky', 'Frutos del bosque', 'Vainilla'], disponible: true },
  { nombre: 'TALISKER 10', descripcion: 'Single Malt de la Isla de Skye. Notas marinas salinas con pimienta negra, cebada malteada y humo envolvente.', precio: 32000, categoria: 'Bebidas', ingredientes: ['Whisky', 'Cebada malteada', 'Pimienta negra', 'Notas marinas'], disponible: true },
  { nombre: 'JAMESON TRIPLE', descripcion: 'Triple destilado irlandés con notas de vainilla, madera tostada y un final suavemente especiado.', precio: 25000, categoria: 'Bebidas', ingredientes: ['Whisky irlandés', 'Vainilla', 'Madera tostada', 'Especias'], disponible: true },
  { nombre: 'BARTERHOUSE 20', descripcion: 'Bourbon añejado en roble americano con notas de caramelo, nuez moscada y vainilla.', precio: 45000, categoria: 'Bebidas', ingredientes: ['Bourbon', 'Roble', 'Caramelo', 'Nuez moscada', 'Vainilla'], disponible: true },
  { nombre: 'NEGRONI NEBULA', descripcion: 'Cóctel de ginebra, Campari y notas cítricas.', precio: 18000, categoria: 'Coctelería', ingredientes: ['Campari', 'Ginebra', 'Naranja'], disponible: true },
  { nombre: 'TÁRTAR BALFEGÓ', descripcion: 'Atún rojo cortado a cuchillo con trufa negra, alga nori y perlas de caviar.', precio: 35000, categoria: 'Comida', ingredientes: ['Atún rojo', 'Trufa negra', 'Alga nori', 'Caviar'], disponible: true },
  { nombre: 'ENTRECOT AL SARMIENTO', descripcion: 'Corte madurado a la parrilla con guarnición de temporada.', precio: 52000, categoria: 'Comida', ingredientes: ['Entrecot', 'Hierbas', 'Vegetales'], disponible: true },
  { nombre: 'TABLA 100% BELLOTA', descripcion: 'Selección para compartir con productos curados y acompañamientos.', precio: 42000, categoria: 'Comida', ingredientes: ['Jamón curado', 'Quesos', 'Pan artesanal'], disponible: true },
  { nombre: 'HAMBURGUESA BLACK ANGUS', descripcion: 'Hamburguesa de res Black Angus, queso, vegetales y salsa de la casa.', precio: 36000, categoria: 'Comida', ingredientes: ['Black Angus', 'Queso', 'Vegetales'], disponible: true },
  { nombre: 'TRUFA Y TOCINO', descripcion: 'Doble carne a la parrilla, tocino crujiente, queso suizo y mayonesa de trufa en pan brioche.', precio: 32000, categoria: 'Comida', ingredientes: ['Carne', 'Tocino', 'Queso suizo', 'Trufa', 'Rúcula', 'Pan brioche'], disponible: true },
  { nombre: 'POLLO CRUJIENTE BBQ', descripcion: 'Pollo crujiente, queso gouda, jalapeños y salsa BBQ ahumada en pan de sésamo.', precio: 26000, categoria: 'Comida', ingredientes: ['Pollo', 'Queso gouda', 'Jalapeños', 'Salsa barbacoa', 'Pan de sésamo'], disponible: true },
  { nombre: 'SALCHIPAPA CLÁSICA', descripcion: 'Papas doradas, salchicha ahumada y queso fundido con salsas de la casa.', precio: 18000, categoria: 'Comida', ingredientes: ['Papas', 'Salchicha', 'Queso', 'Kétchup', 'Mostaza', 'Mayonesa'], disponible: true },
  { nombre: 'SALCHIPAPA CARGADA', descripcion: 'Papas crujientes, salchicha ahumada, queso fundido, tocino y salsa de la casa.', precio: 24000, categoria: 'Comida', ingredientes: ['Papas', 'Salchicha', 'Queso', 'Tocino', 'Cebolla', 'Salsa de la casa'], disponible: true },
  { nombre: 'TACOS GASTROBAR', descripcion: 'Tortillas de maíz doradas con carne a la parrilla, cebolla morada, cilantro fresco y salsa de la casa.', precio: 24000, categoria: 'Comida', ingredientes: ['Tortillas de maíz', 'Carne a la parrilla', 'Cebolla morada', 'Cilantro', 'Salsa de la casa'], imagen: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=85', disponible: true },
  { nombre: 'PIZZA ARTESANAL', descripcion: 'Masa artesanal horneada con salsa de tomate, mozzarella fundida y albahaca fresca.', precio: 32000, categoria: 'Comida', ingredientes: ['Masa artesanal', 'Salsa de tomate', 'Mozzarella', 'Albahaca fresca'], imagen: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=85', disponible: true },
  { nombre: 'Reserva de Mesa', descripcion: 'Solicitud de reserva de mesa en GastroBar.', precio: 0, categoria: 'Reserva de Mesa', disponible: true }
];

async function seedInitialCatalog() {
  const metadata = mongoose.connection.collection('gastrobar_metadata');
  const seedId = 'initial-catalog-v2';
  const alreadySeeded = await metadata.findOne({ _id: seedId });
  if (alreadySeeded) return;

  await Servicio.bulkWrite(catalogoInicial.map(servicio => ({
    updateOne: {
      filter: { nombre: servicio.nombre },
      update: { $setOnInsert: servicio },
      upsert: true
    }
  })));

  await metadata.updateOne(
    { _id: seedId },
    { $setOnInsert: { completedAt: new Date() } },
    { upsert: true }
  );
  console.log('Catálogo inicial de GastroBar completado.');
}

module.exports = seedInitialCatalog;
