# Media Services Application Mapper (MSAM)

MSAM is installed into an AWS account using several CloudFormation templates.

## Requirements for MSAM

* Amazon Web Services account with root or Administrator permissions
* Google Chrome, Mozilla Firefox, Safari or another current browser with JavaScript enabled


## Finding Installation Content

### dist/ folder in GitHub

This folder in the repository contains files you can use to install MSAM into your AWS account. 

The four CloudFormation templates located in this folder that end with `-release.json` are ready to use to install the latest release of MSAM.

```
msam-browser-app-release.json
msam-core-release.json
msam-dynamodb-release.json
msam-events-release.json
```

### md5.txt, sha1.txt, sha256.txt

These files contain digest values for the templates and packaged code contained in this folder and hosted on S3 by the project sponsors.


### release.txt

The hosted templates listed in this file always point to the latest release of MSAM. These links can be used directly in the CloudFormation console to install MSAM into any supported AWS region. Templates in this file have an epoch timestamp embedded in the template description.

```
https://rodeolabz-us-west-2.s3.amazonaws.com/msam/msam-browser-app-release.json
https://rodeolabz-us-west-2.s3.amazonaws.com/msam/msam-core-release.json
https://rodeolabz-us-west-2.s3.amazonaws.com/msam/msam-dynamodb-release.json
https://rodeolabz-us-west-2.s3.amazonaws.com/msam/msam-events-release.json
```

### current.txt

The templates listed in this file point to a build of MSAM under development or test. Templates in this file have an epoch timestamp in the file name and embedded in the template description.

```
https://rodeolabz-us-west-2.s3.amazonaws.com/msam/msam-browser-app-release-1570062574.template
https://rodeolabz-us-west-2.s3.amazonaws.com/msam/msam-core-release-1570062574.template
https://rodeolabz-us-west-2.s3.amazonaws.com/msam/msam-dynamodb-release-1570062574.template
https://rodeolabz-us-west-2.s3.amazonaws.com/msam/msam-events-release-1570062574.template
```

## CloudFormation Stack Creation

The order in which to create the stacks are as follows:

1. Create DynamoDB stack
1. Create Core stack
1. Create Event Handler stack
1. Create MSAM Web stack 

Install the DynamoDB, Core and Web stacks in your main, or most accessed region only. The Event Handler stack is installed in each region Media Services are configured.

During the installation of the different CloudFormation stacks you may be prompted to acknowledge creation of IAM resources, as seen in the sample screenshot below. Click the check-box next to each entry. Finally, click the "Create Change Set" button where applicable, then press the Execute button.
 
![Image of IAM Ackowlegement](images/ack-iam-resources.png)

* Login to CloudFormation using the account used for creating / managing the MediaServices.
* Click on Create Stack

For each of the four stacks listed below, from Choose a Template select "Specify an Amazon S3 template URL" and paste in the URLs below exactly as provided for any MSAM-supported region.

**After installing the DynamoDB stack (Template 1), you can install the remaining stacks (Templates 2, 3, and 4) concurrently. There is no need to wait for each to finish before starting the next.**

### Template 1: CloudFormation for the DynamoDB Tables

This template will create a stack for the tables, indices, and capacity autoscaling rules. The first time a stack is created from this template, defaults are added to scan and display cloud resources in the current region only. These settings can be updated in the tool to expand the inventory coverage to other regions.

`https://rodeolabz-us-west-2.s3.amazonaws.com/msam/msam-dynamodb-release.json`

#### Input Parameters

1. Provide a stack name

#### Outputs

Go to the Outputs section of the stack and copy the six table names to a notepad. You will need these as input parameters for the next templates. See the following image.

![DynamoDB Tables](images/cfn-dynamodb-tables.jpeg)

### Template 2: CloudFormation for the Core API of MSAM

This template will create a stack for the MSAM REST API, and periodic tasks used to refresh the content cache and discover logical resource connections.

`https://rodeolabz-us-west-2.s3.amazonaws.com/msam/msam-core-release.json`

#### Input Parameters

1. Provide a stack name
2. Paste each of the table names that were generated from the previous stack
3. Specify a content cache maximum age; content not refreshed before this time will be removed from the cache

#### Outputs

Go to the Outputs section after the stack if created and copy the EndpointUrl to a notepad. See the following image for the location of the URL.

![Core API Endpoint](images/cfn-core-endpoint.jpeg)

### Template 3: CloudFormation for the Event Handler

This template is used to create a stack with the Lambda responsible for receiving events from Media Services resources, such as MediaLive pipeline alerts. Create a stack for this template in every region you will be creating Media Services resources.

`https://rodeolabz-us-west-2.s3.amazonaws.com/msam/msam-events-release.json`

#### Input Parameters

1. Provide a stack name
2. Paste the Events table name that was generated from the DynamoDB stack
3. Specify the region of the Events table (such as us-west-2, us-east-1, or eu-west-1, for example)
4. Specify the time-to-live in seconds all events; see the examples next to the input

#### Outputs

None

### Template 4: CloudFormation for the Browser Application

This template will install a copy of the MSAM browser application into an S3 bucket. Files added by the CloudFormation template will have their ACL set to `public-read` to allow access over HTTPS.

`https://rodeolabz-us-west-2.s3.amazonaws.com/msam/msam-browser-app-release.json`

### Input Parameters

1. Provide a stack name

### Outputs

Go to the Outputs section of the created stack and copy the MSAMBrowserURL to a notepad. This is the URL to start the application on your workstation. See the following image for the location of the URL.

![Browser URL](images/cfn-browser-url.jpeg)

## Retrieve the API Key for the REST API

The MSAM back-end requires an API key to access any of the REST endpoints. The Core API CloudFormation template creates a default API key automatically. The key is not displayed in Outputs section of the created stack. You can retrieve the key from the AWS console. **By default, no access is possible until the following steps are performed.**

1. Change to the Resources tab of the Core API stack
2. Click the link for the API Key in the Physical ID column of the Resources listing
3. Click the Show link in the main compartment for the API key
6. Copy the API Key and keep it with the Endpoint URL
  
![API Key Value](images/api-key.jpeg)

### Multiple Users and Access Control

**You can create multiple API keys, each with different names that are provided to separate groups.**

Note that if you want to share the UI with a colleague you can do so easily by providing the browser application URL, core endpoint URL and an API key. If an API key is stolen or lost, create a new API key and delete the previous one. All users that require access can be sent the updated API key that they will have to update in the browser application. MSAM will prompt the user to update the endpoint and key if the previously used settings are unable to access the back-end.

## Start the MSAM UI 

**Wait about 5-10 minutes for the first data gathering of the services to complete. This is needed only the first time after creation of the MSAM instance.**

Continue to the [Usage](USAGE.md) guide to start using the tool.

## DynamoDB Considerations

There are six DynamoDB tables used by MSAM. They are:

* [StackName]-Alarms-[ID]
* [StackName]-Channels-[ID]
* [StackName]-Content-[ID]
* [StackName]-Events-[ID]
* [StackName]-Layout-[ID]
* [StackName]-Settings-[ID]

Each table is configured for on-demand capacity by the CloudFormation template. This allows MSAM to automatically scale it's data handling capacity from small to very large Media Services installations.


## Versions and Updates

Each template includes a timestamp that indicates it's revision level. The timestamp is shown in the description of each template.

```
Media Services Application Mapper (MSAM) browser application (ID: 1537396573)
Media Services Application Mapper (MSAM) cloud API (ID: 1537396573)
```

You can also view the build timestamp in the tool by selecting the Tools menu and MSAM Build Numbers menu item. A dialog box will show the timestamps of each component and show a warning if they are seven or more days apart.

Any updates provided will be done via updates to the CloudFormation template files. In the CloudFormation console, click on the specific stack to be updated. From the top-right select Update Stack and point it to the stack link, check the IAM resource check boxes (if they are applicable to this specific update), and update the stack. 

## Raw Web Content

The MSAM browser application in zipped form is available from the following URL. The numeric value at the end of this file is the same as other files from the same build.

`https://s3-us-west-2.amazonaws.com/rodeolabz-us-west-2/msam/msam-web-NNNNNNNNNN.zip`

This file can be extracted into a web server or another type of hosting environment. Take this approach if you prefer not to use the CloudFormation template to host the application in an S3 bucket.

## Navigate

Navigate to [README](README.md) | [Workshop](WORKSHOP.md) | [Install](INSTALL.md) | [Usage](USAGE.md) | [Uninstall](UNINSTALL.md)
