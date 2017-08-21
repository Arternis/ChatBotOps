#!/usr/bin/python 

import sys

def main():
  if(len(sys.argv) < 3):
    print 'usage : python testpython name value'
    return;
  
  name = sys.argv[1]
  value = sys.argv[2]

  print "Hi, I got name = " + name + ", value = " + value;
  
if __name__ == '__main__':
  main()
