class WatermarkService
  WMARK_PATH = Rails.root.join("tmp/watermark.png").to_s
  OPACITY    = 0.55
  FONT       = "Liberation Sans Bold 160"

  def self.apply(source_path)
    ensure_watermark!

    ImageProcessing::Vips
      .source(source_path)
      .custom { |img| img.autorot rescue img }
      .composite(WMARK_PATH, "over", gravity: "centre")
      .call
  end

  def self.ensure_watermark!
    return if File.exist?(WMARK_PATH)

    FileUtils.mkdir_p(File.dirname(WMARK_PATH))

    text  = Vips::Image.text("SAARQ", font: FONT, rgba: true)
    bands = text.bandsplit
    bands[3] = (bands[3] * OPACITY).cast(:uchar)
    Vips::Image.bandjoin(bands).write_to_file(WMARK_PATH)
  end
end
