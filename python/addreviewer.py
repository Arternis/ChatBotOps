#!/usr/bin/python 

import requests
import lxml
import sys
import subprocess
import os
from requests.auth import HTTPDigestAuth
from pygerrit.rest import GerritRestAPI

gitServer = os.environ.get('GERRIT_SERVER')
auth  = HTTPDigestAuth(os.environ.get('GERRIT_ID'), os.environ.get('GERRIT_TOKEN'))
rest = GerritRestAPI(url=gitServer, auth=auth)

def addreviewer(changeId, reviewer):
  print 'Start add review for ' + changeId + ', REVIEWER = ' + reviewer
  payload = {"reviewer": reviewer }
  url = 'changes/'+ changeId +'/reviewers'
  try:
    res = rest.post(url, json=payload)
    print res
  except requests.HTTPError as e:
    print e.response
 
def queryChangefromID(changeID):
  results = rest.get("changes/?q="+changeID)
  changeIds = []
  for change in results:
    changeIds.append(str(change['_number']))
  return changeIds

def checkchangeId(hashCode):
  if len(hashCode) != 41:
    return False
  try:
    sha_int  = int(hashCode[1:], 16)
  except ValueError:
    return False
  return True

def checknumber(changeId):
  try:
    number_int = int(changeId, 10)
  except ValueError:
    return False
  return True

def main():
  if(len(sys.argv) != 3):
    print 'usage : python addreviewer ChangeId reviewer'
    return;
  reviewer = sys.argv[2]
  changeId = sys.argv[1]

  if checkchangeId(changeId) :
    changeIds = queryChangefromID(changeId)
    for Id in changeIds:
      addreviewer(Id, reviewer)
  elif checknumber(changeId) :
    addreviewer(changeId, reviewer)
  else:
    print "Invalid ChangeId format..."

  print 'All jobs done.'

if __name__ == '__main__':
  main()
