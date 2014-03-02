# Victor Andreoni
# CS4241 - Assignment 4
# Index Ruby file to use with sinatra as server

$: << File.expand_path(File.dirname(__FILE__) + "/lib") #Add lib folder to path

require 'sinatra'
require 'pgmanager'

get '/' do
	erb :index
end

get '/panel' do
	if session[:loggeduser] == nil
		"You must be logged in to access the database panel!"
	else
		erb :panel
	end
end


get '/testdb' do
	testDBConnection(ENV['DATABASE_URL'])
end

post '/login' do
	result = loginUser(ENV['DATABASE_URL'], params)	# Execute login routine
	if result == 1 # result code for error
		return "Invalid username and password combination"
	else
		session[:loggeduser] = result
		redirect to('/panel')
	end
end

# Display SQL input form
get '/db_manager' do
  runDBShell(ENV['DATABASE_URL'])
end

# Receive input from SQL input form
post '/db_manager' do
  runDBShell(ENV['DATABASE_URL'], params)
end

