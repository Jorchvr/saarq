Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  root "properties#index"
  resources :properties, only: [:index, :show]
  get "/aviso-de-privacidad", to: "pages#privacidad", as: :aviso_privacidad

  namespace :admin do
    root "properties#index"
    resources :properties do
      delete :purge_imagen,        on: :member
      delete :purge_all_imagenes,  on: :member
      post   :rewatermark,         on: :member
      post   :rewatermark_all,     on: :collection
    end
    get "/login",  to: "sessions#new",    as: :login
    post "/login", to: "sessions#create"
    delete "/logout", to: "sessions#destroy", as: :logout
  end
end
