import datetime
import json
def metadata_template(filename, uploader, keywords):
    
    d = datetime.datetime.now().strftime("%a %d %b %Y %H:%M:%S")

    t = { 
        'fileName':filename,       
        'uploader':uploader,    
        'dateAdded':str(d),        
        'dateModified':str(d),        
        'times_searched':0,             # not required
        'nodes':[],                 # not required, added after initial post     
        'keywords': keywords
    }

    return json.dumps(t)

def index_template(filename, useradded):
    t = {
        'file_name':filename,
        'user_added':useradded,
        'owners': []
    }

    return t


if __name__=='__main__':
    t = metadata_template('file', 'me', '{"word":2, "another":1}')
    print(t)