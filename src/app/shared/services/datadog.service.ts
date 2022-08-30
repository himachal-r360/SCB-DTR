import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { datadogRum } from '@datadog/browser-rum';

datadogRum.getInternalContext();

datadogRum.init({
  applicationId: '82dc974b-2936-4cab-8340-35791355fc08',
  clientToken: 'pub41a9b3cef90e4aebde42d3266919651f',
  site: 'datadoghq.com',
  service:'smartbuy-mlite',
  env:'Arul',
  // Specify a version number to identify the deployed version of your application in Datadog
  // version: '1.0.0',
  sampleRate: 100,
  premiumSampleRate: 100,
  trackInteractions: true,
  defaultPrivacyLevel:'mask-user-input'
});
  
datadogRum.startSessionReplayRecording();

export class DatadogService {



}