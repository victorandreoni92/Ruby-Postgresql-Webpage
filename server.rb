# Victor Andreoni
# CS4241 - Assignment 4
# Index Ruby file to use with sinatra as server

$: << File.expand_path(File.dirname(__FILE__) + "/lib") #Add lib folder to path

require 'sinatra'
require 'pgmanager'

#set :loginFail => false, :registerFail => false # Initial failure settings

enable :sessions

# Serve index of website
get '/' do
	erb :index
end

# Serve database panel. If no session exists, return error.
post '/panel' do
	if session[:loggeduser] == nil
		"You must be logged in to access the database panel!"
	else
		erb :panel
	end
end

get '/logoff' do
	session[:loggeduser] = nil
	redirect to('/')
end

# Login user by checking username and password with database - Called with ajax
post '/login' do
	@username = params[:username].to_s 
	@password = params[:password].to_s 
	
	result = loginUser(ENV['DATABASE_URL'], @username, @password)	# Execute login routine
	if result == 1 # Result code for login error, established inside pgmanager.rb
		return 1.to_s # Failure
	else
		session[:loggeduser] = result # Create session for logged user
		return 0.to_s # Success
	end
end
