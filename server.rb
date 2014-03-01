# Victor Andreoni
# CS4241 - Assignment 4
# Index Ruby file to use with sinatra as server

$: << File.expand_path(File.dirname(__FILE__) + "/lib") #Add lib folder to path

require 'sinatra'
require 'pgmanager'

get '/' do
	erb :index
end

get '/testdb' do
	testDBConnection(ENV['DATABASE_URL'])
end

