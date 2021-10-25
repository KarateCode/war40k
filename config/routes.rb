Rails.application.routes.draw do
	get '*page', to: 'static#index', constraints: -> (req) do
		!req.xhr? && req.format.html?
	end

	root 'static#index'
	namespace :api, defaults: {format: 'json'} do
		get '/units', to: 'units#index'
		get '/units/:id/variations', to: 'units#variations'
		get '/units/:id/variation-models', to: 'units#variation_models'
	end
end
