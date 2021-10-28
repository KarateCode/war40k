Rails.application.routes.draw do
	get '*page', to: 'static#index', constraints: -> (req) do
		!req.xhr? && req.format.html?
	end

	root 'static#index'
	namespace :api, defaults: {format: 'json'} do
		get '/units', to: 'units#index'
		get '/units/:id/variations', to: 'units#variations'
		get '/units/:id/variation-models', to: 'units#variation_models'

		get '/armies', to: 'armies#index'
		post '/armies', to: 'armies#create'
		get '/armies/:id/detachments', to: 'armies#detachments'
		get '/armies/:id', to: 'armies#show'
		get '/detachment_defs', to: 'detachment_defs#index'

		get '/detachments/:id', to: 'detachments#show'
		post '/detachments', to: 'detachments#create'
	end
end
