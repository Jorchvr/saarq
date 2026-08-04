class Property < ApplicationRecord
  has_many_attached :imagenes

  TIPOS_OPERACION = %w[venta renta].freeze
  TIPOS_PROPIEDAD = %w[casa departamento terreno local bodega].freeze
  ESTADOS_MX = [
    "Aguascalientes","Baja California","Baja California Sur","Campeche",
    "Chiapas","Chihuahua","Ciudad de México","Coahuila","Colima","Durango",
    "Guanajuato","Guerrero","Hidalgo","Jalisco","Estado de México",
    "Michoacán","Morelos","Nayarit","Nuevo León","Oaxaca","Puebla",
    "Querétaro","Quintana Roo","San Luis Potosí","Sinaloa","Sonora",
    "Tabasco","Tamaulipas","Tlaxcala","Veracruz","Yucatán","Zacatecas"
  ].freeze

  validates :precio,         presence: true, numericality: { greater_than: 0 }
  validates :calle,          presence: true
  validates :colonia,        presence: true
  validates :ciudad,         presence: true
  validates :estado,         presence: true, inclusion: { in: ESTADOS_MX }
  validates :tipo_operacion, presence: true, inclusion: { in: TIPOS_OPERACION }
  validates :tipo_propiedad, presence: true, inclusion: { in: TIPOS_PROPIEDAD }

  scope :activas,       -> { where(activo: true) }
  scope :por_operacion, ->(op)   { where(tipo_operacion: op) if op.present? }
  scope :por_tipo,      ->(tipo) { where(tipo_propiedad: tipo) if tipo.present? }
  scope :por_estado,    ->(est)  { where(estado: est) if est.present? }
  scope :por_ciudad,    ->(city) { where(ciudad: city) if city.present? }
  scope :busqueda,      ->(q)    { where("calle ILIKE :q OR colonia ILIKE :q OR ciudad ILIKE :q", q: "%#{q}%") if q.present? }
  scope :precio_min,    ->(min)  { where("precio >= ?", min) if min.present? }
  scope :precio_max,    ->(max)  { where("precio <= ?", max) if max.present? }

  def precio_formateado
    "$#{precio.to_i.to_s.reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse} MXN"
  end

  def imagen_principal
    imagenes.first if imagenes.attached?
  end
end
