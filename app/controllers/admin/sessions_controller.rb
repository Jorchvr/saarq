class Admin::SessionsController < ApplicationController
  layout false

  def new
    redirect_to admin_root_path if session[:admin_autenticado]
  end

  def create
    password = Rails.application.credentials.dig(:admin, :password) ||
               ENV.fetch("ADMIN_PASSWORD", "admin1234")

    if params[:password] == password
      session[:admin_autenticado] = true
      redirect_to admin_root_path, status: :see_other, notice: "Bienvenido al backoffice."
    else
      flash.now[:alert] = "Contraseña incorrecta."
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    session.delete(:admin_autenticado)
    redirect_to root_path, status: :see_other, notice: "Sesión cerrada."
  end
end
