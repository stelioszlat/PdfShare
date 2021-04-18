# from threading import Thread
from re import findall, IGNORECASE, ASCII

from os import environ, chdir, mkdir, getcwd, listdir
# from concurrent.futures import ThreadPoolExecutor

from tika.parser import from_file

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

if __name__=='__main__':

    files = list_files()
    print(files)
    # parsed = from_file(TEST_PATH+'demo1.pdf')

    # print(parsed.keys())

