import os
import pjsua2 as pj
from . import log
from . import settings
from . import account
from . import buddy
from . import endpoint

class AppConfig:
    def __init__(self):
        # Logger
        self.logger = log.Logger()

        self.appConfig = settings.AppConfig()
        
        self.appConfig.epConfig.uaConfig.threadCnt = 0
        self.appConfig.epConfig.uaConfig.mainThreadOnly = True
        self.appConfig.epConfig.logConfig.writer = self.logger
        self.appConfig.epConfig.logConfig.filename = "pygui.log"
        self.appConfig.epConfig.logConfig.fileFlags = pj.PJ_O_APPEND
        self.appConfig.epConfig.logConfig.level = 5
        self.appConfig.epConfig.logConfig.consoleLevel = 5

    def loadConfig(self, cfg_file='pygui.js'):
        if cfg_file and os.path.exists(cfg_file):
            self.appConfig.loadFile(cfg_file)

        self.appConfig.epConfig.uaConfig.threadCnt = 0
        self.appConfig.epConfig.uaConfig.mainThreadOnly = True
        self.appConfig.epConfig.logConfig.writer = self.logger
        self.appConfig.epConfig.logConfig.level = 5
        self.appConfig.epConfig.logConfig.consoleLevel = 5