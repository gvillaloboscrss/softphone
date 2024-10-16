{ 
   "EpConfig":             { 
      "UaConfig":             { 
         "maxCalls":             4,
         "threadCnt":            0,
         "mainThreadOnly":       true,
         "nameserver":           [ ],
         "userAgent":            "pygui-2.14.1",
         "stunServer":           [ ],
         "stunTryIpv6":          false,
         "stunIgnoreFailure":    true,
         "natTypeInSdp":         1,
         "mwiUnsolicitedEnabled": true,
         "enableUpnp":           false,
         "upnpIfName":           ""
      },
      "LogConfig":            { 
         "msgLogging":           1,
         "level":                5,
         "consoleLevel":         5,
         "decor":                25328,
         "filename":             "pygui.log",
         "fileFlags":            4360
      },
      "MediaConfig":          { 
         "clockRate":            16000,
         "sndClockRate":         0,
         "channelCount":         1,
         "audioFramePtime":      20,
         "maxMediaPorts":        254,
         "hasIoqueue":           true,
         "threadCnt":            1,
         "quality":              8,
         "ptime":                0,
         "noVad":                false,
         "ilbcMode":             30,
         "txDropPct":            0,
         "rxDropPct":            0,
         "ecOptions":            0,
         "ecTailLen":            200,
         "sndRecLatency":        100,
         "sndPlayLatency":       140,
         "jbInit":               -1,
         "jbMinPre":             -1,
         "jbMaxPre":             -1,
         "jbMax":                -1,
         "jbDiscardAlgo":        2,
         "sndAutoCloseTime":     1,
         "vidPreviewEnableNative": true
      }
   },
   "transports":           [ 
      { 
         "type":                 1,
         "enabled":              true,
         "TransportConfig":      { 
            "port":                 0,
            "portRange":            0,
            "publicAddress":        "",
            "boundAddress":         "",
            "qosType":              0,
            "qosParams":            { 
               "qos.flags":            0,
               "qos.dscp_val":         0,
               "qos.so_prio":          0,
               "qos.wmm_prio":         0
            },
            "TlsConfig":            { 
               "CaListFile":           "",
               "certFile":             "",
               "privKeyFile":          "",
               "password":             "",
               "CaBuf":                "",
               "certBuf":              "",
               "privKeyBuf":           "",
               "method":               0,
               "ciphers":              [ ],
               "verifyServer":         false,
               "verifyClient":         false,
               "requireClientCert":    false,
               "msecTimeout":          0,
               "qosType":              0,
               "qosParams":            { 
                  "qos.flags":            0,
                  "qos.dscp_val":         0,
                  "qos.so_prio":          0,
                  "qos.wmm_prio":         0
               },
               "qosIgnoreError":       true
            }
         }
      },
      { 
         "type":                 2,
         "enabled":              true,
         "TransportConfig":      { 
            "port":                 0,
            "portRange":            0,
            "publicAddress":        "",
            "boundAddress":         "",
            "qosType":              0,
            "qosParams":            { 
               "qos.flags":            0,
               "qos.dscp_val":         0,
               "qos.so_prio":          0,
               "qos.wmm_prio":         0
            },
            "TlsConfig":            { 
               "CaListFile":           "",
               "certFile":             "",
               "privKeyFile":          "",
               "password":             "",
               "CaBuf":                "",
               "certBuf":              "",
               "privKeyBuf":           "",
               "method":               0,
               "ciphers":              [ ],
               "verifyServer":         false,
               "verifyClient":         false,
               "requireClientCert":    false,
               "msecTimeout":          0,
               "qosType":              0,
               "qosParams":            { 
                  "qos.flags":            0,
                  "qos.dscp_val":         0,
                  "qos.so_prio":          0,
                  "qos.wmm_prio":         0
               },
               "qosIgnoreError":       true
            }
         }
      },
      { 
         "type":                 3,
         "enabled":              false,
         "TransportConfig":      { 
            "port":                 0,
            "portRange":            0,
            "publicAddress":        "",
            "boundAddress":         "",
            "qosType":              0,
            "qosParams":            { 
               "qos.flags":            0,
               "qos.dscp_val":         0,
               "qos.so_prio":          0,
               "qos.wmm_prio":         0
            },
            "TlsConfig":            { 
               "CaListFile":           "",
               "certFile":             "",
               "privKeyFile":          "",
               "password":             "",
               "CaBuf":                "",
               "certBuf":              "",
               "privKeyBuf":           "",
               "method":               0,
               "ciphers":              [ ],
               "verifyServer":         false,
               "verifyClient":         false,
               "requireClientCert":    false,
               "msecTimeout":          0,
               "qosType":              0,
               "qosParams":            { 
                  "qos.flags":            0,
                  "qos.dscp_val":         0,
                  "qos.so_prio":          0,
                  "qos.wmm_prio":         0
               },
               "qosIgnoreError":       true
            }
         }
      }
   ],
   "accounts":             [ 
      { 
         "enabled":              true,
         "AccountConfig":        { 
            "priority":             0,
            "idUri":                "sip:1@192.168.100.13",
            "AccountRegConfig":     { 
               "registrarUri":         "sip:192.168.100.13",
               "registerOnAdd":        true,
               "timeoutSec":           300,
               "retryIntervalSec":     300,
               "firstRetryIntervalSec": 0,
               "randomRetryIntervalSec": 10,
               "delayBeforeRefreshSec": 5,
               "dropCallsOnFail":      false,
               "unregWaitMsec":        4000,
               "proxyUse":             3,
               "contactParams":        "",
               "headers":              [ ]
            },
            "AccountSipConfig":     { 
               "proxies":              [ ],
               "contactForced":        "",
               "contactParams":        "",
               "contactUriParams":     "",
               "authInitialEmpty":     false,
               "authInitialAlgorithm": "",
               "transportId":          -1,
               "authCreds":            [ 
                  { 
                     "scheme":               "digest",
                     "realm":                "*",
                     "username":             "1",
                     "dataType":             0,
                     "data":                 "golpiumiuyiuu",
                     "akaK":                 "",
                     "akaOp":                "",
                     "akaAmf":               ""
                  }
               ]
            },
            "AccountCallConfig":    { 
               "holdType":             0,
               "prackUse":             0,
               "timerUse":             1,
               "timerMinSESec":        90,
               "timerSessExpiresSec":  1800
            },
            "AccountPresConfig":    { 
               "publishEnabled":       false,
               "publishQueue":         true,
               "publishShutdownWaitMsec": 2000,
               "pidfTupleId":          "",
               "headers":              [ ]
            },
            "AccountMwiConfig":     { 
               "enabled":              false,
               "expirationSec":        3600
            },
            "AccountNatConfig":     { 
               "sipStunUse":           0,
               "mediaStunUse":         2,
               "sipUpnpUse":           0,
               "mediaUpnpUse":         0,
               "nat64Opt":             0,
               "iceEnabled":           false,
               "iceTrickle":           0,
               "iceMaxHostCands":      -1,
               "iceAggressiveNomination": true,
               "iceNominatedCheckDelayMsec": 400,
               "iceWaitNominationTimeoutMsec": 10000,
               "iceNoRtcp":            false,
               "iceAlwaysUpdate":      true,
               "turnEnabled":          false,
               "turnServer":           "",
               "turnConnType":         17,
               "turnUserName":         "",
               "turnPasswordType":     0,
               "turnPassword":         "",
               "contactRewriteUse":    1,
               "contactRewriteMethod": 6,
               "viaRewriteUse":        1,
               "sdpNatRewriteUse":     0,
               "sipOutboundUse":       1,
               "sipOutboundInstanceId": "",
               "sipOutboundRegId":     "",
               "udpKaIntervalSec":     15,
               "udpKaData":            "\r\n",
               "contactUseSrcPort":    1
            },
            "AccountMediaConfig":   { 
               "lockCodecEnabled":     true,
               "streamKaEnabled":      false,
               "srtpUse":              0,
               "srtpSecureSignaling":  1,
               "SrtpOpt":              { 
                  "cryptos":              [ ],
                  "keyings":              [ ]
               },
               "ipv6Use":              0,
               "TransportConfig":      { 
                  "port":                 4000,
                  "portRange":            0,
                  "publicAddress":        "",
                  "boundAddress":         "",
                  "qosType":              0,
                  "qosParams":            { 
                     "qos.flags":            0,
                     "qos.dscp_val":         0,
                     "qos.so_prio":          0,
                     "qos.wmm_prio":         0
                  },
                  "TlsConfig":            { 
                     "CaListFile":           "",
                     "certFile":             "",
                     "privKeyFile":          "",
                     "password":             "",
                     "CaBuf":                "",
                     "certBuf":              "",
                     "privKeyBuf":           "",
                     "method":               0,
                     "ciphers":              [ ],
                     "verifyServer":         false,
                     "verifyClient":         false,
                     "requireClientCert":    false,
                     "msecTimeout":          0,
                     "qosType":              0,
                     "qosParams":            { 
                        "qos.flags":            0,
                        "qos.dscp_val":         0,
                        "qos.so_prio":          0,
                        "qos.wmm_prio":         0
                     },
                     "qosIgnoreError":       true
                  }
               },
               "rtcpMuxEnabled":       false,
               "useLoopMedTp":         false,
               "enableLoopback":       false,
               "rtcpXrEnabled":        false
            },
            "AccountVideoConfig":   { 
               "autoShowIncoming":     false,
               "autoTransmitOutgoing": false,
               "windowFlags":          0,
               "defaultCaptureDevice": -1,
               "defaultRenderDevice":  -2,
               "rateControlMethod":    0,
               "rateControlBandwidth": 0,
               "startKeyframeCount":   0,
               "startKeyframeInterval": 0
            }
         },
         "buddies":              [ ]
      }
   ]
}