#!/usr/bin/python

import sys, getopt
import subprocess
import time
import os

def merge(commit_id, branch):
  subprocess.check_call(['git', 'checkout', branch])
  time.sleep(3)
  subprocess.check_call(['git', 'cherry-pick', '-x', commit_id])
  time.sleep(1)
  subprocess.check_call(['git', 'fetch'])
  time.sleep(1)

def usage():
  print "Usage: cherrypick.sh <hash> branch_list"
  print "e.g. cherrypick.py a73c0e5e branch_list"

def main(argv):
  try:
    opts, args = getopt.getopt(argv,"h:",["help"])
  except getopt.GetoptError:
    usage();
    sys.exit(2)
  for opt, arg in opts:
    if opt in ("-h", "--help"):
      usage();
      sys.exit(1);

  cur_dir = os.getcwd()
  print cur_dir
  os.chdir("/home/arthurhung/data/Source/N/TEST/external/skia")

  if(len(argv) == 2) :
     commit_id = argv[0]
     branch_list = list()
     with open(argv[1]) as f:
       branch_list = f.read().splitlines()
     for branch in branch_list:
       merge(commit_id, branch)
     subprocess.check_call(['repo', 'upload'])
  else :
     usage()

  #os.chdir(cur_dir)

if __name__ == "__main__":
   main(sys.argv[1:])
