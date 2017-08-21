#!/usr/bin/python

import re

def checksha1(hashCode):
  if len(hashCode) != 41 or hashCode[0] != 'I':
    return False
  try:
    sha_int  = int(hashCode[1:], 16)
  except ValueError:
    return False
  return True

def isNumber(number):
  try: 
    val = int(number)
  except ValueError:
    print('The value ' + number + 'is not a number.')
    return False;

  return True;

