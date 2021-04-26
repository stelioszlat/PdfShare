from argparse import ArgumentParser
from extract import *
import os
from templates import *
from connect import *


def strip_metadata(metadata):
    file_title = metadata['metadata']['pdf:docinfo:title']
    # date_created= metadata['metadata']['Creation-Date']
    # date_modified = metadata['metadata']['Last-Modified']
    # author = metadata['metadata']['Author']
    keywords = metadata['keywords']
    return metadata_template(file_title, os.environ['USER'], keywords)

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
    args = parser.parse_args()

    if args.keywords:
        keywords = args.keywords
    else:
        keywords = []

    if args.file:
        file_a = args.file[0]

        dir = os.environ['HOME'] + '/Files/'
        if file_a not in os.listdir(dir):
            print('file ' + file_a + ' not found in default folder')
            exit()
        else:
            print('Extracting /Files/'+file_a)
            result = extract(keywords, dir+file_a)
            # print(result)
            stripped = strip_metadata(result)
            # print(stripped)
            # post stripped data
            result = post_metadata(stripped)
            if result:
                print('Added file successfully!')
                exit(1)

            print('Couldn\'t add file...try again')
            exit(-1)
    if args.all:
        result = extract_all(keywords)
        # print(result)
