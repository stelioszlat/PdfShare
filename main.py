from argparse import ArgumentParser
from extract import *
import os

if __name__=='__main__':

    # main script
    parser = ArgumentParser()

    subparsers = parser.add_subparsers()

    file_subparser = subparsers.add_parser('add')

    file_mutex_group = file_subparser.add_mutually_exclusive_group()
    file_group = file_subparser.add_argument_group()
    file_group.add_argument('-k', '--keywords', nargs='+')
    file_mutex_group.add_argument('-f', '--file', nargs=1, help="specify the file name (located in default folder")
    file_mutex_group.add_argument('-a', '--all', action='store_true', help="extract all files from the default directory (not recommended)")
    file_args = parser.parse_args()

    if file_args.keywords:
        keywords = args.keywords
    else:
        keywords = []

    if file_args.file:
        file_a = args.f[0]

        dir = os.environ['HOME'] + '/Files/'
        if file_a not in os.listdir(dir):
            print('Error: file ' + file_a + ' not found in default folder')
            exit()
        else:
            print('Extracting ' + file_a + ' from /Files')
            result = extract(keywords, dir+file_a)
            # print(result)
    
    if file_args.all:
        result = extract_all(keywords)
        # print(result)
