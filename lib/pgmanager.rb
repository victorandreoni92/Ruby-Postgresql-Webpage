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

# Function provided by Professor Ciaraldi from WPI
def testDBConnection(dbPath)
  connectToDB(dbPath)
  'Connected successfully!'
end

# Function provided by Professor Ciaraldi from WPI
# this function displays the SQL input form if no parameters
# are given, otherwise it connects to the database, executes
# the provided SQL and returns some HTML containing the results
# 
# Thanks, Prof. Pollice and his staff!
#
#
def runDBShell (dbPath, params=nil)
  if (params == nil)
<<EOS
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Database Manager</title>
    </head>
    <body>
        <h1>Enter SQL statements in the box below.</h1>
        <form method="post">
          <textarea name="sqlCode" rows="20" cols="150"></textarea><br /><br />
          <input type="submit" value="Submit">
        </form>
    </body>
  </html>
EOS
  else
    conn = connectToDB(dbPath) # connect to the database
    results = conn.exec(params[:sqlCode]) # execute the SQL contained in params
    strOut = ''
    results.each do |row| # loop through the result of the SQL query
      row.each do |column|
        strOut = strOut + ' ' + column.to_s # append to result string
      end
    end
    strOut + '<br /><br /><br /><a href="/db_manager">Enter another query</a>'
  end
end


# Function to login user if it exists in users table
def loginUser(dbPath, params)

	# Get username and password from parameters
	@user = params[:username]
	@pass = params[:password]
 
	# Get a connection with the database
	connection = connectToDB(dbPath)

  # Use prepared statement to prevent SQL injection
  connection.prepare("login_user", "SELECT * FROM users WHERE \
    username=$1 AND password=$2")

  response = connection.exec_prepared("login_user", [@user, @pass])

	#Query the database for the user and store results
	#response = connection.exec("SELECT * FROM users WHERE \
	# username='#{user}' AND password='#{pass}';")

	if response.ntuples() == 0
		return 1 # error code for invalid username and password
	else
		return response.getvalue(0, 1) # return username from response
	end
end

