# Victor Andreoni
# Assignment 4
# Functions for managing database access

require 'pg'
require 'json'

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

# Function to register user. Checks if username already exists
def registerUser(dbPath, fullname, username, password)
	# Get a connection with the database
	connection = connectToDB(dbPath)
	
	# Use prepared statement to check if username is taken
	connection.prepare("check_username", "SELECT * FROM users WHERE \
		username=$1")
		
	usernameResponse = connection.exec_prepared("check_username", [username])

	if 	usernameResponse.ntuples() != 0
		return 1 # username is taken
	else
		# Register user with provided information
		connection.prepare("register_user", "INSERT INTO users (username, fullname, \
			password) VALUES ($1, $2, $3)")
		connection.exec_prepared("register_user", [username, fullname, password])
		
		# Process result
		return fullname # return fullname for session
	end
end

# Function to query the database and return the requested tuples
def queryDB(dbPath, name, company, year)
	# Change empty input to '%' for SQL query
	if name.to_s == "" then @pName = "%" end
	if company.to_s == "" then @pCompany = "%" end
	if year.to_s == "" 
		@pYear = 0 
	else
		@pYear = year.to_i
	end	

	# Get a connection with the database
	connection = connectToDB(dbPath)
	
	# Build SQL query - remove ';' in middle of strings to prevent SQL injection
	query = "SELECT * FROM smartphones;"
	
	if (name.to_s != "")
		query = query.delete(";") + " WHERE name ILIKE '%" + name.to_s.delete(";") + "%';"
	end
	
	if (company.to_s != "")
		if (name.to_s == "")
			query = query.delete(";") + " WHERE company ILIKE '%" + company.to_s.delete(";") + "%';"
		else
			query = query.delete(";") + " AND company ILIKE '%" + company.to_s.delete(";") + "%';"
		end
	end
	
	if (year.to_s != "")
		if (name.to_s == "" && company.to_s == "")
			query = query.delete(";") + " WHERE releaseyear = " + year.to_s.delete(";") + ";"
		else
			query = query.delete(";") + " AND releaseyear = " + year.to_s.delete(";") + ";"
		end
	end
		
	response = connection.exec(query)
	
	return response.values().to_json
end

# Function to add smartphones to database from data input by user
def addToDB(dbPath, code, name, company, year)
	# Get a connection with the database
	connection = connectToDB(dbPath)
	
	connection.prepare("check_model", "SELECT * FROM smartphones WHERE \
		model=$1")
	modelResponse = connection.exec_prepared("check_model", [code])
	
	if 	modelResponse.ntuples() != 0
		return 1.to_s # Model already exists
	else
		# Add smartphone with provided information
		connection.prepare("add_smartphone", "INSERT INTO smartphones (model, name, \
			releaseyear, company) VALUES ($1, $2, $3, $4)")
		connection.exec_prepared("add_smartphone", [code, name, year, company])
		
		# Process result
		return name # Return name of smartphone added
	end

end











