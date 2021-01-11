Rails.application.routes.draw do
	get '*page', to: 'static#index', constraints: -> (req) do
		!req.xhr? && req.format.html?
	end

	root 'static#index'
	namespace :api, defaults: {format: 'json'} do
		get '/units', to: 'units#index'
	end
end
