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
		delete '/armies/:id', to: 'armies#destroy'
		get '/detachment_defs', to: 'detachment_defs#index'

		get '/detachments/:id', to: 'detachments#show'
		put '/detachments/:id', to: 'detachments#update'
		post '/detachments', to: 'detachments#create'

		get '/open_plays', to: 'open_plays#index'
		post '/open_plays', to: 'open_plays#create'
		put '/open_plays/:id', to: 'open_plays#update'
		get '/open_plays/:id', to: 'open_plays#show'
		delete 'open_plays/:id', to: 'open_plays#destroy'

		get '/matched_plays', to: 'matched_plays#index'
		get '/matched_plays/warlord_traits', to: 'matched_plays#warlord_traits'
		get '/matched_plays/relics', to: 'matched_plays#relics'
		post '/matched_plays', to: 'matched_plays#create'
		put '/matched_plays/:id', to: 'matched_plays#update'
		get '/matched_plays/:id', to: 'matched_plays#show'
		delete 'matched_plays/:id', to: 'matched_plays#destroy'
	end
end
