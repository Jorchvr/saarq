class Admin::PropertiesController < Admin::BaseController
  before_action :set_property, only: [:edit, :update, :destroy, :purge_imagen, :purge_all_imagenes, :rewatermark]

  def index
    @properties = Property.with_attached_imagenes.order(created_at: :desc)
  end

  def new
    @property = Property.new
  end

  def create
    @property = Property.new(property_params)
    if @property.save
      WatermarkImagesJob.perform_later(@property.id) if @property.imagenes.attached?
      redirect_to admin_properties_path, status: :see_other, notice: "Propiedad creada correctamente."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit; end

  def update
    if @property.update(property_params)
      WatermarkImagesJob.perform_later(@property.id) if params.dig(:property, :imagenes).present?
      redirect_to admin_properties_path, status: :see_other, notice: "Propiedad actualizada."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def purge_imagen
    @property.imagenes.find(params[:attachment_id]).purge_later
    redirect_to edit_admin_property_path(@property), notice: "Imagen eliminada."
  end

  def purge_all_imagenes
    @property.imagenes.purge_later
    redirect_to edit_admin_property_path(@property), notice: "Todas las imágenes eliminadas."
  end

  def rewatermark
    WatermarkImagesJob.perform_later(@property.id)
    redirect_to edit_admin_property_path(@property), notice: "Aplicando marca de agua... recarga la página en unos segundos."
  end

  def rewatermark_all
    Property.with_attached_imagenes.each { |p| WatermarkImagesJob.perform_later(p.id) }
    redirect_to admin_properties_path, notice: "Aplicando marca de agua a todas las propiedades..."
  end

  def destroy
    @property.destroy
    redirect_to admin_properties_path, status: :see_other, notice: "Propiedad eliminada."
  end

  private

  def set_property
    @property = Property.find(params[:id])
  end

  def property_params
    permitted = params.require(:property).permit(
      :precio, :calle, :colonia, :ciudad, :estado,
      :tipo_operacion, :tipo_propiedad, :descripcion, :activo,
      imagenes: []
    )
    # Filter out blank entries (empty string sent when no file is selected).
    # Without this, submitting the form without new images purges existing ones.
    if permitted[:imagenes].present?
      real_files = permitted[:imagenes].reject(&:blank?)
      real_files.any? ? permitted[:imagenes] = real_files : permitted.delete(:imagenes)
    end
    permitted
  end
end
