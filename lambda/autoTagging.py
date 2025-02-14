# lambda/rds-trigger.py
import json

def lambda_handler(event, context):
    # RDSインスタンスの起動を検知した際の処理
    print(f"Received event: {json.dumps(event)}")
    # 必要な処理を記述
    return {
        'statusCode': 200,
        'body': json.dumps('RDS Instance Started Detected!')
    }

