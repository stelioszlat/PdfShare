import datetime

def metadata_template(filename, user_added, keywords):
    
    d = datetime.datetime.now().strftime("%a %d %b %Y %H:%M:%S")

    t = { 
        'file_name':filename,       
        'user_added':user_added,    
        'date_added':str(d),        
        'last_moded':str(d),        
        'times_searched':0,             
        'nodes':[],                     
        'keywords': keywords       
    }

    return t

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