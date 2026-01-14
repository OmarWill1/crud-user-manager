from sqlite3 import connect 

connection_db = connect("Users.db")
cursor = connection_db.cursor() 


cursor.execute("SELECT * FROM USER")

for cur in cursor.fetchall():
    print(cur[1])


