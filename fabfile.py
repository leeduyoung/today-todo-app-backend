import os
import json
from fabric import colors
from fabric.api import env, local, run, cd, puts
 
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# deploy.json파일을 불러와 envs변수에 저장합니다.
with open(os.path.join(PROJECT_DIR, "deploy.json")) as f:
    envs = json.loads(f.read())

REMOTE_WORKDIR = envs['REMOTE_WORKDIR']
USERNAME = envs['REMOTE_USER']
PASSWORD = envs['REMOTE_PASSWORD']
PROD_HOST = envs['PROD_HOST']
DEMO_HOST = envs['DEMO_HOST']

def test():
    with cd(REMOTE_WORKDIR):
        run('git stash save --keep-index', quiet=True)
        run('git stash drop', quiet=True)
        run('sudo git pull')
        run('pm2 restart all')
        # run('sudo yarn start')

def demo():
    #DEMO 서버에 접속할 host에 대한 접속정보
    env.user = USERNAME
    env.hosts = [DEMO_HOST]
    env.password = PASSWORD

def prod():
    #PROD 서버에 접속할 host에 대한 접속정보
    env.user = USERNAME
    env.hosts = [PROD_HOST]
    env.password = PASSWORD

def runserver(mode='dev'):
    local("NODE_ENV=%s ./bin/www" % (mode))

def deploy():
    with cd(REMOTE_WORKDIR):
        puts(colors.blue("Updating project folder -> %s:%s") % (env.host, env.port))
        run('git stash save --keep-index', quiet=True)
        run('git stash drop', quiet=True)
        run('sudo git pull')
        run('npm install')
        run('pm2 restart all')