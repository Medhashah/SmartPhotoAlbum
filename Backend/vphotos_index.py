import json
import boto3
import time
import requests
import urllib

reko=boto3.client('rekognition')

url = "https://vpc-photo-53ylcjt23vag6gbxhl3pvzwl4i.us-east-1.es.amazonaws.com/photos/photo_name"
url_search = "https://vpc-photo-53ylcjt23vag6gbxhl3pvzwl4i.us-east-1.es.amazonaws.com/photos/_search?q=orange"

def lambda_handler(event, context):
    print(event)
    jsonBody = event['Records'][0]
    bucketName =  jsonBody['s3']['bucket']['name']
    key = urllib.parse.quote_plus(event['Records'][0]['s3']['object']['key'].encode('utf8'))
    print("HIE")
    data = {}
    print(bucketName,key)
    response = reko.detect_lab
    els(Image={'S3Object':{'Bucket':bucketName,'Name':key}})
    print(response)
    data['objectKey'] = key
    data['bucket'] = bucketName
    data['createdTimestamp'] = time.time()
    data['labels'] = []
    for label in response['Labels']:
        print (label['Name'] + ' : ' + str(label['Confidence']))
        data['labels'].append(label['Name'])
    json_data = json.dumps(data)
    print(json_data)
    headers = { "Content-Type": "application/json" }
    r = requests.post(url, data=json_data, headers=headers)
    print('E', r)
    print("HERE")
    # r = requests.get(url_search)
    # print(r.json()['hits'])
    
    return {
        'status': 200,
        'headers':{
            'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials':True
        },
        'body': json.dumps('Success')
    }