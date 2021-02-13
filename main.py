import argparse as arg
from extract import *


if __name__=='__main__':

    # main script
    change_dir()

    parser = arg.ArgumentParser()
    parser.add_argument('-h', '--help', 'usage instructions')
    parser.add_argument('-a', '--advanced', 'custom keywords, biased parsing...etc')
    parser.add_argument('-m', '--multiple', 'add multiple files at once')
    parser.add_argument('file',)

    fd = parser.file
    pdf_reader = open_pdf(fd)


    if parser.advanced:
        keywords = input('Enter keywords (seperated by comma, can be updated later)')
        
        keywords.split(',').join(extract_meta_keywords(extract_meta(pdf_reader)))
        