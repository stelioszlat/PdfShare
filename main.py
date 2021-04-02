import argparse as arg
from extract import *
import pymongo

if __name__=='__main__':

    # main script
    change_dir()

    # parser = arg.ArgumentParser()
    # parser.add_argument('-h', '--help', help='usage instructions')
    # parser.add_argument('-a', '--advanced', help='custom keywords, biased parsing...etc')
    # parser.add_argument('-m', '--multiple', help='add multiple files at once')
    # parser.add_argument('file')

    # fd = parser.file
    # pdf_reader = open_pdf(fd)
    pdf_reader = open_pdf("demo1.pdf")

    # if parser.advanced:
    #     keywords = input('Enter keywords (seperated by comma, can be updated later)')
        
    #     keywords.split(',').join(extract_meta_keywords(extract_meta(pdf_reader)))
    
    meta_keywords = extract_meta_keywords(extract_meta(pdf_reader))
    user_keywords = ['cloud', 'computer', 'scale', 'data']


    keywords = extract_data(pdf_reader, None)
    
    print(keywords)
