class WatermarkImagesJob < ApplicationJob
  queue_as :default

  def perform(property_id)
    property = Property.find_by(id: property_id)
    return unless property&.imagenes&.attached?

    temps     = []
    new_files = []

    property.imagenes.each do |imagen|
      next unless imagen.content_type.start_with?("image/")

      ext = File.extname(imagen.filename.to_s).presence || ".jpg"
      tmp = Tempfile.new(["wm_src", ext])
      tmp.binmode
      tmp.write(imagen.download)
      tmp.rewind
      temps << tmp

      processed = WatermarkService.apply(tmp.path)
      new_files << { io: processed, filename: imagen.filename.to_s, content_type: imagen.content_type }
    end

    if new_files.any?
      property.imagenes.purge
      property.imagenes.attach(new_files)
    end
  ensure
    temps.each { |t| t.close! rescue nil }
  end
end
