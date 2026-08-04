class PropertiesController < ApplicationController
  def index
    @properties = Property.activas
      .busqueda(params[:q])
      .por_operacion(params[:operacion])
      .por_tipo(params[:tipo])
      .order(created_at: :desc)
      .with_attached_imagenes
  end

  def show
    @property = Property.activas.with_attached_imagenes.find(params[:id])

    precio_min = @property.precio * 0.6
    precio_max = @property.precio * 1.4

    @similares = Property.activas
      .with_attached_imagenes
      .where.not(id: @property.id)
      .where("precio BETWEEN ? AND ?", precio_min, precio_max)
      .where("ciudad = ? OR estado = ?", @property.ciudad, @property.estado)
      .limit(3)
  end
end
