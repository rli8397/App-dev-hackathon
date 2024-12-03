from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from typing import Annotated
from fastapi import FastAPI, Query

app = FastAPI()

# Allow CORS for specific origins
origins = [
    "http://localhost:5173",  # Add your frontend origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# this is how we created our tables
#
# c = sqlite3.connect('server.db').cursor()
# c.execute("""CREATE TABLE lectures (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 title text, 
#                 description text, 
#                 slidesLink text, 
#                 zoomLink text, 
#                 zoomPassword text,
#                 date text
# )""")
# c.execute("""CREATE TABLE posts (
#                   id INTEGER PRIMARY KEY AUTOINCREMENT,
#                   postType text, 
#                   title text,
#                   description text,
#                   sender text,
#                   date text
#             )""")
# c.execute("""CREATE TABLE homeworkSubmissions (
#                 homeworkId int, 
#                 studentId int,
#                 name text,
#                 submissions text
# )""")
# c = sqlite3.connect('server.db').cursor()
# c.execute("""CREATE TABLE students (
#                 name text,
#                 email text, 
#                 UID text, 
#                 password text, 
#                 clubRole text
# )""")
postsFields = ['id', 'postType', 'title', 'description', 'sender', 'date']
lectureFields = ['id', 'title', 'description', 'slidesLink', 'zoomLink', 'zoomPassword', 'date']
homeworkFields = ['id', 'studentId', 'name', 'submissions']
studentFields = ['name', 'email', 'UID', 'password', 'clubRole']
# helper methods

# this is a helper function to translate query fetches to JSON format
def queryToJSON(fields: list, query: tuple):
    result = []
    for element in query:
        curr = dict()
        for i in range(len(fields)):
            curr[fields[i]] = element[i]
            i += 1
        result.append(curr)
    return result

# this runs getRequests and returns an arrays of json
def getRequest(columns: str, table: str, conditions: str = '', params: tuple = ()):
    conn = sqlite3.connect("server.db")
    try:
        c = conn.cursor()
        query = f"SELECT {columns} FROM {table}"
        if conditions:
            query += f" WHERE {conditions}"
        result = c.execute(query, params).fetchall()
        return result

    except sqlite3.Error as e:
        # Log the error (optional)
        return []  # Return an empty array on error

    finally:
        conn.close()
# returns a string with search conditions based on title, sender, and date 
# this string will be used to put after a WHERE sql statement
# will receive an array of objects
def queryString(conditions: dict):
    query_parts = []
    params = []
    for key, value in conditions.items():
        if value is not None:
            query_parts.append(f"{key} = ?")
            params.append(value)
    return " AND ".join(query_parts), tuple(params)


# bodies

#this defines the body of an Announcements
class Post(BaseModel):
    postType: str = ''
    title: str = 'No Title'
    description: str = 'No Description'
    sender: str = ''
    date: str = ''

class ToRemove(BaseModel):
    postType: str
    id: int

class HomeworkSubmission(BaseModel):
    hwId: int
    studentId: int
    name: str
    submission: str

class PostEdit(BaseModel):
    postId: int
    title: str = ''
    description: str = ''

class StudentBody(BaseModel):
    name: str = ''
    email: str = ''
    UID: str = ''
    password: str = ''
    clubRole: str = ''

@app.post('/add-student')
async def root(e: StudentBody):
    #opens database connection
    conn = sqlite3.connect("server.db")
    c = conn.cursor()

    #Insert query
    c.execute("INSERT INTO students (name, email, UID, password, clubRole) VALUES(?, ?, ?, ?, ?)", 
            (e.name, e.email, e.UID, e.password, e.clubRole))

    conn.commit()
    conn.close()

    return {'message': 'successfully added'}

@app.get('/get-student/{email}')
async def root(email: str, password: str = ''):
    searchInput = {
        'email': email,
        'password': password,
    }

    conditions, params = queryString(searchInput)
    query = getRequest('*', 'students', conditions, params)
    return queryToJSON(studentFields, query)

# homework submissions functions / requests
@app.get('/homeworkSubmissions') 
async def root(hwId: Annotated[int | None, Query(gt = -1)] = None, name: str | None = None):
    conditions = queryString({'homeworkId': hwId})

    query = getRequest('*', 'homeworkSubmissions', conditions)
    return queryToJSON(homeworkFields, query)


@app.post('/add-homeworkSubmission')
async def root(e: HomeworkSubmission):
    #opens database connection
    conn = sqlite3.connect("server.db")
    c = conn.cursor()

    #Insert query
    c.execute("INSERT INTO homeworkSubmissions (homeworkId, studentId, name, submissions) VALUES(?, ?, ?, ?)", 
            (e.hwId, e.studentId, e.name, e.submission))

    conn.commit()
    conn.close()

    return {'message': 'successfully added'}


# Posts functions / requests

# GET-REQUEST - gets posts from table posts. It receives certain conditions and will return based on them
# if nothing is received for a certain condition, then just assume anything is fine for that condition 
@app.get('/posts')
async def root(postType: str, title: str | None = None):
    searchInput = {
        'postType': postType,
        'title': title,
    }

    conditions, params = queryString(searchInput)
    query = getRequest('*', 'posts', conditions, params)
    return queryToJSON(postsFields, query)

    
# POST REQUEST - adds an post to any page
@app.post('/add-post')
async def add_element(element: Post):

    #opens database connection
    conn = sqlite3.connect("server.db")
    c = conn.cursor()

    #Insert query
    c.execute("INSERT INTO posts (postType, title, description, sender, date) VALUES(?, ?, ?, ?, ?)", 
            (element.postType, element.title, element.description, element.sender, element.date))

    conn.commit()
    conn.close()

    return {'message': 'successfully added'}

# DELETE REQUEST - deletes a post based on id
@app.delete('/remove-post')
async def remove_element(element: ToRemove):

    # establish connection with database
    conn = sqlite3.connect("server.db")
    c = conn.cursor()
    c.execute("DELETE FROM posts WHERE id=? AND postType=?", (element.id, element.postType))

    conn.commit()
    conn.close()

    return {'message': 'successfully removed'}

# Deletes any announcement posts from the posts table
@app.delete('/clear-announcements')
async def clear_elements():
    conn = sqlite3.connect('server.db')
    c = conn.cursor()

    c.execute("DELETE FROM posts WHERE postType='announcements'")

    conn.commit()
    conn.close()

    return {'message': 'successfully removed'}

# Deletes any homework posts from the posts table
@app.delete('/clear-homework')
async def clear_elements(): 
    conn = sqlite3.connect('server.db')
    c = conn.cursor()

    c.execute("DELETE FROM posts WHERE postType='homework'")

    conn.commit()
    conn.close()

    return {'message': 'successfully removed'}

@app.patch('/edit-post') 
async def edit_elements(e: PostEdit):

    conn = sqlite3.connect('server.db')
    c = conn.cursor()

    columns = []
    params = []

    # Add title dynamically if provided
    if e.title != '':
        columns.append("title=?")  # Add column with a placeholder
        params.append(e.title)     # Add value to params

    # Add description dynamically if provided
    if e.description != '':
        columns.append("description=?")
        params.append(e.description)

    # Add ID as the final parameter
    params.append(e.postId)
    if len(columns) > 0:
        query = f"UPDATE posts SET {', '.join(columns)} WHERE id=?"
        c.execute(query, params)  # Use the parameterized query
        conn.commit()
        conn.close() 

    return {'message': 'successfully updated'}

#this handles all lecture requests

#this defines the body of a lecture
class Lectures(BaseModel):
    title: str = ''
    description: str = ''
    slidesLink: str = ''
    zoomLink: str = ''
    zoomPassword: str = ''
    date: str = ''

@app.get('/lectures')
async def root():
    # query all lectures with all data
    query = getRequest('*', 'lectures', '')
    
    #translate them to JSON format then return them
    return queryToJSON(lectureFields, query)


#GET-REQUEST - gets lecture based on any information provided
@app.get('/search-lectures')
async def root(title: str = '', date: str=''):
    # creates search conditions based on whether any input was even received
    # for each parameter
    searchInput = {
        'title': title,
        'date': date
    }

    conditions = quertyString(searchInput)
    
    #open database connection
    query = getRequest('*', 'lectures', conditions)
    return queryToJSON(lectureFields, query)

# POST REQUEST - adds a lecture
@app.post('/add-lecture')
async def add_element(element: Lectures):

    #opens database connection
    conn = sqlite3.connect('server.db')
    c = conn.cursor()

    #Insert query
    c.execute("INSERT INTO lectures (title, description, slidesLink, zoomLink, zoomPassword, date) VALUES(?, ?, ?, ?, ?, ?)", 
            (element.title, element.description, element.slidesLink, element.zoomLink, element.zoomPassword, element.date))
    conn.commit()
    conn.close()

    return {'message': 'successfully added'}

# DELETE REQUEST - deletes an lecture based on id
@app.delete('/remove-lectures')
async def remove_element(element: ToRemove):
    conn = sqlite3.connect('server.db')
    c = conn.cursor()

    c.execute("DELETE FROM lectures WHERE id=?", (element.id, ))

    conn.commit()
    conn.close()

    return {'message': 'successfully removed'}

@app.delete('/clear-lectures')
async def clear_elements():
    conn = sqlite3.connect('server.db')
    c = conn.cursor()

    c.execute("DELETE FROM lectures")

    conn.commit()
    conn.close()

    return {'message': 'successfully removed'}
    