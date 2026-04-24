export interface ModuleOption {
  title: string;
  icon: string;
  description: string;
}

export interface ModuleCharts {
  pieTitle: string;
  pieSubtitle: string;
  barTitle: string;
  barSubtitle: string;
  lineTitle: string;
  lineSubtitle: string;
}

export interface ModuleHero {
  text: string;
  helper: string;
}

export interface ModuleConfig {
  id: string;
  name: string;
  icon: string;
  iconShort: string;
  color: string;
  darkColor: string;
  softColor: string;
  subtitle: string;
  description: string;
  hero: ModuleHero;
  options: ModuleOption[];
  charts: ModuleCharts;
}

export const comprasModulesConfig: Record<string, ModuleConfig> = {
  solicitudes: {
    id: 'solicitudes',
    name: 'Solicitudes',
    icon: '📝',
    iconShort: 'SC',
    color: '#2563EB',
    darkColor: '#1D4ED8',
    softColor: '#EFF6FF',
    subtitle: 'Registro, seguimiento y priorizacion de solicitudes de compra.',
    description:
      'Esta pantalla concentra las solicitudes pendientes, el contenido de las hojas relacionadas y graficas para analizar tipos de requerimientos, volumen y comportamiento por fecha.',
    hero: {
      text: 'Aqui puedes revisar solicitudes por tipo, prioridad, estatus, fecha y monto. La tabla central te permite tomar como base un Excel o Google Sheet para construir el control operativo del area.',
      helper: 'Solicitudes vinculadas al flujo de compras.',
    },
    options: [
      { title: 'Nueva solicitud', icon: '➕', description: 'Preparar altas de requerimientos y compras urgentes.' },
      { title: 'Pendientes', icon: '⏳', description: 'Dar seguimiento a solicitudes por aprobar o surtir.' },
      { title: 'Prioridades', icon: '🔥', description: 'Detectar compras criticas y necesidades del negocio.' },
      { title: 'Historial', icon: '🗂️', description: 'Consultar solicitudes concluidas y comportamiento historico.' },
    ],
    charts: {
      pieTitle: 'Pastel por tipo o estatus',
      pieSubtitle: 'Distribucion de categorias detectadas dentro de la hoja seleccionada.',
      barTitle: 'Barras por monto o volumen',
      barSubtitle: 'Campos numericos mas relevantes para solicitudes.',
      lineTitle: 'Tendencia de solicitudes',
      lineSubtitle: 'Comportamiento por fecha o periodo disponible.',
    },
  },
  ordenes: {
    id: 'ordenes',
    name: 'Órdenes de Compra',
    icon: '📋',
    iconShort: 'OC',
    color: '#7C3AED',
    darkColor: '#5B21B6',
    softColor: '#F5F3FF',
    subtitle: 'Control operativo de ordenes emitidas, activas y cerradas.',
    description:
      'La vista de ordenes permite revisar documentos de compra, sus montos, fechas de emision y estado para construir seguimiento ejecutivo con graficas y tablas.',
    hero: {
      text: 'Usa esta pagina para concentrar ordenes emitidas, abiertas, surtidas o canceladas. Las graficas ayudan a detectar carga operativa, proveedores recurrentes y ciclos de compra.',
      helper: 'Ordenes disponibles para seguimiento.',
    },
    options: [
      { title: 'Ordenes activas', icon: '📌', description: 'Monitorear ordenes abiertas y entregas pendientes.' },
      { title: 'Autorizaciones', icon: '✅', description: 'Revisar ordenes listas para liberar o validar.' },
      { title: 'Recepcion', icon: '📥', description: 'Confirmar cumplimiento y recepcion de materiales.' },
      { title: 'Incidencias', icon: '⚠️', description: 'Detectar retrasos, diferencias o cancelaciones.' },
    ],
    charts: {
      pieTitle: 'Pastel por estatus de orden',
      pieSubtitle: 'Proporcion de ordenes abiertas, cerradas o en proceso.',
      barTitle: 'Barras por importe',
      barSubtitle: 'Montos y columnas numericas presentes en la hoja.',
      lineTitle: 'Tendencia de ordenes',
      lineSubtitle: 'Movimiento por fecha de emision o entrega.',
    },
  },
  presupuesto: {
    id: 'presupuesto',
    name: 'Presupuesto',
    icon: '💰',
    iconShort: 'PP',
    color: '#EA580C',
    darkColor: '#C2410C',
    softColor: '#FFF7ED',
    subtitle: 'Analisis de partidas, gasto real y disponibilidad presupuestal.',
    description:
      'En presupuesto puedes consolidar archivos financieros para visualizar avance del gasto, categorias de consumo y comportamiento por periodo con enfoque de compras.',
    hero: {
      text: 'Esta area sirve para revisar gasto planeado vs real, montos por categoria, proyectos o centros de costo y construir tableros financieros desde tus hojas de calculo.',
      helper: 'Archivos de presupuesto y gasto.',
    },
    options: [
      { title: 'Partidas', icon: '🏷️', description: 'Controlar lineas presupuestales y su disponibilidad.' },
      { title: 'Gasto real', icon: '📉', description: 'Comparar lo ejecutado contra lo planeado.' },
      { title: 'Alertas', icon: '🚨', description: 'Identificar sobreconsumo y desviaciones.' },
      { title: 'Periodos', icon: '🗓️', description: 'Revisar presupuesto por mes, trimestre o ejercicio.' },
    ],
    charts: {
      pieTitle: 'Pastel por categoria de gasto',
      pieSubtitle: 'Distribucion del presupuesto por concepto detectado.',
      barTitle: 'Barras por importe presupuestal',
      barSubtitle: 'Valores acumulados por las columnas monetarias.',
      lineTitle: 'Tendencia del gasto',
      lineSubtitle: 'Comportamiento por fecha, mes o periodo.',
    },
  },
  proveedores: {
    id: 'proveedores',
    name: 'Proveedores',
    icon: '🏪',
    iconShort: 'PR',
    color: '#059669',
    darkColor: '#047857',
    softColor: '#ECFDF5',
    subtitle: 'Catalogo, evaluacion y seguimiento de proveedores.',
    description:
      'Esta pagina sirve para revisar bases de proveedores, volumen de operaciones, estatus y datos claves para evaluacion comercial y abastecimiento.',
    hero: {
      text: 'Concentra aqui proveedores activos, inactivos, evaluados o bloqueados. Las graficas te ayudan a ver concentracion, frecuencia y montos por proveedor o categoria.',
      helper: 'Relacion comercial con proveedores.',
    },
    options: [
      { title: 'Alta de proveedor', icon: '🆕', description: 'Preparar catalogo y expedientes de nuevos proveedores.' },
      { title: 'Evaluacion', icon: '⭐', description: 'Revisar cumplimiento, calidad y tiempos de respuesta.' },
      { title: 'Contratos', icon: '📄', description: 'Relacionar archivos, vigencias y condiciones comerciales.' },
      { title: 'Cobertura', icon: '🌎', description: 'Ubicar proveedores por categoria, ciudad o region.' },
    ],
    charts: {
      pieTitle: 'Pastel por tipo de proveedor',
      pieSubtitle: 'Distribucion de proveedores por categoria o estatus.',
      barTitle: 'Barras por monto negociado',
      barSubtitle: 'Volumen y columnas numericas detectadas en la base.',
      lineTitle: 'Tendencia de actividad',
      lineSubtitle: 'Altas o movimientos por fecha disponible.',
    },
  },
  inventario: {
    id: 'inventario',
    name: 'Inventario',
    icon: '📦',
    iconShort: 'IN',
    color: '#0F766E',
    darkColor: '#115E59',
    softColor: '#F0FDFA',
    subtitle: 'Control de stock, entradas, salidas y disponibilidad.',
    description:
      'Inventario conecta hojas de almacen y compras para revisar existencias, movimientos y materiales criticos con tablas y graficas listas para analisis.',
    hero: {
      text: 'Utiliza esta vista para revisar stock, rotacion, faltantes y consumo de materiales. La pantalla toma un Google Sheet o Excel y arma una lectura operativa para el area.',
      helper: 'Archivos de inventario y almacen.',
    },
    options: [
      { title: 'Existencias', icon: '📚', description: 'Ver cantidades disponibles y materiales criticos.' },
      { title: 'Entradas', icon: '📥', description: 'Controlar recepciones y altas de producto.' },
      { title: 'Salidas', icon: '📤', description: 'Dar seguimiento a consumo y surtido interno.' },
      { title: 'Reposicion', icon: '🔁', description: 'Detectar niveles minimos y necesidad de compra.' },
    ],
    charts: {
      pieTitle: 'Pastel por categoria de inventario',
      pieSubtitle: 'Distribucion de productos, estatus o familias.',
      barTitle: 'Barras por cantidades',
      barSubtitle: 'Campos numericos como stock, minimo o consumo.',
      lineTitle: 'Tendencia de movimientos',
      lineSubtitle: 'Entradas y salidas por fecha o periodo.',
    },
  },
};

export default comprasModulesConfig;