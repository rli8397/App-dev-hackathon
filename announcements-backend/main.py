from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3

# this is how we created out sqlite table
# conn = sqlite3.connect('announcements.db')
# c = conn.cursor()
# c.execute("""CREATE TABLE announcements (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 title text,
#                 description text,
#                 sender text,
#                 date text
#             )""")


app = FastAPI()

#this defines the body of an Announcements
class Announcements(BaseModel):
    title: str = ''
    description: str = ''
    sender: str = ''
    date: str = ''

class ToRemove(BaseModel):
    id: int = 0

#this is a helper function to translate query fetches to JSON format
def queryToJSON(query: tuple):
    result = []
    for (id, title, description, sender, date) in query:
        result.append({
            'id': id,
            'title': title,
            'description': description,
            'sender': sender,
            'date': date
        })
    return result

#GET-REQUEST - gets all announcements
@app.get('/announcements')
async def root():
    #open database connection
    conn = sqlite3.connect('announcements.db')
    c = conn.cursor()

    #query all announcements with all data and translate them to JSON format
    announcements = queryToJSON(c.execute("SELECT * FROM announcements").fetchall())
    conn.close()

    return announcements

#GET-REQUEST - gets announcement based on any information provided
@app.get('/search-announcements')
async def root(title: str = '', sender: str = '', date: str=''):
    # creates search conditions based on whether any input was even received
    # for each parameter
    searchConditions = ""
    queryVals = []

    
    # if a title was passed in 
    if (title != ''):
        searchConditions += "title=?"
        queryVals.append(title)

    # if a sender was passed in
    if (sender != ''):
        if (searchConditions != ""):
            searchConditions += " AND "
        searchConditions += "sender=?"
        queryVals.append(sender)

    #if a date was passed in
    if (date != ''):
        if (searchConditions != ""):
            searchConditions += " AND "
        searchConditions += "date=?"
        queryVals.append(date)

    #open database connection
    conn = sqlite3.connect('announcements.db')
    c = conn.cursor()

    # makes a query based on searchConditions and queryVals
    query = c.execute(f"""SELECT * FROM announcements 
                        WHERE {searchConditions}""", 
                    queryVals).fetchall()
    conn.close()
    announcements = queryToJSON(query)

    return announcements

# POST REQUEST - adds an announcement
@app.post('/add-announcement')
async def add_element(element: Announcements):

    #opens database connection
    conn = sqlite3.connect('announcements.db')
    c = conn.cursor()

    #Insert query
    c.execute("INSERT INTO announcements (title, description, sender, date) VALUES(?, ?, ?, ?)", 
            (element.title, element.description, element.sender, element.date))
    conn.commit()
    conn.close()

    return {'message': 'successfully added'}

# DELETE REQUEST - deletes an announcement based on id
@app.delete('/remove')
async def remove_element(element: ToRemove):
    #opens database connection
    conn = sqlite3.connect('announcements.db')
    c = conn.cursor()

    c.execute("DELETE FROM announcements WHERE id=?", (element.id, ))

    conn.commit()
    conn.close()

    return {'message': 'successfully removed'}
