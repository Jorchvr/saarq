Property.create!([
  {
    precio: 2_500_000,
    calle: "Av. Vallarta 1234",
    colonia: "Providencia",
    ciudad: "Guadalajara",
    estado: "Jalisco",
    tipo_operacion: "venta",
    tipo_propiedad: "casa",
    descripcion: "Hermosa casa de 3 recámaras, 2 baños, jardín y cochera para 2 autos. Excelente ubicación.",
    activo: true
  },
  {
    precio: 12_000,
    calle: "Calle Reforma 567",
    colonia: "Centro",
    ciudad: "Guadalajara",
    estado: "Jalisco",
    tipo_operacion: "renta",
    tipo_propiedad: "departamento",
    descripcion: "Departamento moderno en el centro, 2 recámaras, 1 baño, cocina integral. Piso 4.",
    activo: true
  },
  {
    precio: 850_000,
    calle: "Blvd. Insurgentes 89",
    colonia: "Las Palmas",
    ciudad: "Monterrey",
    estado: "Nuevo León",
    tipo_operacion: "venta",
    tipo_propiedad: "terreno",
    descripcion: "Terreno plano de 300 m² en zona residencial. Servicios disponibles.",
    activo: true
  },
  {
    precio: 18_000,
    calle: "Av. Juárez 450",
    colonia: "Doctores",
    ciudad: "Ciudad de México",
    estado: "Ciudad de México",
    tipo_operacion: "renta",
    tipo_propiedad: "local",
    descripcion: "Local comercial en planta baja, 80 m², ideal para negocio o consultorio.",
    activo: true
  }
])

puts "Creados #{Property.count} propiedades de ejemplo."
