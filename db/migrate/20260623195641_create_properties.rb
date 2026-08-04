class CreateProperties < ActiveRecord::Migration[8.1]
  def change
    create_table :properties do |t|
      t.decimal  :precio,         precision: 12, scale: 2, null: false
      t.string   :calle,          null: false
      t.string   :colonia,        null: false
      t.string   :ciudad,         null: false
      t.string   :estado,         null: false
      t.string   :tipo_operacion, null: false
      t.string   :tipo_propiedad, null: false
      t.text     :descripcion
      t.boolean  :activo,         null: false, default: true

      t.timestamps
    end

    add_index :properties, :tipo_operacion
    add_index :properties, :tipo_propiedad
    add_index :properties, :estado
    add_index :properties, :activo
  end
end
