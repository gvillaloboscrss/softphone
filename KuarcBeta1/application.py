import sys
import tkinter as tk
from tkinter import ttk
from tkinter import messagebox as msgbox
import pjsua2 as pj
import misc.log as log
import misc.accountsetting as accountsetting
import misc.account as account
import misc.buddy as buddy
import misc.endpoint as endpoint
import misc.settings as settings
import os
import traceback
import time
from misc.config import AppConfig
write = sys.stdout.write

class Application(ttk.Frame):
    """
    The Application main frame.
    """
    public_bool = False

    def __init__(self):
        ttk.Frame.__init__(self, name='application', width=200, height=300)
        self.pack(expand='yes', fill='both')
        self.master.title('Softphone Demo')
        self.master.geometry('400x400+100+100')

        # Logger and AppConfig
        self.logger = log.Logger()
        self.appConfig = AppConfig()  # Instantiate AppConfig

        # Accounts
        self.accList = []

        # GUI variables
        self.showLogWindow = tk.IntVar(value=0)
        self.quitting = False

        # Construct GUI
        self._createWidgets()

        # Log window
        self.logWindow = log.LogWindow(self)
        self._onMenuShowHideLogWindow()

        # Instantiate endpoint
        self.ep = endpoint.Endpoint()
        self.ep.libCreate()
        # Disable sound device usage
        aud_dev_mgr = self.ep.audDevManager()
        dev_count = aud_dev_mgr.getDevCount()
        try:
            aud_dev_mgr.setCaptureDev(0)  # Set the default input device
            aud_dev_mgr.setPlaybackDev(0)  # Set the default output device
            print("Default audio devices set successfully!")

        except pj.Error as err:
            print("Error occurred while setting audio devices: ", err)


    def saveConfig(self, filename='misc/pygui.js'):
        # Save disabled accounts since they are not listed in self.accList
        disabled_accs = [ac for ac in self.appConfig.appConfig.accounts if not ac.enabled]
        self.appConfig.appConfig.accounts = []

        # Get account configs from active accounts
        for acc in self.accList:
            acfg = settings.AccConfig()
            acfg.enabled = True
            acfg.config = acc.cfg
            for bud in acc.buddyList:
                acfg.buddyConfigs.append(bud.cfg)
            self.appConfig.appConfig.accounts.append(acfg)

        # Put back disabled accounts
        self.appConfig.appConfig.accounts.extend(disabled_accs)
        # Save
        self.appConfig.appConfig.saveFile(filename)

    def start(self, cfg_file='misc/pygui.js'):
        # Load config
        self.appConfig.loadConfig(cfg_file)

        # Initialize library
        self.appConfig.appConfig.epConfig.uaConfig.userAgent = "pygui-" + self.ep.libVersion().full
        self.ep.libInit(self.appConfig.appConfig.epConfig)
        self.master.title('Softphone Demo' + self.ep.libVersion().full)

        # Create transports
        if self.appConfig.appConfig.udp.enabled:
            self.ep.transportCreate(self.appConfig.appConfig.udp.type, self.appConfig.appConfig.udp.config)
        if self.appConfig.appConfig.tcp.enabled:
            self.ep.transportCreate(self.appConfig.appConfig.tcp.type, self.appConfig.appConfig.tcp.config)
        if self.appConfig.appConfig.tls.enabled:
            self.ep.transportCreate(self.appConfig.appConfig.tls.type, self.appConfig.appConfig.tls.config)

        # Add accounts
        for cfg in self.appConfig.appConfig.accounts:
            if cfg.enabled:
                self._createAcc(cfg.config)
                acc = self.accList[-1]
                for buddy_cfg in cfg.buddyConfigs:
                    self._createBuddy(acc, buddy_cfg)

        # Start library
        self.ep.libStart()

        # Start polling
        self._onTimer()
        
    
    def make_call(self):
        call_window = tk.Tk()
        call_window.title("Make a Call")

        label = tk.Label(call_window, text="Enter Extension:")
        label.pack(pady=10)

        extension_entry = tk.Entry(call_window)
        extension_entry.pack(pady=10)

        def initiate_call():
            extension = extension_entry.get()
            if extension:
                sip_uri = f"sip:{extension}@192.168.100.12"
                call = pj.Call(self.accList[0])
                call_prm = pj.CallOpParam(True)
                call_prm.opt.audioCount = 1
                call_prm.opt.videoCount = 0
                
                try:
                    call.makeCall(sip_uri, call_prm)
                except pj.Error as e:
                    print(f"Error making call: {e}")
                
                time.sleep(20)
                call_window.destroy()
            else:
                msgbox.showerror("Error", "Please enter a valid extension.")

        call_button = tk.Button(call_window, text="Call", command=initiate_call)
        call_button.pack(pady=10)

        call_window.mainloop()

    def _createAcc(self, acc_cfg):
        from test import TestServer
        server = TestServer()
        acc = account.Account(self, server.socketio, server)
        acc.on_create(server.account_ref) 
        server.assign_account(acc) 
        acc.cfg = acc_cfg
        self.accList.append(acc)
        self.updateAccount(acc)
        acc.create(acc.cfg)
        acc.cfgChanged = False
        self.updateAccount(acc)

    def _createBuddy(self, acc, buddy_cfg):
        bud = buddy.Buddy(self)
        bud.cfg = buddy_cfg
        bud.account = acc
        bud.create(acc, bud.cfg)
        self.updateBuddy(bud)
        acc.buddyList.append(bud)

    def updateWindowMenu(self):
		# Chat windows
        self.window_menu.delete(0, tk.END)
        for acc in self.accList:
            for c in acc.chatList:
                cmd = lambda arg=c: self._showChatWindow(arg)
                self.window_menu.add_command(label=c.title, command=cmd)
    
    def updateAccount(self, acc):
        if acc.deleting:
            return  # ignore
        iid = str(acc.randId)
        text = acc.cfg.idUri
        status = acc.statusText()

        values = (status,)
        if self.tv.exists(iid):
            self.tv.item(iid, text=text, values=values)
        else:
            self.tv.insert('', 'end', iid, open=True, text=text, values=values)

    def updateBuddy(self, bud):
        iid = 'buddy' + str(bud.randId)
        text = bud.cfg.uri
        status = bud.statusText()

        values = (status,)
        if self.tv.exists(iid):
            self.tv.item(iid, text=text, values=values)
        else:
            self.tv.insert(str(bud.account.randId), 'end', iid, open=True, text=text, values=values)


    def _createWidgets(self):
        self._createAppMenu()

        # Main pane, a Treeview
        self.tv = ttk.Treeview(self, columns=('Status'), show='tree')
        self.tv.pack(side='top', fill='both', expand='yes', padx=5, pady=5)

        # Handle close event
        self.master.protocol("WM_DELETE_WINDOW", self._onClose)

    def _createAppMenu(self):
        # Main menu bar
        top = self.winfo_toplevel()
        self.menubar = tk.Menu()
        top.configure(menu=self.menubar)
        self.window_menu = tk.Menu(self.menubar, tearoff=False)
        self.menubar.add_cascade(label="Window", menu=self.window_menu)
  
        # File menu
        file_menu = tk.Menu(self.menubar, tearoff=False)
        self.menubar.add_cascade(label="File", menu=file_menu)
        file_menu.add_command(label="Add account..", command=self._onMenuAddAccount)
        file_menu.add_command(label="Call..", command=self.make_call)

    def _showChatWindow(self, chat_inst):
        chat_inst.showWindow()

    def _getSelectedAccount(self):
        items = self.tv.selection()
        if not items:
            return None
        try:
            iid = int(items[0])
        except:
            return None
        accs = [acc for acc in self.accList if acc.randId == iid]
        if not accs:
            return None
        return accs[0]

    def _getSelectedBuddy(self):
        items = self.tv.selection()
        if not items:
            return None
        try:
            iid = int(items[0][5:])
            iid_parent = int(self.tv.parent(items[0]))
        except:
            return None

        accs = [acc for acc in self.accList if acc.randId == iid_parent]
        if not accs:
            return None

        buds = [b for b in accs[0].buddyList if b.randId == iid]
        if not buds:
            return None

        return buds[0]

    def _onTvRightClick(self, event):
        iid = self.tv.identify_row(event.y)
        if iid:
            self.tv.selection_set((iid,))
            acc = self._getSelectedAccount()
            if acc:
                self.accMenu.post(event.x_root, event.y_root)
            else:
                # A buddy is selected
                self.buddyMenu.post(event.x_root, event.y_root)

    def _onTimer(self):
        if not self.quitting:
            self.ep.libHandleEvents(10)
            if not self.quitting:
                self.master.after(50, self._onTimer)

    def _onClose(self):
        self.saveConfig()
        self.quitting = True
        self.ep.libDestroy()
        self.ep = None
        self.update()
        self.quit()

    def _onMenuAddAccount(self):
        cfg = pj.AccountConfig()
        dlg = accountsetting.Dialog(self.master, cfg)
        if dlg.doModal():
            self._createAcc(cfg)

    def _onMenuShowHideLogWindow(self):
        if self.showLogWindow.get():
            self.logWindow.deiconify()
        else:
            self.logWindow.withdraw()

def main():
    app = Application()
    app.start()
    app.mainloop()

if __name__ == '__main__':
    main()
