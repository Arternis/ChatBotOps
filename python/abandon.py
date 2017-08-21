#!/usr/bin/python 

import sys
import os
import logging
from requests.auth import HTTPDigestAuth
from pygerrit.rest import GerritRestAPI
from requests.exceptions import RequestException

gitServer = os.environ.get('GERRIT_SERVER')
auth  = HTTPDigestAuth(os.environ.get('GERRIT_ID'), os.environ.get('GERRIT_TOKEN'))
rest = GerritRestAPI(url=gitServer, auth=auth)

def abandonFromID(reviewId):
  try:
    changeJSON = rest.get("changes/" + reviewId)
    print 'start to abandon ' + changeJSON['id']
    rest.post("changes/" + changeJSON['id'] + '/abandon')
  except RequestException as err:
    logging.error("Error: %s", str(err))

def main():
  if(len(sys.argv) < 2):
    print 'usage : python rebase reviewId1 reviewId2 ...'
    return;
  
  reviewIds = sys.argv[1:]

  for reviewId in reviewIds:
    print "abandon review for : " + reviewId 
    abandonFromID(reviewId)
  
if __name__ == '__main__':
  main()
