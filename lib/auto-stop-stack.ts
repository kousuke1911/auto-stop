import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import { Construct } from 'constructs';

export class AutoStopStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda関数の作成
    const rdsTriggerLambda = new lambda.Function(this, 'RdsTriggerLambda', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'autoTagging.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')), // Lambdaコードを自動でアップロード
    });

    // EventBridgeルールを作成
    const rule = new events.Rule(this, 'RdsStartRule', {
      eventPattern: {
        source: ['aws.rds'],
        detailType: ['RDS DB Instance Event'],
        detail: {
          eventCategories: ['start'],
        },
      },
    });

    // EventBridgeルールのターゲットにLambdaを設定
    rule.addTarget(new targets.LambdaFunction(rdsTriggerLambda));

    // 必要なIAMポリシーをLambdaに付与
    rdsTriggerLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['events:PutEvents'],
      resources: ['*'],
    }));
  }
}

