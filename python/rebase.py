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

def rebaseFromID(reviewId):
  try:
    changeJSON = rest.get("changes/" + reviewId)
    data = {"base":""}
    print 'start to rebase ' + changeJSON['id']
    rest.post("changes/" + reviewId + '/rebase', json=data)
  except RequestException as err:
    logging.error("Error: %s", str(err))

def main():
  if(len(sys.argv) < 2):
    print 'usage : python rebase reviewId1 reviewId2 ...'
    return;
  
  reviewIds = sys.argv[1:]

  for reviewId in reviewIds:
    print "rebase review for : " + reviewId 
    rebaseFromID(reviewId)
  
if __name__ == '__main__':
  main()
