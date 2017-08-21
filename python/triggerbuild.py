#!/usr/bin/python 

import requests
import sys
import os
from utils import checksha1, isNumber
from requests.auth import HTTPDigestAuth
from pygerrit.rest import GerritRestAPI
from getbuildpass import getProjectName

gitServer = os.environ.get('GERRIT_SERVER')
auth  = HTTPDigestAuth(os.environ.get('GERRIT_ID'), os.environ.get('GERRIT_TOKEN'))
rest = GerritRestAPI(url=gitServer, auth=auth)

JENKINS_JOB=os.environ.get('JENKINS_SERVER') + "Easy_Android_Build_Harness/build"
JENKINS_ID=os.environ.get('JENKINS_ID')
JENKINS_TOKEN=os.environ.get('JENKINS_TOKEN')

#Get cherry pick command from Gerrit
def getCherryPickFromNumber(patch_number):
  changeJSON = rest.get("changes/" + patch_number + "?o=CURRENT_REVISION&o=DOWNLOAD_COMMANDS")
  cherrypick = str(changeJSON['revisions'][changeJSON['current_revision']]['fetch']['ssh']['commands']['Cherry-Pick'])
  return cherrypick

#Build target is changeID, we need to get each command by branch
def queryCherryPickFromID(changeID, cherryPicks):
  results = rest.get("changes/?q="+changeID)

  if (len(results) == 0):
    print "Can't find any patch review."
    return;

  for change in results:
    branch = str(change['branch'])
    number = str(change['_number'])
    project = str(change['project'])
    if branch not in cherryPicks:
      cherryPicks[branch] = []
      projectName = getProjectName(project, branch)
      if None is projectName:
        print "There is no build pass project in " + project + ", branch : " + branch 
        del cherryPicks[branch]
        continue;
      else:
        cherryPicks[branch].append(projectName)

    cherryPicks[branch].append(getCherryPickFromNumber(number))

def getparamValue(parameters, index):
  if index < len(parameters):
    return parameters[index]
  return ''

#Trigger build task in Jenkins
def triggerBuild(parameters):
  if len(parameters) < 2:
    print "Parameter is too few, need include project name and at least 1 patch"
    return
 
  data = {'json': '{"parameter":[{"name":"Project_Sku_Name", "value":"'+parameters[0]+'"}, {"name":"Patch_Command1", "value":"'+parameters[1]+'"}, {"name":"Patch_Command2", "value":"'+getparamValue(parameters, 2)+'"}, {"name":"Patch_Command3", "value":"'+getparamValue(parameters, 3)+'"}, {"name":"Patch_Command4", "value":"'+getparamValue(parameters,4)+'"}]}'}

  res = requests.post(JENKINS_JOB, auth=(JENKINS_ID, JENKINS_TOKEN), data=data)
  #print res.text
  print res.status_code

def BuildWithNumber(numbers):
  print "Start trigger build with numbers"
  change = rest.get("changes/" + numbers[0] + "?o=CURRENT_REVISION")

  if (len(change) == 0):
    print "Can't find any patch review."
    return;
  
  projectName = getProjectName(str(change['project']), str(change['branch']))
  if None is projectName:
    print "There is no build pass project in " + str(change['project']) + ", branch : " + str(change['branch']) 
    return;

  parameters = []
  parameters.append(projectName)

  for number in numbers: 
    parameters.append(getCherryPickFromNumber(number))

  triggerBuild(parameters);

def BuildWithChangeId(changeIds):
  print "Start trigger build with change ids"
  cherryPicks = dict()
  for change in changeIds: 
    queryCherryPickFromID(change, cherryPicks)

  for key in cherryPicks:
    triggerBuild(cherryPicks[key])

def main():
  if(len(sys.argv) < 2 or len(sys.argv) > 5):
    print 'usage : python triggerbuild ChangeId.\nusage : python triggerbuild ChangeId1 ChangeId2 ChangeId3 ChangeId4'
    return;

  changeIds = sys.argv[1:]
  print "trigger build for :"
  print changeIds

  if (isNumber(changeIds[0])):
    BuildWithNumber(changeIds)
  elif (checksha1(changeIds[0])):
    BuildWithChangeId(changeIds)
  else:
    print('Format invalid')
    exit(1)
  
if __name__ == '__main__':
  main()
