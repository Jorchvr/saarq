class Admin::BaseController < ApplicationController
  layout "admin"
  before_action :autenticar_admin!

  private

  def autenticar_admin!
    unless session[:admin_autenticado]
      redirect_to admin_login_path, alert: "Inicia sesión para continuar."
    end
  end
end
