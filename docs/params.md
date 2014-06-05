# Google Analytics Parameter List

## General

| Field                      | UA  | UTM   | Type    | Notes       |
|:---------------------------|-----|-------|---------|-------------|
| anonymizeIp                | aip |       | boolean |             |
| sessionControl             | sc  |       |         |             |
| account                    | tid | utmac |         |             |
| version                    | v   | utmwv |         |             |


## Traffic Sources

| Field                      | UA | UTM                    | Type   | Notes       |
|:---------------------------|----|------------------------|--------|-------------|
| referrer                   | dr | utmr                   | string |             |
| Campaign name              | cn | utmcc.utma.utmz.utmccn | string |             |
| Campaign source            | cs | utmcc.utma.utmz.utmcsr | string |             |
| Campaign medium            | cm | utmcc.utma.utmz.utmcmd | string |             |
| Campaign keyword           | ck | utmcc.utma.utmz.utmctr | string |             |
| Campaign content           | cc | utmcc.utma.utmz.utmcct | string |             |
| Campaign ID                | ci |                        |        |             |


## System info

| Field                      | UA | UTM   | Type    | Notes       |
|:---------------------------|----|-------|---------|-------------|
| Screen resolution          | sr | utmsr |         |             |
| Viewport size              | vp | utmvp |         |             |
| Document encoding          | de | utmcs |         |             |
| Screen colours             | sd | utmsc |         |             |
| User language              | ul | utmul |         |             |
| Java enabled               | je | utmje |         |             |
| Flash version              | fl | utmfl |         |             |


## Hit

| Field                      | UA | UTM  | Type    | Notes       |
|:---------------------------|----|------|---------|-------------|
| Hit type                   | t  | utmt | string  | See below   |

`hittype` can be one of:

| Description          | UA          | UTM    |
|:---------------------|:------------|--------|
| Page view            | pageview    |        |
| Event                | event       | event  |
| Transaction          | transaction | tran   |
| Transaction Item     | item        | item   |
| Social               | social      | social |
| User Timing          | timing      | event  |
| Exception            | exception   |        |
| App view             | appview     |        |


## Content Information

| Field                      | UA | UTM   | Type    | Notes       |
|:---------------------------|----|-------|---------|-------------|
| Document location URL      | dl |       | string  |             |
| Document Host Name         | dh | utmhn | boolean |             |
| Document Path              | dp | utmp  | text    |             |
| Document Title             | dt | utmst | text    |             |


## App Tracking

| Field                      | UA | UTM | Type | Notes     |
|:---------------------------|----|-----|------|-----------|
| Application Name           | an |     | text | 100 bytes |
| Application Version        | av |     | text | 100 bytes |


## Event Tracking

| Field                      | UA | UTM      | Type    | Notes     |
|:---------------------------|----|----------|---------|-----------|
| Event Category             | ec | utme.5.0 | text    | 150 bytes |
| Event Action               | ea | utme.5.1 | text    | 500 bytes |
| Event Label                | el | utme.5.2 | text    | 500 bytes |
| Event Value                | ev | utme.5.3 | integer |           |


## Social Interactions

| Field                      | UA | UTM    | Type | Notes      |
|:---------------------------|----|--------|------|------------|
| Social Network             | sn | utmsn  | text | 50 bytes   |
| Social Action              | sa | utmsa  | text | 50 bytes   |
| Social Action Target       | st | utmsid | text | 2048 bytes |


## Timing

| Field                      | UA  | UTM       | Type    | Notes     |
|:---------------------------|-----|-----------|---------|-----------|
| User timing variable name  | utv | utme.14.1 | text    | 500 bytes |
| User timing category       | utc | utme.14.2 | text    | 150 bytes |
| User timing time           | utt | utme.14.3 | integer |           |
| User timing label          | utl | utme.14.4 | text    | 500 bytes |


## Exceptions

| Field                      | UA  | UTM | Type    | Notes     |
|:---------------------------|-----|-----|---------|-----------|
| Exception Description      | exd |     | text    | 150 bytes |
| Is Exception Fatal?        | exf |     | boolean |           |


## Custom Dimensions / Metrics

| Field                      | UA    | UTM | Type    | Notes     |
|:---------------------------|-------|-----|---------|-----------|
| Custom Dimension           | cd[n] |     | text    | 150 bytes |
| Custom Metric              | cm[n] |     | integer |           |


## Custom Vars

| Field                      | UA | UTM     | Type    | Notes       |
|:---------------------------|----|---------|---------|-------------|
| Name                       |    | utme.8  | text    | 150 bytes   |
| Value                      |    | utme.9  | test    |             |
| Scope                      |    | utme.11 | integer |             |


## Content Experiments

| Field                      | UA   | UTM | Type    | Notes       |
|:---------------------------|------|-----|---------|-------------|
| Experiment ID              | xid  |     | text    | 40 bytes    |
| Experiment Variant         | xvar |     | text    | no limit    |