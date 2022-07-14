Rails.application.routes.draw do
	get '*page', to: 'static#index', constraints: -> (req) do
		!req.xhr? && req.format.html?
	end

	root 'static#index'
	namespace :api, defaults: {format: 'json'} do
		get '/units', to: 'units#index'
		get '/units/:id/variations', to: 'units#variations'
		get '/units/:id/variation-models', to: 'units#variation_models'
		get '/units/all-models', to: 'units#all_models'

		get '/armies', to: 'armies#index'
		post '/armies', to: 'armies#create'
		put '/armies/:id', to: 'armies#update'
		get '/armies/:id/detachments', to: 'armies#detachments'
		get '/armies/:id', to: 'armies#show'
		get '/detachment_defs', to: 'detachment_defs#index'

		get '/detachments/:id', to: 'detachments#show'
		put '/detachments/:id', to: 'detachments#update'
		post '/detachments', to: 'detachments#create'

		get '/open_plays', to: 'open_plays#index'
		post '/open_plays', to: 'open_plays#create'
		put '/open_plays/:id', to: 'open_plays#update'
		get '/open_plays/:id', to: 'open_plays#show'
		delete 'open_plays/:id', to: 'open_plays#destroy'
	end
end
