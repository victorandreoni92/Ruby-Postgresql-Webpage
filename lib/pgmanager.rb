# Victor Andreoni
# Assignment 4
# Functions for managing database access

require 'pg'

# Function provided by Professor Ciaraldi from WPI
def connectToDB(dbPath)
    # Parse the path in the form:
    #   postgres://user:pass@hostname:port/dbname
    dbPath =~ %r|^postgres://(\S*):(\S*)@(\S*):(\d*)/(\S*)$|
     # Fill in with parsed fields
    PG::Connection.new(:host => $3, :port => $4, \
      :dbname => $5, :user => $1, :password => $2)
end

# Function to login user if it exists in users table
def loginUser(dbPath, username, password)

	# Get a connection with the database
	connection = connectToDB(dbPath)

  # Use prepared statement to prevent SQL injection
  connection.prepare("login_user", "SELECT * FROM users WHERE \
    username=$1 AND password=$2")

  response = connection.exec_prepared("login_user", [username, password])

	if response.ntuples() == 0
		return 1 # error code for invalid username and password
	else
		return response.getvalue(0, 1) # return fullname from response
	end
end

