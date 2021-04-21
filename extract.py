# from threading import Thread
from re import findall, IGNORECASE, ASCII
from os import environ, chdir, mkdir, getcwd, listdir
# from concurrent.futures import ThreadPoolExecutor

from tika.parser import from_file

import configparser as conf
from collections import Counter

mwd = getcwd()       # main working directory

TEST_PATH = environ['HOME'] + '/Files/'

def list_files(path=TEST_PATH):
    try:
        files = [f for f in listdir(path)]
    except FileExistsError:
        print('Error: no files found in default folder')
        exit(-1)
    finally:
        chdir(environ['HOME'] + '/Files')
        return list(filter(lambda f: f.endswith('.pdf'), files))

def extract_full(file, min=4, max=17, most=20):
    data = {}

    text = from_file(file)['content']
    ex = findall('\w+', text, flags=IGNORECASE)
    filtered_ex = filter(lambda x: len(x) >= min and len(x) <= max, ex)
    counted_ex = Counter(filtered_ex)
    print(Counter(filtered_ex))
    return dict(counted_ex.most_common(most))

def extract_keywords(keywords, text):
    data = {}
    for k in keywords:
        ex = findall(k, text, flags=IGNORECASE)
        data[k] = len(ex)
    return data

def extract_all(keywords):
    files = list_files()
    data = {}

    for f in files:
        data = {
            f: extract(keywords, f)
        }

    return data

def extract(keywords, file):

    parsed = from_file(file)
    default_keywords = (parsed['metadata']['Keywords']).split(',')
    # print(default_keywords.split(','))
    extracted = extract_keywords(keywords, parsed['content'])
    default = extract_keywords(default_keywords, parsed['content'])
    return {
        'metadata': parsed['metadata'],
        'keywords': extracted,
        'default': default
    }

    return data
