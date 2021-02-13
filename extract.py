from PyPDF2 import PdfFileReader
# from threading import Thread
from re import findall, IGNORECASE, ASCII
from os import environ, chdir, mkdir, getcwd
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

def parse_page(page):
    text = page.extractText()
    ex = re.match('', text)
    return ex

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

def extract_data(reader, keywords):

    workers = []
    data = {}
    text = ""
    pages = reader.getNumPages()
    # for i in range(pages):
    #     text += t.Thread(reader.getPage(i), target=parse_page)
    for i in range(pages):
        text += reader.getPage(i).extractText()

    for k in keywords:
        ex = findall(k, text, IGNORECASE | ASCII)
        data.update(k, len(ex))
        # print("{}: {}\n".format(k,len(ex)))

def open_pdf(file):
    return PdfFileReader(file)

if __name__=='__main__':

    change_dir()

    pdf_reader = open_pdf('demo1.pdf')

    executor = ThreadPoolExecutor()

    keywords = extract_meta_keywords(extract_meta(pdf_reader))
    extract_data(pdf_reader, keywords)



