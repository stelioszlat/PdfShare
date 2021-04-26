from urllib3.exceptions import ConnectionError
from requests.api import *

def post_metadata(metadata):
    print('Posting metadata...')
    print(metadata)
    try:
        res = post('http://localhost:8080/api/metadata/new', json=metadata)
        print('Http Status code: ' + str(res.status_code))
        if res.status_code == 200:
            return res
    except ConnectionError:
        print('Error: couldn\'t connect to server...try again later')
        return 
    return 


if __name__ == '__main__':
    
    res = get('http://localhost:5005/api/users')
    print(res.content)