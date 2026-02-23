import type { BatteryType } from '@camp42/shared';

/* ========================================================= *\
 *  Device info                                              *
\* ========================================================= */

/** Device info returned by the list-devices endpoint. */
export interface DeviceInfo {
  /** Device serial number. */
  sn: string;
  /** User-assigned device name. */
  deviceName: string;
  /** Whether the device is online. 0: offline, 1: online. */
  online: 0 | 1;
  /** Product model name (e.g. "DELTA Pro 3"). */
  productName: string;
}

/* ========================================================= *\
 *  Sub-interfaces                                           *
\* ========================================================= */

/** Entry in the `bms_kitInfo.watts` array (Delta 2 Max). */
export interface BmsKitWattsEntry {
  /** Application state. */
  appState: number;
  /** Current power (W). */
  curPower: number;
  /** Application firmware version. */
  appVer: number;
  /** Battery level SOC (float). */
  f32Soc: number;
  /** Battery level SOC (integer). */
  soc: number;
  /** Availability flag. */
  avaFlag: number;
  /** Device serial number. */
  sn: string;
  /** Detail code. */
  detail: number;
  /** Battery type code. */
  type: number;
  /** Loader firmware version. */
  loadVer: number;
}

/** Entry in the `pvDcChgSettingList.listInfo` array (Delta Pro 3). */
export interface PvDcChgSettingEntry {
  /** PV plug index identifier. */
  pvPlugIndex: string;
  /** PV charging current limit (A). */
  pvChgAmpLimit: number;
  /** PV charging voltage specification. */
  pvChgVolSpec: string;
}

/* ========================================================= *\
 *  River 2 Pro state                                        *
\* ========================================================= */

/** Device state for the RIVER 2 Pro. */
export interface River2ProState {
  /** Total output real-time power (W). */
  "pd.wattsOutSum": number;
  /** DC output real-time power (W). */
  "pd.carWatts": number;
  /** USB-A output real-time power (W). */
  "pd.usb1Watts": number;
  /** USB-C input real-time power (W). */
  "pd.typecChaWatts": number;
  /** USB-C output real-time power (W). */
  "pd.typec1Watts": number;
  /** Battery level. */
  "pd.soc": number;
  /** 12V DC output on/off. */
  "pd.carState": number;
  /** Energy management on/off. */
  "pd.watchIsConfig": number;
  /** Backup reserve. */
  "pd.bpPowerSoc": number;
  /** Remaining charge time (min). */
  "bms_bmsStatus.remainTime": number;
  /** Battery time remaining (min). */
  "bms_emsStatus.dsgRemainTime": number;
  /** Charge limit. */
  "bms_emsStatus.maxChargeSoc": number;
  /** Discharge limit. */
  "bms_emsStatus.minDsgSoc": number;
  /** AC output on/off. 1: on, 0: off. */
  "mppt.cfgAcEnabled": number;
  /** X-Boost on/off. 1: on, 0: off. */
  "mppt.cfgAcXboost": number;
  /** AC output voltage (V). */
  "mppt.cfgAcOutVol": number;
  /** AC output frequency (Hz). */
  "mppt.cfgAcOutFreq": number;
  /** DC input real-time power (W). */
  "mppt.inWatts": number;
  /** AC input real-time power (W). */
  "inv.inputWatts": number;
  /** AC output real-time power (W). */
  "inv.outputWatts": number;
}

/* ========================================================= *\
 *  Delta 2 Max state                                        *
\* ========================================================= */

/** Device state for the DELTA 2 Max. */
export interface Delta2MaxState {
  /* ------------------------------------------------------- *\
   *  pd.* - Power delivery                                  *
  \* ------------------------------------------------------- */

  /** Total input power (W). */
  "pd.wattsInSum": number;
  /** Total output power (W). */
  "pd.wattsOutSum": number;
  /** Show SOC. */
  "pd.soc": number;
  /** Backup reserve percentage. */
  "pd.bpPowerSoc": number;
  /** PD BEEP mode. 0: Normal, 1: Mute. */
  "pd.beepMode": number;
  /** Type-C 2 output power (W). */
  "pd.typec2Watts": number;
  /** PV1 power (W). */
  "pd.pv1ChargeWatts": number;
  /** XT150 No. 1 interface power (W). */
  "pd.XT150Watts1": number;
  /** XT150 No. 2 interface power (W). */
  "pd.XT150Watts2": number;
  /** ICO flag bit. */
  "pd.icoBytes": number[];
  /** Common USB1 output power (W). */
  "pd.usb1Watts": number;
  /** Power management configuration. 0: disable, 1: enable. */
  "pd.watchIsConfig": number;
  /** Type-C 2 temperature (C). */
  "pd.typec2Temp": number;
  /** CAR port use time (s). */
  "pd.carUsedTime": number;
  /** Type-C 1 output power (W). */
  "pd.typec1Watts": number;
  /** Charging/discharging status on screen. 1: discharging, 2: charging. */
  "pd.chgDsgState": number;
  /** PV2 charging type. 0: none, 1: adapter, 2: solar panel. */
  "pd.pv2ChargeType": number;
  /** GNP bit0-1. */
  "pd.otherKitState": number;
  /** Whether AC Always On suspends due to manual operations. */
  "pd.acAutoPause": number;
  /** Cumulative DC power discharged for PD (Wh). */
  "pd.dsgPowerDC": number;
  /** Type-C use time (s). */
  "pd.typecUsedTime": number;
  /** PD LCD brightness level. 0-3. */
  "pd.brightLevel": number;
  /** AC Always On. 0: none, 1: enable. */
  "pd.acAutoOnCfg": number;
  /** New AC Always On configuration. 0: disable, 1: enable. */
  "pd.newAcAutoOnCfg": number;
  /** Minimum SOC for enabling the new AC Always On feature. */
  "pd.minAcSoc": number;
  /** Number of relay disconnections. */
  "pd.relaySwitchCnt": number;
  /** PV1 charging type. 0: none, 1: adapter, 2: solar panel. */
  "pd.pv1ChargeType": number;
  /** PD CAR button status. 0: off, 1: on. */
  "pd.carState": number;
  /** Inverter use time (s). */
  "pd.invUsedTime": number;
  /** Type-C 1 temperature (C). */
  "pd.typec1Temp": number;
  /** DC charging time (s). */
  "pd.dcInUsedTime": number;
  /** PD CAR temperature (C). */
  "pd.carTemp": number;
  /** PD product model. */
  "pd.model": number;
  /** Wi-Fi auto recovery after power on. */
  "pd.wifiAutoRcvy": number;
  /** PD available time (min). >0: charging, <0: discharging. */
  "pd.remainTime": number;
  /** Hysteresis SOC. */
  "pd.hysteresisAdd": number;
  /** Cumulative solar power charged for PD (Wh). */
  "pd.chgSunPower": number;
  /** Prioritize solar power usage. */
  "pd.pvChargePrioSet": number;
  /** Cumulative AC power discharged (Wh). */
  "pd.dsgPowerAC": number;
  /** qc_usb2 output power (W). */
  "pd.qcUsb2Watts": number;
  /** Wireless charging output power (W). */
  "pd.wireWatts": number;
  /** Cumulative AC power charged for PD (Wh). */
  "pd.chgPowerAC": number;
  /** PD LCD screen-off duration (s). 0: never off. */
  "pd.lcdOffSec": number;
  /** Wi-Fi version. */
  "pd.wifiVer": number;
  /** qc_usb1 output power (W). */
  "pd.qcUsb1Watts": number;
  /** Reserve 2 bytes for PD. */
  "pd.reserved": number[];
  /** Cumulative DC power charged for PD (Wh). */
  "pd.chgPowerDC": number;
  /** PD standby duration before auto shutdown (min). 0: never. */
  "pd.standbyMin": number;
  /** PD error code. */
  "pd.errCode": number;
  /** PV2 power (W). */
  "pd.pv2ChargeWatts": number;
  /** CAR output power (W). */
  "pd.carWatts": number;
  /** Common USB2 output power for PD (W). */
  "pd.usb2Watts": number;
  /** Inverter output power (W). */
  "pd.invOutWatts": number;
  /** PD system version. */
  "pd.sysVer": number;
  /** Inverter input power (W). */
  "pd.invInWatts": number;
  /** PD DC button status. 0: off, 1: on. */
  "pd.dcOutState": number;
  /** BMS kit state flags. */
  "pd.bmsKitState": number[];
  /** USB QC use time (s). */
  "pd.usbqcUsedTime": number;
  /** USB use time (s). */
  "pd.usbUsedTime": number;
  /** MPPT use time (s). */
  "pd.mpptUsedTime": number;
  /** Wi-Fi signal strength. */
  "pd.wifiRssi": number;
  /** PD run reporting interval (ms). */
  "pd.pdRunIncre": number;
  /** BMS info reporting interval (ms). */
  "pd.bmsInfoIncre": number;
  /** BMS info full reporting interval (ms). */
  "pd.bmsInfoFull": number;
  /** PD info reporting interval (ms). */
  "pd.pdInfoIncre": number;
  /** PD info full reporting interval (ms). */
  "pd.pdInfoFull": number;
  /** BMS run reporting interval (ms). */
  "pd.bmsRunIncre": number;

  /* ------------------------------------------------------- *\
   *  inv.* - Inverter                                        *
  \* ------------------------------------------------------- */

  /** AC charging mode. 0: full power, 1: mute. */
  "inv.cfgAcWorkMode": number;
  /** Discharging power (W). */
  "inv.outputWatts": number;
  /** Inverter output frequency (Hz). */
  "inv.invOutFreq": number;
  /** Fan status. 0: disabled, 1-3: level. */
  "inv.fanState": number;
  /** AC charging power (W). */
  "inv.acChgRatedPower": number;
  /** X-Boost switch. 0: off, 1: on. */
  "inv.cfgAcXboost": number;
  /** INV temperature (C). */
  "inv.outTemp": number;
  /** Inverter actual output voltage (mV). */
  "inv.invOutVol": number;
  /** Charging power (W). */
  "inv.inputWatts": number;
  /** AC switch. 0: off, 1: on. */
  "inv.cfgAcEnabled": number;
  /** Inverter output current (mA). */
  "inv.invOutAmp": number;
  /** Auto shutdown when no load (min). 0: never. */
  "inv.standbyMin": number;
  /** DC input voltage (mV). */
  "inv.dcInVol": number;
  /** Max charging power for AC slow charging (W). */
  "inv.SlowChgWatts": number;
  /** DC input current (mA). */
  "inv.dcInAmp": number;
  /** Balance mode. 0: current, 1: voltage. */
  "inv.prBalanceMode": number;
  /** DC temperature (C). */
  "inv.dcInTemp": number;
  /** Output voltage configured for the inverter (V). */
  "inv.cfgAcOutVol": number;
  /** Output frequency configured for the inverter (Hz). */
  "inv.cfgAcOutFreq": number;
  /** INV error code. */
  "inv.errCode": number;
  /** AC charging pause flag. 1: charging stopped. */
  "inv.chgPauseFlag": number;
  /** Inverter input frequency (Hz). */
  "inv.acInFreq": number;
  /** AC bypass auto start. 0: disable, 1: enable. */
  "inv.acPassbyAutoEn": number;
  /** Discharging type. 1: AC, 2: PR, 3: BC. */
  "inv.dischargeType": number;
  /** Charger type. 1: AC, 2: DC adapter, 3: solar, 4: CC, 5: BC. */
  "inv.chargerType": number;
  /** Inverter input current (mA). */
  "inv.acInAmp": number;
  /** Inverter input voltage (mV). */
  "inv.acInVol": number;
  /** Max charging power for AC fast charging (W). */
  "inv.FastChgWatts": number;
  /** AC fast/slow charging dip switch. 0: unknown, 1: fast, 2: slow. */
  "inv.acDipSwitch": number;
  /** PSDR model code. */
  "inv.invType": number;
  /** INV system version. */
  "inv.sysVer": number;
  /** Reserve 8 bytes. */
  "inv.reserved": number[];

  /* ------------------------------------------------------- *\
   *  mppt.* - MPPT / Solar controller                        *
  \* ------------------------------------------------------- */

  /** Error code. byte0: mppt, byte1: car, byte2: dc24v. */
  "mppt.faultCode": number;
  /** DCDC24V switch status. 0: off, 1: on. */
  "mppt.dc24vState": number;
  /** PV2 charging pause flag. 1: charging stopped. */
  "mppt.pv2ChgPauseFlag": number;
  /** PV1 input current (mA). */
  "mppt.inAmp": number;
  /** PV2 charging status. 0: disabled, 1: charging, 2: standby. */
  "mppt.pv2ChgState": number;
  /** PV1 input voltage (mV). */
  "mppt.inVol": number;
  /** Auto shutdown when no load (min). 0: never. */
  "mppt.carStandbyMin": number;
  /** Actual PV2 charging type. 0: null, 1: adapter, 2: MPPT, 3: AC. */
  "mppt.pv2ChgType": number;
  /** Car charging output voltage (mV). Amplified 10x. */
  "mppt.carOutVol": number;
  /** Car charging output power (W). Amplified 10x. */
  "mppt.carOutWatts": number;
  /** Reserve 4 bytes. */
  "mppt.res": number[];
  /** Anderson output current. Amplified 100x. */
  "mppt.dcdc12vAmp": number;
  /** PV2 MPPT temperature (C). */
  "mppt.pv2MpptTemp": number;
  /** PV2 charging type config. 0: auto, 1: MPPT, 2: adapter. */
  "mppt.pv2CfgChgType": number;
  /** Actual PV1 charging type. 0: null, 1: adapter, 2: MPPT, 3: AC. */
  "mppt.chgType": number;
  /** PV1 charging type config. 0: auto, 1: MPPT, 2: adapter. */
  "mppt.cfgChgType": number;
  /** PV output voltage (mV). Amplified 10x. */
  "mppt.outVol": number;
  /** PV1 charging status. 0: disabled, 1: charging, 2: standby. */
  "mppt.chgState": number;
  /** Car charging switch state. 0: off, 1: on. */
  "mppt.carState": number;
  /** Car charging temperature (C). */
  "mppt.carTemp": number;
  /** PV output power (W). Amplified 10x. */
  "mppt.outWatts": number;
  /** PV output current (mA). Amplified 100x. */
  "mppt.outAmp": number;
  /** PV charging pause flag. 1: charging stopped. */
  "mppt.chgPauseFlag": number;
  /** Car charging output current (mA). Amplified 100x. */
  "mppt.carOutAmp": number;
  /** PV2 input voltage. Amplified 10x. */
  "mppt.pv2InVol": number;
  /** PV2 XT60 charging type. 0: not detected, 1: MPPT, 2: adapter. */
  "mppt.pv2Xt60ChgType": number;
  /** PV2 DC current (mA). */
  "mppt.pv2DcChgCurrent": number;
  /** DCDC24V temperature (C). */
  "mppt.dc24vTemp": number;
  /** PV2 input power. Amplified 10x. */
  "mppt.pv2InWatts": number;
  /** MPPT version number. */
  "mppt.swVer": number;
  /** PV1 XT60 charging type. 0: not detected, 1: MPPT, 2: adapter. */
  "mppt.x60ChgType": number;
  /** Anderson output power. Amplified 100x. */
  "mppt.dcdc12vWatts": number;
  /** Anderson output voltage. Amplified 10x. */
  "mppt.dcdc12vVol": number;
  /** PV1 input power (W). */
  "mppt.inWatts": number;
  /** PV1 MPPT temperature (C). */
  "mppt.mpptTemp": number;
  /** Maximum DC charging current (mA). */
  "mppt.dcChgCurrent": number;
  /** PV2 input current. Amplified 100x. */
  "mppt.pv2InAmp": number;

  /* ------------------------------------------------------- *\
   *  bms_bmsStatus.* - Battery management status             *
  \* ------------------------------------------------------- */

  /** Hardware version bytes. */
  "bms_bmsStatus.hwVersion": number[];
  /** Design capacity (mAh). */
  "bms_bmsStatus.designCap": number;
  /** Temperature (C). */
  "bms_bmsStatus.temp": number;
  /** Battery level SOC (float). */
  "bms_bmsStatus.f32ShowSoc": number;
  /** Output power (W). */
  "bms_bmsStatus.outputWatts": number;
  /** Voltage (mV). */
  "bms_bmsStatus.vol": number;
  /** Cell voltage difference (mV). */
  "bms_bmsStatus.maxVolDiff": number;
  /** Full capacity (mAh). */
  "bms_bmsStatus.fullCap": number;
  /** Balance status. */
  "bms_bmsStatus.balanceState": number;
  /** BMS error code. */
  "bms_bmsStatus.errCode": number;
  /** Input power (W). */
  "bms_bmsStatus.inputWatts": number;
  /** BMS permanent fault. */
  "bms_bmsStatus.bmsFault": number;
  /** Remaining capacity (mAh). */
  "bms_bmsStatus.remainCap": number;
  /** Battery level. */
  "bms_bmsStatus.soc": number;
  /** BQ hardware protection register. */
  "bms_bmsStatus.bqSysStatReg": number;
  /** Cell voltage array (mV). */
  "bms_bmsStatus.cellVol": number[];
  /** BMS No. 0-2. */
  "bms_bmsStatus.num": number;
  /** Charging/discharging MOS status. */
  "bms_bmsStatus.mosState": number;
  /** Cell temperature array (C). */
  "bms_bmsStatus.cellTemp": number[];
  /** Minimum MOS temperature (C). */
  "bms_bmsStatus.minMosTemp": number;
  /** Target charging current (mA). */
  "bms_bmsStatus.tagChgAmp": number;
  /** Maximum MOS temperature (C). */
  "bms_bmsStatus.maxMosTemp": number;
  /** Reserved bytes. */
  "bms_bmsStatus.recv": number[];
  /** Time remaining (min). */
  "bms_bmsStatus.remainTime": number;
  /** BMS type. 1: lithium, 2: oil-powered. */
  "bms_bmsStatus.type": number;
  /** Maximum cell temperature (C). */
  "bms_bmsStatus.maxCellTemp": number;
  /** Current (mA). */
  "bms_bmsStatus.amp": number;
  /** Cell material ID. */
  "bms_bmsStatus.cellId": number;
  /** Minimum cell voltage (mV). */
  "bms_bmsStatus.minCellVol": number;
  /** Charge/discharge cycles. */
  "bms_bmsStatus.cycles": number;
  /** Maximum cell voltage (mV). */
  "bms_bmsStatus.maxCellVol": number;
  /** Minimum cell temperature (C). */
  "bms_bmsStatus.minCellTemp": number;
  /** Health status. */
  "bms_bmsStatus.soh": number;
  /** Battery pack enabling status. */
  "bms_bmsStatus.openBmsIdx": number;
  /** BMS version. */
  "bms_bmsStatus.sysVer": number;
  /** Charging state. 0: disabled, 1: CC, 2: CV, 3: UPS. */
  "bms_bmsStatus.chgState": number;
  /** System state. */
  "bms_bmsStatus.sysState": number;
  /** E-cloud OCV value. */
  "bms_bmsStatus.ecloudOcv": number;
  /** Product detail code. */
  "bms_bmsStatus.productDetail": number;
  /** Product type code. */
  "bms_bmsStatus.productType": number;
  /** Total discharge capacity counter. */
  "bms_bmsStatus.dsgCap": number;
  /** Total charge capacity counter. */
  "bms_bmsStatus.chgCap": number;
  /** Combined BMS fault flags. */
  "bms_bmsStatus.allBmsFault": number;
  /** Combined error code. */
  "bms_bmsStatus.allErrCode": number;
  /** Actual SOC. */
  "bms_bmsStatus.actSoc": number;
  /** Calculated SOH from cycles. */
  "bms_bmsStatus.cycSoh": number;
  /** Real SOH. */
  "bms_bmsStatus.realSoh": number;
  /** SOC difference between packs. */
  "bms_bmsStatus.diffSoc": number;
  /** Target SOC. */
  "bms_bmsStatus.targetSoc": number;
  /** Calibrated SOH. */
  "bms_bmsStatus.caleSoh": number;
  /** Pack serial number. */
  "bms_bmsStatus.packSn": string;
  /** Loader firmware version. */
  "bms_bmsStatus.loaderVer": number;
  /** BMS heartbeat version. */
  "bms_bmsStatus.bmsHeartVer": number;

  /* ------------------------------------------------------- *\
   *  bms_bmsInfo.* - Battery management info                  *
  \* ------------------------------------------------------- */

  /** High temperature time (s). */
  "bms_bmsInfo.highTempTime": number;
  /** Health status. */
  "bms_bmsInfo.soh": number;
  /** Launch date flag. */
  "bms_bmsInfo.lauchDateFlag": number;
  /** Self-discharge rate. */
  "bms_bmsInfo.selfDsgRate": number;
  /** Low temperature time (s). */
  "bms_bmsInfo.lowTempTime": number;
  /** Low temperature charging time (s). */
  "bms_bmsInfo.lowTempChgTime": number;
  /** Battery serial number. */
  "bms_bmsInfo.sn": string;
  /** Deep discharge count. */
  "bms_bmsInfo.deepDsgCnt": number;
  /** BSM charge/discharge cycles. */
  "bms_bmsInfo.bsmCycles": number;
  /** Accumulated charging energy (Wh). */
  "bms_bmsInfo.accuChgEnergy": number;
  /** Round-trip efficiency. */
  "bms_bmsInfo.roundTrip": number;
  /** Ohmic resistance (mOhm). */
  "bms_bmsInfo.ohmRes": number;
  /** Accumulated discharge capacity (mAh). */
  "bms_bmsInfo.accuDsgCap": number;
  /** High temperature charging time (s). */
  "bms_bmsInfo.highTempChgTime": number;
  /** Accumulated charging capacity (mAh). */
  "bms_bmsInfo.accuChgCap": number;
  /** Reset flag. */
  "bms_bmsInfo.resetFlag": number;
  /** Power capability multiplier. */
  "bms_bmsInfo.powerCapability": number;
  /** BMS launch date. */
  "bms_bmsInfo.bmsLanchDate": number;
  /** Accumulated discharge energy (Wh). */
  "bms_bmsInfo.accuDsgEnergy": number;
  /** BMS number. */
  "bms_bmsInfo.num": number;

  /* ------------------------------------------------------- *\
   *  bms_emsStatus.* - Energy management status               *
  \* ------------------------------------------------------- */

  /** Maximum charging SOC. */
  "bms_emsStatus.maxChargeSoc": number;
  /** BMS online signal flags. */
  "bms_emsStatus.bmsIsConnt": number[];
  /** Discharge command. */
  "bms_emsStatus.dsgCmd": number;
  /** Charging voltage (mV). */
  "bms_emsStatus.chgVol": number;
  /** Fan level. */
  "bms_emsStatus.fanLevel": number;
  /** Charging current (mA). */
  "bms_emsStatus.chgAmp": number;
  /** Charging state. 0: disabled, 1: CC, 2: CV. */
  "bms_emsStatus.chgState": number;
  /** BMS enable index. */
  "bms_emsStatus.openBmsIdx": number;
  /** SOC for turning off Smart Generator. */
  "bms_emsStatus.maxCloseOilEb": number;
  /** Maximum available quantity. */
  "bms_emsStatus.maxAvailNum": number;
  /** SOC displayed on LCD (float). */
  "bms_emsStatus.f32LcdShowSoc": number;
  /** Max voltage in parallel mode (mV). */
  "bms_emsStatus.paraVolMax": number;
  /** Min voltage in parallel mode (mV). */
  "bms_emsStatus.paraVolMin": number;
  /** SOC for turning on Smart Generator. */
  "bms_emsStatus.minOpenOilEb": number;
  /** BMS warning state flags. */
  "bms_emsStatus.bmsWarState": number;
  /** Remaining charging time (min). */
  "bms_emsStatus.chgRemainTime": number;
  /** Charge command. */
  "bms_emsStatus.chgCmd": number;
  /** UPS mode enable flag. */
  "bms_emsStatus.openUpsFlag": number;
  /** SOC displayed on LCD. */
  "bms_emsStatus.lcdShowSoc": number;
  /** BMS product model. */
  "bms_emsStatus.bmsModel": number;
  /** 0: sleep, 1: normal. */
  "bms_emsStatus.emsIsNormalFlag": number;
  /** Minimum discharging SOC. */
  "bms_emsStatus.minDsgSoc": number;
  /** Remaining discharging time (min). */
  "bms_emsStatus.dsgRemainTime": number;
  /** EMS firmware version. */
  "bms_emsStatus.emsVer": number;
  /** Charging line plug status. */
  "bms_emsStatus.chgLinePlug": number;
  /** Charge disconnect condition. */
  "bms_emsStatus.chgDisCond": number;
  /** System charge/discharge state. */
  "bms_emsStatus.sysChgDsgState": number;
  /** Discharge disconnect condition. */
  "bms_emsStatus.dsgDisCond": number;

  /* ------------------------------------------------------- *\
   *  bms_kitInfo.* - Battery kit info                         *
  \* ------------------------------------------------------- */

  /** Battery kit entries with per-pack details. */
  "bms_kitInfo.watts": BmsKitWattsEntry[];
  /** Available data length. */
  "bms_kitInfo.aviDataLen": number;
  /** Number of battery kits. */
  "bms_kitInfo.kitNum": number;
  /** Kit protocol version. */
  "bms_kitInfo.version": number;

  /* ------------------------------------------------------- *\
   *  bms_slave_bmsSlaveStatus.* - Slave battery (default)     *
  \* ------------------------------------------------------- */

  /** Slave temperature (C). */
  "bms_slave_bmsSlaveStatus.temp": number;
  /** Slave BMS enable index. */
  "bms_slave_bmsSlaveStatus.openBmsIdx": number;
  /** Slave input power (W). */
  "bms_slave_bmsSlaveStatus.inputWatts": number;
  /** Slave output power (W). */
  "bms_slave_bmsSlaveStatus.outputWatts": number;
  /** Slave SOC difference. */
  "bms_slave_bmsSlaveStatus.diffSoc": number;
  /** Slave full capacity (mAh). */
  "bms_slave_bmsSlaveStatus.fullCap": number;
  /** Slave discharge capacity counter. */
  "bms_slave_bmsSlaveStatus.dsgCap": number;
  /** Slave MOS state. */
  "bms_slave_bmsSlaveStatus.mosState": number;
  /** Slave error code. */
  "bms_slave_bmsSlaveStatus.errCode": number;
  /** Slave charge capacity counter. */
  "bms_slave_bmsSlaveStatus.chgCap": number;
  /** Slave current (mA). */
  "bms_slave_bmsSlaveStatus.amp": number;
  /** Slave combined BMS fault flags. */
  "bms_slave_bmsSlaveStatus.allBmsFault": number;
  /** Slave system version. */
  "bms_slave_bmsSlaveStatus.sysVer": number;
  /** Slave SOC. */
  "bms_slave_bmsSlaveStatus.soc": number;
  /** Slave product type code. */
  "bms_slave_bmsSlaveStatus.productType": number;
  /** Slave health status. */
  "bms_slave_bmsSlaveStatus.soh": number;
  /** Slave max MOS temperature (C). */
  "bms_slave_bmsSlaveStatus.maxMosTemp": number;
  /** Slave charge/discharge cycles. */
  "bms_slave_bmsSlaveStatus.cycles": number;
  /** Slave cell material ID. */
  "bms_slave_bmsSlaveStatus.cellId": number;
  /** Slave real SOH. */
  "bms_slave_bmsSlaveStatus.realSoh": number;
  /** Slave BMS permanent fault. */
  "bms_slave_bmsSlaveStatus.bmsFault": number;
  /** Slave voltage (mV). */
  "bms_slave_bmsSlaveStatus.vol": number;
  /** Slave BQ hardware protection register. */
  "bms_slave_bmsSlaveStatus.bqSysStatReg": number;
  /** Slave max cell temperature (C). */
  "bms_slave_bmsSlaveStatus.maxCellTemp": number;
  /** Slave e-cloud OCV. */
  "bms_slave_bmsSlaveStatus.ecloudOcv": number;
  /** Slave max voltage difference (mV). */
  "bms_slave_bmsSlaveStatus.maxVolDiff": number;
  /** Slave min cell temperature (C). */
  "bms_slave_bmsSlaveStatus.minCellTemp": number;
  /** Slave target charging current (mA). */
  "bms_slave_bmsSlaveStatus.tagChgAmp": number;
  /** Slave design capacity (mAh). */
  "bms_slave_bmsSlaveStatus.designCap": number;
  /** Slave BMS heartbeat version. */
  "bms_slave_bmsSlaveStatus.bmsHeartVer": number;
  /** Slave product detail code. */
  "bms_slave_bmsSlaveStatus.productDetail": number;
  /** Slave combined error code. */
  "bms_slave_bmsSlaveStatus.allErrCode": number;
  /** Slave balance state. */
  "bms_slave_bmsSlaveStatus.balanceState": number;
  /** Slave remaining capacity (mAh). */
  "bms_slave_bmsSlaveStatus.remainCap": number;
  /** Slave calibrated SOH. */
  "bms_slave_bmsSlaveStatus.caleSoh": number;
  /** Slave target SOC. */
  "bms_slave_bmsSlaveStatus.targetSoc": number;
  /** Slave actual SOC. */
  "bms_slave_bmsSlaveStatus.actSoc": number;
  /** Slave SOC (float). */
  "bms_slave_bmsSlaveStatus.f32ShowSoc": number;
  /** Slave battery type. */
  "bms_slave_bmsSlaveStatus.type": number;
  /** Slave cycle SOH. */
  "bms_slave_bmsSlaveStatus.cycSoh": number;
  /** Slave BMS number. */
  "bms_slave_bmsSlaveStatus.num": number;
  /** Slave system state. */
  "bms_slave_bmsSlaveStatus.sysState": number;
  /** Slave charging state. */
  "bms_slave_bmsSlaveStatus.chgState": number;
  /** Slave remaining time (min). */
  "bms_slave_bmsSlaveStatus.remainTime": number;
  /** Slave loader firmware version. */
  "bms_slave_bmsSlaveStatus.loaderVer": number;
  /** Slave min MOS temperature (C). */
  "bms_slave_bmsSlaveStatus.minMosTemp": number;
  /** Slave min cell voltage (mV). */
  "bms_slave_bmsSlaveStatus.minCellVol": number;
  /** Slave max cell voltage (mV). */
  "bms_slave_bmsSlaveStatus.maxCellVol": number;
  /** Slave pack serial number. */
  "bms_slave_bmsSlaveStatus.packSn": string;
  /** Slave hardware version bytes. */
  "bms_slave_bmsSlaveStatus.hwVersion": number[];
  /** Slave reserved bytes. */
  "bms_slave_bmsSlaveStatus.recv": number[];
  /** Slave cell voltage array (mV). */
  "bms_slave_bmsSlaveStatus.cellVol": number[];
  /** Slave cell temperature array (C). */
  "bms_slave_bmsSlaveStatus.cellTemp": number[];

  /* ------------------------------------------------------- *\
   *  bms_slave_bmsSlaveStatus_1.* - Slave battery pack 1      *
  \* ------------------------------------------------------- */

  /** Pack 1 health status. */
  "bms_slave_bmsSlaveStatus_1.soh": number;
  /** Pack 1 BQ hardware protection register. */
  "bms_slave_bmsSlaveStatus_1.bqSysStatReg": number;
  /** Pack 1 min MOS temperature (C). */
  "bms_slave_bmsSlaveStatus_1.minMosTemp": number;
  /** Pack 1 max cell voltage (mV). */
  "bms_slave_bmsSlaveStatus_1.maxCellVol": number;
  /** Pack 1 serial number. */
  "bms_slave_bmsSlaveStatus_1.packSn": string;
  /** Pack 1 SOC. */
  "bms_slave_bmsSlaveStatus_1.soc": number;
  /** Pack 1 min cell voltage (mV). */
  "bms_slave_bmsSlaveStatus_1.minCellVol": number;
  /** Pack 1 discharge capacity counter. */
  "bms_slave_bmsSlaveStatus_1.dsgCap": number;
  /** Pack 1 output power (W). */
  "bms_slave_bmsSlaveStatus_1.outputWatts": number;
  /** Pack 1 current (mA). */
  "bms_slave_bmsSlaveStatus_1.amp": number;
  /** Pack 1 remaining time (min). */
  "bms_slave_bmsSlaveStatus_1.remainTime": number;
  /** Pack 1 max cell temperature (C). */
  "bms_slave_bmsSlaveStatus_1.maxCellTemp": number;
  /** Pack 1 max MOS temperature (C). */
  "bms_slave_bmsSlaveStatus_1.maxMosTemp": number;
  /** Pack 1 min cell temperature (C). */
  "bms_slave_bmsSlaveStatus_1.minCellTemp": number;
  /** Pack 1 charge/discharge cycles. */
  "bms_slave_bmsSlaveStatus_1.cycles": number;
  /** Pack 1 system state. */
  "bms_slave_bmsSlaveStatus_1.sysState": number;
  /** Pack 1 calibrated SOH. */
  "bms_slave_bmsSlaveStatus_1.caleSoh": number;
  /** Pack 1 voltage (mV). */
  "bms_slave_bmsSlaveStatus_1.vol": number;
  /** Pack 1 system version. */
  "bms_slave_bmsSlaveStatus_1.sysVer": number;
  /** Pack 1 temperature (C). */
  "bms_slave_bmsSlaveStatus_1.temp": number;
  /** Pack 1 real SOH. */
  "bms_slave_bmsSlaveStatus_1.realSoh": number;
  /** Pack 1 product type code. */
  "bms_slave_bmsSlaveStatus_1.productType": number;
  /** Pack 1 BMS number. */
  "bms_slave_bmsSlaveStatus_1.num": number;
  /** Pack 1 combined BMS fault flags. */
  "bms_slave_bmsSlaveStatus_1.allBmsFault": number;
  /** Pack 1 BMS heartbeat version. */
  "bms_slave_bmsSlaveStatus_1.bmsHeartVer": number;
  /** Pack 1 max voltage difference (mV). */
  "bms_slave_bmsSlaveStatus_1.maxVolDiff": number;
  /** Pack 1 error code. */
  "bms_slave_bmsSlaveStatus_1.errCode": number;
  /** Pack 1 MOS state. */
  "bms_slave_bmsSlaveStatus_1.mosState": number;
  /** Pack 1 cycle SOH. */
  "bms_slave_bmsSlaveStatus_1.cycSoh": number;
  /** Pack 1 BMS enable index. */
  "bms_slave_bmsSlaveStatus_1.openBmsIdx": number;
  /** Pack 1 target charging current (mA). */
  "bms_slave_bmsSlaveStatus_1.tagChgAmp": number;
  /** Pack 1 design capacity (mAh). */
  "bms_slave_bmsSlaveStatus_1.designCap": number;
  /** Pack 1 e-cloud OCV. */
  "bms_slave_bmsSlaveStatus_1.ecloudOcv": number;
  /** Pack 1 cell material ID. */
  "bms_slave_bmsSlaveStatus_1.cellId": number;
  /** Pack 1 actual SOC. */
  "bms_slave_bmsSlaveStatus_1.actSoc": number;
  /** Pack 1 combined error code. */
  "bms_slave_bmsSlaveStatus_1.allErrCode": number;
  /** Pack 1 battery type. */
  "bms_slave_bmsSlaveStatus_1.type": number;
  /** Pack 1 SOC (float). */
  "bms_slave_bmsSlaveStatus_1.f32ShowSoc": number;
  /** Pack 1 target SOC. */
  "bms_slave_bmsSlaveStatus_1.targetSoc": number;
  /** Pack 1 SOC difference. */
  "bms_slave_bmsSlaveStatus_1.diffSoc": number;
  /** Pack 1 product detail code. */
  "bms_slave_bmsSlaveStatus_1.productDetail": number;
  /** Pack 1 input power (W). */
  "bms_slave_bmsSlaveStatus_1.inputWatts": number;
  /** Pack 1 BMS permanent fault. */
  "bms_slave_bmsSlaveStatus_1.bmsFault": number;
  /** Pack 1 charging state. */
  "bms_slave_bmsSlaveStatus_1.chgState": number;
  /** Pack 1 loader firmware version. */
  "bms_slave_bmsSlaveStatus_1.loaderVer": number;
  /** Pack 1 full capacity (mAh). */
  "bms_slave_bmsSlaveStatus_1.fullCap": number;
  /** Pack 1 balance state. */
  "bms_slave_bmsSlaveStatus_1.balanceState": number;
  /** Pack 1 remaining capacity (mAh). */
  "bms_slave_bmsSlaveStatus_1.remainCap": number;
  /** Pack 1 charge capacity counter. */
  "bms_slave_bmsSlaveStatus_1.chgCap": number;
  /** Pack 1 hardware version bytes. */
  "bms_slave_bmsSlaveStatus_1.hwVersion": number[];
  /** Pack 1 reserved bytes. */
  "bms_slave_bmsSlaveStatus_1.recv": number[];
  /** Pack 1 cell voltage array (mV). */
  "bms_slave_bmsSlaveStatus_1.cellVol": number[];
  /** Pack 1 cell temperature array (C). */
  "bms_slave_bmsSlaveStatus_1.cellTemp": number[];

  /* ------------------------------------------------------- *\
   *  bms_slave_bmsSlaveStatus_2.* - Slave battery pack 2      *
  \* ------------------------------------------------------- */

  /** Pack 2 balance state. */
  "bms_slave_bmsSlaveStatus_2.balanceState": number;
  /** Pack 2 cell voltage array (mV). */
  "bms_slave_bmsSlaveStatus_2.cellVol": number[];
  /** Pack 2 output power (W). */
  "bms_slave_bmsSlaveStatus_2.outputWatts": number;
  /** Pack 2 charge/discharge cycles. */
  "bms_slave_bmsSlaveStatus_2.cycles": number;
  /** Pack 2 MOS state. */
  "bms_slave_bmsSlaveStatus_2.mosState": number;
  /** Pack 2 reserved bytes. */
  "bms_slave_bmsSlaveStatus_2.recv": number[];
  /** Pack 2 BMS heartbeat version. */
  "bms_slave_bmsSlaveStatus_2.bmsHeartVer": number;
  /** Pack 2 input power (W). */
  "bms_slave_bmsSlaveStatus_2.inputWatts": number;
  /** Pack 2 current (mA). */
  "bms_slave_bmsSlaveStatus_2.amp": number;
  /** Pack 2 max MOS temperature (C). */
  "bms_slave_bmsSlaveStatus_2.maxMosTemp": number;
  /** Pack 2 SOC. */
  "bms_slave_bmsSlaveStatus_2.soc": number;
  /** Pack 2 health status. */
  "bms_slave_bmsSlaveStatus_2.soh": number;
  /** Pack 2 temperature (C). */
  "bms_slave_bmsSlaveStatus_2.temp": number;
  /** Pack 2 cell temperature array (C). */
  "bms_slave_bmsSlaveStatus_2.cellTemp": number[];
  /** Pack 2 max voltage difference (mV). */
  "bms_slave_bmsSlaveStatus_2.maxVolDiff": number;
  /** Pack 2 error code. */
  "bms_slave_bmsSlaveStatus_2.errCode": number;
  /** Pack 2 design capacity (mAh). */
  "bms_slave_bmsSlaveStatus_2.designCap": number;
  /** Pack 2 system version. */
  "bms_slave_bmsSlaveStatus_2.sysVer": number;
  /** Pack 2 full capacity (mAh). */
  "bms_slave_bmsSlaveStatus_2.fullCap": number;
  /** Pack 2 SOC (float). */
  "bms_slave_bmsSlaveStatus_2.f32ShowSoc": number;
  /** Pack 2 min cell temperature (C). */
  "bms_slave_bmsSlaveStatus_2.minCellTemp": number;
  /** Pack 2 max cell voltage (mV). */
  "bms_slave_bmsSlaveStatus_2.maxCellVol": number;
  /** Pack 2 voltage (mV). */
  "bms_slave_bmsSlaveStatus_2.vol": number;
  /** Pack 2 target charging current (mA). */
  "bms_slave_bmsSlaveStatus_2.tagChgAmp": number;
  /** Pack 2 remaining capacity (mAh). */
  "bms_slave_bmsSlaveStatus_2.remainCap": number;
  /** Pack 2 cell material ID. */
  "bms_slave_bmsSlaveStatus_2.cellId": number;
  /** Pack 2 max cell temperature (C). */
  "bms_slave_bmsSlaveStatus_2.maxCellTemp": number;
  /** Pack 2 BMS enable index. */
  "bms_slave_bmsSlaveStatus_2.openBmsIdx": number;
  /** Pack 2 BMS number. */
  "bms_slave_bmsSlaveStatus_2.num": number;
  /** Pack 2 battery type. */
  "bms_slave_bmsSlaveStatus_2.type": number;
  /** Pack 2 hardware version bytes. */
  "bms_slave_bmsSlaveStatus_2.hwVersion": number[];
  /** Pack 2 min cell voltage (mV). */
  "bms_slave_bmsSlaveStatus_2.minCellVol": number;
  /** Pack 2 e-cloud OCV. */
  "bms_slave_bmsSlaveStatus_2.ecloudOcv": number;
  /** Pack 2 remaining time (min). */
  "bms_slave_bmsSlaveStatus_2.remainTime": number;
  /** Pack 2 min MOS temperature (C). */
  "bms_slave_bmsSlaveStatus_2.minMosTemp": number;
  /** Pack 2 BMS permanent fault. */
  "bms_slave_bmsSlaveStatus_2.bmsFault": number;
  /** Pack 2 BQ hardware protection register. */
  "bms_slave_bmsSlaveStatus_2.bqSysStatReg": number;

  /* ------------------------------------------------------- *\
   *  bms_slave_bmsSlaveInfo_1.* - Slave battery pack 1 info   *
  \* ------------------------------------------------------- */

  /** Pack 1 accumulated discharge capacity (mAh). */
  "bms_slave_bmsSlaveInfo_1.accuDsgCap": number;
  /** Pack 1 deep discharge count. */
  "bms_slave_bmsSlaveInfo_1.deepDsgCnt": number;
  /** Pack 1 accumulated discharge energy (Wh). */
  "bms_slave_bmsSlaveInfo_1.accuDsgEnergy": number;
  /** Pack 1 serial number. */
  "bms_slave_bmsSlaveInfo_1.sn": string;
  /** Pack 1 self-discharge rate. */
  "bms_slave_bmsSlaveInfo_1.selfDsgRate": number;
  /** Pack 1 low temperature time (s). */
  "bms_slave_bmsSlaveInfo_1.lowTempTime": number;
  /** Pack 1 low temperature charging time (s). */
  "bms_slave_bmsSlaveInfo_1.lowTempChgTime": number;
  /** Pack 1 BMS launch date. */
  "bms_slave_bmsSlaveInfo_1.bmsLanchDate": number;
  /** Pack 1 health status. */
  "bms_slave_bmsSlaveInfo_1.soh": number;
  /** Pack 1 accumulated charging capacity (mAh). */
  "bms_slave_bmsSlaveInfo_1.accuChgCap": number;
  /** Pack 1 power capability multiplier. */
  "bms_slave_bmsSlaveInfo_1.powerCapability": number;
  /** Pack 1 round-trip efficiency. */
  "bms_slave_bmsSlaveInfo_1.roundTrip": number;
  /** Pack 1 BSM charge/discharge cycles. */
  "bms_slave_bmsSlaveInfo_1.bsmCycles": number;
  /** Pack 1 reset flag. */
  "bms_slave_bmsSlaveInfo_1.resetFlag": number;
  /** Pack 1 ohmic resistance (mOhm). */
  "bms_slave_bmsSlaveInfo_1.ohmRes": number;
  /** Pack 1 high temperature charging time (s). */
  "bms_slave_bmsSlaveInfo_1.highTempChgTime": number;
  /** Pack 1 high temperature time (s). */
  "bms_slave_bmsSlaveInfo_1.highTempTime": number;
  /** Pack 1 accumulated charging energy (Wh). */
  "bms_slave_bmsSlaveInfo_1.accuChgEnergy": number;
  /** Pack 1 BMS number. */
  "bms_slave_bmsSlaveInfo_1.num": number;
  /** Pack 1 launch date flag. */
  "bms_slave_bmsSlaveInfo_1.lauchDateFlag": number;
}

/* ========================================================= *\
 *  Delta Pro 3 state                                         *
\* ========================================================= */

/** Device state for the DELTA Pro 3. */
export interface DeltaPro3State {
  /* ------------------------------------------------------- *\
   *  System / device-level                                    *
  \* ------------------------------------------------------- */

  /** Device error code. */
  errcode: number;
  /** Sleep status. */
  devSleepState: number;
  /** Device timeout (min). 0: never sleep. */
  devStandbyTime: number;
  /** DC timeout (min). 0: never time out. */
  dcStandbyTime: number;
  /** Bluetooth timeout (h). 0: never time out. */
  bleStandbyTime: number;
  /** AC timeout (min). 0: never time out. */
  acStandbyTime: number;
  /** Screen brightness. */
  lcdLight: number;
  /** Screen timeout (s). 0: never. */
  screenOffTime: number;
  /** AC output frequency (Hz). */
  acOutFreq: number;
  /** X-Boost switch. */
  xboostEn: boolean;
  /** AC energy-saving mode switch. */
  acEnergySavingOpen: boolean;
  /** High-voltage/Low-voltage AC identifier. */
  llcHvLvFlag: number;
  /** GFCI switch. */
  llcGFCIFlag: boolean;
  /** AC low-voltage Always-on. */
  acLvAlwaysOn: boolean;
  /** High-voltage AC Always-on. */
  acHvAlwaysOn: boolean;
  /** Minimum SOC for AC Always-on. */
  acAlwaysOnMiniSoc: number;
  /** Beeper on/off. */
  enBeep: boolean;
  /** Fast charging slider. 0: fast, 1: custom power. */
  fastChargeSwitch: number;
  /** Battery charging/discharging order. 0: default, 1: auto, 2: main prioritized. */
  multiBpChgDsgMode: number;
  /** Backup reserve function switch. */
  energyBackupEn: boolean;
  /** Backup reserve level. */
  energyBackupStartSoc: number;
  /** Backup reserve SOC. */
  backupReverseSoc: number;
  /** Output power-off memory. */
  outputPowerOffMemory: boolean;
  /** PCS fan level. */
  pcsFanLevel: number;
  /** UTC timezone ID. */
  utcTimezoneId: string;
  /** UTC timezone offset. */
  utcTimezone: number;
  /** UTC set mode. */
  utcSetMode: boolean;
  /** Quota cloud timestamp. */
  quota_cloud_ts: string;
  /** Quota device timestamp. */
  quota_device_ts: number;

  /* ------------------------------------------------------- *\
   *  cms* - Central management system / overall battery       *
  \* ------------------------------------------------------- */

  /** Discharge limit. */
  cmsMinDsgSoc: number;
  /** Charging/Discharging status. 0: idle, 1: discharging, 2: charging. */
  cmsChgDsgState: number;
  /** On/Off status. 0: off, 1: on. */
  cmsBmsRunState: number;
  /** Overall SOC. */
  cmsBattSoc: number;
  /** Charge limit. */
  cmsMaxChgSoc: number;
  /** Remaining charging time (min). */
  cmsChgRemTime: number;
  /** Smart Generator auto start/stop switch. */
  cmsOilSelfStart: boolean;
  /** SOC for automatically stopping the Smart Generator. */
  cmsOilOffSoc: number;
  /** Remaining discharging time (min). */
  cmsDsgRemTime: number;
  /** SOC for automatically starting the Smart Generator. */
  cmsOilOnSoc: number;
  /** Overall battery health. */
  cmsBattSoh: number;
  /** Battery full energy capacity (Wh). */
  cmsBattFullEnergy: number;
  /** Maximum battery output power (W). */
  cmsBattPowOutMax: number;
  /** Maximum battery input power (W). */
  cmsBattPowInMax: number;

  /* ------------------------------------------------------- *\
   *  bms* - Battery management system / main battery          *
  \* ------------------------------------------------------- */

  /** Remaining charging time of the main battery (min). */
  bmsChgRemTime: number;
  /** Battery capacity (mAh). */
  bmsDesignCap: number;
  /** Temperature of the main battery (C). */
  bmsMaxCellTemp: number;
  /** SOC of the main battery. */
  bmsBattSoc: number;
  /** Charging/Discharging status of the main battery. 0: idle, 1: discharging, 2: charging. */
  bmsChgDsgState: number;
  /** Minimum temperature of the main battery (C). */
  bmsMinCellTemp: number;
  /** Remaining discharging time (min). */
  bmsDsgRemTime: number;
  /** Main battery health. */
  bmsBattSoh: number;
  /** BMS error code. */
  bmsErrCode: number;
  /** Maximum MOS temperature (C). */
  bmsMaxMosTemp: number;
  /** Minimum MOS temperature (C). */
  bmsMinMosTemp: number;
  /** MPPT error code. */
  mpptErrCode: number;

  /* ------------------------------------------------------- *\
   *  pow* - Power readings                                    *
  \* ------------------------------------------------------- */

  /** Total input power (W). */
  powInSumW: number;
  /** Total output power (W). */
  powOutSumW: number;
  /** Real-time grid power (W). */
  powGetAcHvOut: number;
  /** Real-time AC power (W). */
  powGetAc: number;
  /** Real-time power of Type-C port 1 (W). */
  powGetTypec1: number;
  /** Real-time power of Type-C port 2 (W). */
  powGetTypec2: number;
  /** Real-time 12V power (W). */
  powGet12v: number;
  /** Real-time 24V power (W). */
  powGet24v: number;
  /** Real-time low-voltage AC output power (W). */
  powGetAcLvOut: number;
  /** Real-time power of the Power In/Out port (W). */
  powGet5p8: number;
  /** Real-time power of the USB 1 port (W). */
  powGetQcusb1: number;
  /** Real-time power of the USB 2 port (W). */
  powGetQcusb2: number;
  /** Real-time power of Extra Battery Port 1 (W). */
  powGet4p81: number;
  /** Real-time power of Extra Battery Port 2 (W). */
  powGet4p82: number;
  /** Real-time power of the low-voltage AC output port (W). */
  powGetAcLvTt30Out: number;
  /** Real-time high-voltage PV power (W). */
  powGetPvH: number;
  /** Real-time AC input power (W). */
  powGetAcIn: number;
  /** Real-time low-voltage PV power (W). */
  powGetPvL: number;
  /** Real-time LLC power (W). */
  powGetLlc: number;

  /* ------------------------------------------------------- *\
   *  plugInInfo* - Plug-in / connection status                *
  \* ------------------------------------------------------- */

  /** Maximum AC charging power (half). */
  plugInInfoAcInChgHalPowMax: number;
  /** PV connection status. */
  plugInInfoPvHChargerFlag: boolean;
  /** Extra Battery Port 2 connected. 0: disconnected, 1: connected. */
  plugInInfo4p82InFlag: number;
  /** Maximum charging current of the PV port (A). */
  plugInInfoPvLChgAmpMax: number;
  /** AC input frequency (Hz). */
  plugInInfoAcInFeq: number;
  /** PV port charging mode. 1: car, 2: solar, 3: DC. */
  plugInInfoPvLType: number;
  /** Operating status of the Power In/Out port device. */
  plugInInfo5p8RunState: number;
  /** Operating status of Extra Battery Port 2 device. */
  plugInInfo4p82RunState: number;
  /** Charger connection to Extra Battery Port 1. */
  plugInInfo4p81ChargerFlag: boolean;
  /** Maximum charging power of the Power In/Out port (half). */
  plugInInfo5p8ChgHalPowMax: number;
  /** Maximum charging current of the high-voltage PV port (A). */
  plugInInfoPvHChgAmpMax: number;
  /** Maximum discharging power of the Power In/Out port (W). */
  plugInInfo5p8DsgPowMax: number;
  /** Maximum AC charging power (W). */
  plugInInfoAcInChgPowMax: number;
  /** High-voltage PV port charging mode. 1: car, 2: solar, 3: DC. */
  plugInInfoPvHType: number;
  /** Charger connection to Power In/Out port. */
  plugInInfo5p8ChargerFlag: boolean;
  /** AC charging port connected. 0: disconnected, 1: connected. */
  plugInInfoAcInFlag: number;
  /** Charging/Discharging type of Extra Battery Port 1. */
  plugInInfo4p81DsgChgType: number;
  /** Charger connected to AC port. */
  plugInInfoAcChargerFlag: boolean;
  /** Maximum DC input current of the high-voltage PV port (A). */
  plugInInfoPvHDcAmpMax: number;
  /** Extra Battery Port 1 connected. 0: disconnected, 1: connected. */
  plugInInfo4p81InFlag: number;
  /** Charger connection to Extra Battery Port 2. */
  plugInInfo4p82ChargerFlag: boolean;
  /** Maximum charging voltage of the low-voltage PV port (V). */
  plugInInfoPvLChgVolMax: number;
  /** Maximum DC input current of the low-voltage PV port (A). */
  plugInInfoPvLDcAmpMax: number;
  /** Power In/Out port connected. 0: disconnected, 1: connected. */
  plugInInfo5p8Flag: number;
  /** Maximum AC discharging power (W). */
  plugInInfoAcOutDsgPowMax: number;
  /** Charger connection to low-voltage PV port. */
  plugInInfoPvLChargerFlag: boolean;
  /** Maximum charging power of the Power In/Out port (W). */
  plugInInfo5p8ChgPowMax: number;
  /** Low-voltage PV port connected. 0: disconnected, 1: connected. */
  plugInInfoPvLFlag: number;
  /** Operating status of Extra Battery Port 1 device. */
  plugInInfo4p81RunState: number;
  /** Maximum charging voltage of the high-voltage PV port (V). */
  plugInInfoPvHChgVolMax: number;
  /** Charging/Discharging type of the Power In/Out port. */
  plugInInfo5p8DsgChg: number;
  /** High-voltage PV port connected. 0: disconnected, 1: connected. */
  plugInInfoPvHFlag: number;
  /** Charging/Discharging type of Extra Battery Port 2. */
  plugInInfo4p82DsgChgType: number;
  /** Power In/Out port device type. */
  plugInInfo5p8Type: number;
  /** PV weak source flag. */
  plugInInfoPvWeakSourceFlag: number;
  /** PV voltage low flag. */
  plugInInfoPvVolLowFlag: number;
  /** Extra Battery Port 1 device type. */
  plugInInfo4p81Type: number;
  /** Extra Battery Port 1 firmware version. */
  plugInInfo4p81FirmVer: number;
  /** Extra Battery Port 2 detail code. */
  plugInInfo4p82Detail: number;
  /** SN of the device connected to Extra Battery Port 1. */
  plugInInfo4p81Sn?: string;
  /** SN of the device connected to the Power In/Out port. */
  plugInInfo5p8Sn?: string;
  /** SN of the device connected to Extra Battery Port 2. */
  plugInInfo4p82Sn?: string;

  /* ------------------------------------------------------- *\
   *  plugInInfo*Resv.* - Plug-in reserved data                *
  \* ------------------------------------------------------- */

  /** Power In/Out port reserved info. */
  "plugInInfo5p8Resv.resvInfo": number[];
  /** Extra Battery Port 2 reserved info. */
  "plugInInfo4p82Resv.resvInfo": number[];

  /* ------------------------------------------------------- *\
   *  flowInfo* - Flow / switch status                         *
  \* ------------------------------------------------------- */

  /** Low-voltage PV switch status. 0: off, 2: on. */
  flowInfoPvL: number;
  /** High-voltage PV switch status. 0: off, 2: on. */
  flowInfoPvH: number;
  /** Type-C port 1 switch status. 0: off, 2: on. */
  flowInfoTypec1: number;
  /** Type-C port 2 switch status. 0: off, 2: on. */
  flowInfoTypec2: number;
  /** AC low-voltage output switch status. 0: off, 2: on. */
  flowInfoAcLvOut: number;
  /** Extra Battery port output switch status. 0: off, 2: on. */
  flowInfo4p82Out: number;
  /** AC input switch status. 0: off, 2: on. */
  flowInfoAcIn: number;
  /** High-voltage AC output switch status. 0: off, 2: on. */
  flowInfoAcHvOut: number;
  /** 12V output switch status. 0: off, 2: on. */
  flowInfo12v: number;
  /** 24V output switch status. 0: off, 2: on. */
  flowInfo24v: number;
  /** Extra Battery Port 1 input switch status. 0: off, 2: on. */
  flowInfo4p81In: number;
  /** USB output port 1 switch status. 0: off, 2: on. */
  flowInfoQcusb1: number;
  /** USB output port 2 switch status. 0: off, 2: on. */
  flowInfoQcusb2: number;
  /** Extra Battery Port 2 input switch status. 0: off, 2: on. */
  flowInfo4p82In: number;
  /** Power In/Out port input switch status. 0: off, 2: on. */
  flowInfo5p8In: number;
  /** Extra Battery Port 1 output switch status. 0: off, 2: on. */
  flowInfo4p81Out: number;
  /** Power In/Out port output switch status. 0: off, 2: on. */
  flowInfo5p8Out: number;

  /* ------------------------------------------------------- *\
   *  generator* - Smart Generator settings                    *
  \* ------------------------------------------------------- */

  /** Generator and solar energy hybrid mode. */
  generatorPvHybridModeOpen: boolean;
  /** Night care mode switch. */
  generatorCareModeOpen: boolean;
  /** Maximum SOC in generator/solar hybrid mode. */
  generatorPvHybridModeSocMax: number;
  /** Night care mode start time (min from midnight). */
  generatorCareModeStartTime: number;

  /* ------------------------------------------------------- *\
   *  stormPattern* - Storm pattern settings                   *
  \* ------------------------------------------------------- */

  /** Storm pattern open flag. */
  stormPatternOpenFlag: boolean;
  /** Storm pattern end time. */
  stormPatternEndTime: number;
  /** Storm pattern conflict flag. */
  stormPatternConflictFlag: number;
  /** Storm pattern enable. */
  stormPatternEnable: boolean;

  /* ------------------------------------------------------- *\
   *  energyStrategyOperateMode.* - Energy strategy             *
  \* ------------------------------------------------------- */

  /** Intelligent schedule mode open. */
  "energyStrategyOperateMode.operateIntelligentScheduleModeOpen": boolean;
  /** Scheduled mode open. */
  "energyStrategyOperateMode.operateScheduledOpen": boolean;
  /** Self-powered mode open. */
  "energyStrategyOperateMode.operateSelfPoweredOpen": boolean;
  /** TOU mode open. */
  "energyStrategyOperateMode.operateTouModeOpen": boolean;

  /* ------------------------------------------------------- *\
   *  currentTimeTaskV2Item.* - Scheduled time task             *
  \* ------------------------------------------------------- */

  /** Task parameter value. */
  "currentTimeTaskV2Item.taskParam": number;
  /** Task enabled. */
  "currentTimeTaskV2Item.isEnable": boolean;
  /** Time parameter (day-of-week bitmask). */
  "currentTimeTaskV2Item.timeParam": number;
  /** Task parameter detail entries. */
  "currentTimeTaskV2Item.taskParamDetail": unknown[];
  /** Task configured. */
  "currentTimeTaskV2Item.isCfg": boolean;
  /** Time mode. */
  "currentTimeTaskV2Item.timeMode": string;
  /** Conflict flag. */
  "currentTimeTaskV2Item.conflictFlag": number;
  /** Task index. */
  "currentTimeTaskV2Item.taskIndex": number;
  /** Task type. */
  "currentTimeTaskV2Item.taskType": string;
  /** Time table bitmask. */
  "currentTimeTaskV2Item.timeTable": number;

  /* ------------------------------------------------------- *\
   *  pvDcChgSettingList.* - PV/DC charging settings            *
  \* ------------------------------------------------------- */

  /** PV/DC charging setting entries. */
  "pvDcChgSettingList.listInfo": PvDcChgSettingEntry[];

  /* ------------------------------------------------------- *\
   *  Conflict & task flags                                    *
  \* ------------------------------------------------------- */

  /** Self-powered conflict flag. */
  selfPoweredConflictFlag: number;
  /** Sharing SOC conflict flag. */
  sharingSocConflictFlag: number;
  /** Time task change count. */
  timeTaskChangeCnt: number;
  /** Time task conflict flag. */
  timeTaskConflictFlag: number;
  /** TOU mode conflict flag. */
  touModeConflictFlag: number;
}

/* ========================================================= *\
 *  State map & union                                         *
\* ========================================================= */

/** Maps each DeviceType to its state interface. */
export interface DeviceStateMap {
  [BatteryType.River_2_Pro]: River2ProState;
  [BatteryType.Delta_2_Max]: Delta2MaxState;
  [BatteryType.Delta_3_Pro]: DeltaPro3State;
}

/** Union of all device state types. */
export type DeviceState = DeviceStateMap[BatteryType];
