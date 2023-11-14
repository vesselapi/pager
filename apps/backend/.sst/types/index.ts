import "sst/node/config";
declare module "sst/node/config" {
  export interface ConfigTypes {
    APP: string;
    STAGE: string;
  }
}

import "sst/node/api";
declare module "sst/node/api" {
  export interface ApiResources {
    "WebhookApi": {
      url: string;
    }
  }
}

import "sst/node/function";
declare module "sst/node/function" {
  export interface FunctionResources {
    "AlertOncallFn": {
      functionName: string;
    }
  }
}

import "sst/node/queue";
declare module "sst/node/queue" {
  export interface QueueResources {
    "AlertOncallQueue": {
      queueUrl: string;
    }
  }
}

import "sst/node/topic";
declare module "sst/node/topic" {
  export interface TopicResources {
    "alerts-topic": {
      topicArn: string;
    }
  }
}

