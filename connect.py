import requests

def post_metadata():
    res = requests.api.post('http://localost:5005/api/metadata')

if __name__ == '__main__':
    
    res = requests.api.get('http://localhost:5005/api/users')
    print(res.content)