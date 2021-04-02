from PyPDF2 import PdfFileReader
# from threading import Thread
from re import findall, IGNORECASE, ASCII

from os import environ, chdir, mkdir, getcwd, listdir
from concurrent.futures import ThreadPoolExecutor

mwd = getcwd()       # main working directory

def change_dir():

    try:
        path = environ['HOME']
        chdir(path)
        mkdir('Files')

    except FileExistsError:
        path += '/Files'
        chdir(path)

    # chdir(mwd)

def list_files():
    files = [f for f in listdir('.')]
    return files

# def parse_page(page):
#     text = page.extractText()
#     ex = findall()
#     return ex

def extract_meta_keywords(meta):
    # meta = {'/Keywords':'scalability, cloud management, big data, content serving application'}

    try:
        keywords = meta['/Keywords'].split(',')
        # print(keywords)
        if keywords: 
            return keywords
        else:
            print('No keywords found...')
    except KeyError:
        print(KeyError.with_traceback())

def extract_meta(reader):
    meta = reader.getDocumentInfo()
    return meta

def extract_user_keywords(reader, keywords):

    workers = []
    data = {}
    text = ""
    pages = reader.getNumPages()
    # for i in range(pages):
    #     text += t.Thread(reader.getPage(i), target=parse_page)
    for i in range(pages):
        text = reader.getPage(i).extractText()

        for k in keywords:
            ex = findall(k, text, IGNORECASE | ASCII)
            data[k] += len(ex)
            # print("{}: {}\n".format(k,len(ex)))
    return data

def extract_all(reader, min=4, max=20):
    data = []
    text = ""
    pages = reader.getNumPages()
    # for i in range(pages):
    #     text += t.Thread(reader.getPage(i), target=parse_page)
    for i in range(pages):
        text = reader.getPage(i).extractText()
        data += findall('\w+', text, IGNORECASE | ASCII)
    print(len(data))
    filtered_data = list(filter(lambda x: len(x) > min and len(x) < max , data))
    mapped_data = map(data.count, data)
    
    return list(mapped_data)


def open_pdf(file):
    return PdfFileReader(file)

if __name__=='__main__':

    change_dir()

    files = list_files()

    for f in files:
        pdf_reader = open_pdf(f)

        # executor = ThreadPoolExecutor()

        keywords = extract_meta_keywords(extract_meta(pdf_reader))
        print(extract_user_keywords(pdf_reader, keywords))



