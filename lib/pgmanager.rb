# Functions provided by Professor Ciaraldi from WPI

require 'pg'

def connectToDB(dbPath)
    # Parse the path in the form:
    #   postgres://user:pass@hostname:port/dbname
    dbPath =~ %r|^postgres://(\S*):(\S*)@(\S*):(\d*)/(\S*)$|
     # Fill in with parsed fields
    PG::Connection.new(:host => $3, :port => $4, \
      :dbname => $5, :user => $1, :password => $2)
end

def testDBConnection(dbPath)
  connectToDB(dbPath)
  'Connected successfully!'
end

