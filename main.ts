import {Construct} from "constructs";
import {App, TerraformStack, TerraformOutput, RemoteBackend} from "cdktf";
import {AwsProvider} from "@cdktf/provider-aws/lib/provider";
import {Instance} from "@cdktf/provider-aws/lib/instance";

class MyStack extends TerraformStack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        new AwsProvider(this, "AWS", {
            region: "ap-northeast-2",
            accessKey: process.env.AWS_ACCESS_KEY,
            secretKey: process.env.AWS_SECRET_KEY,
        });

        const ec2Instance = new Instance(this, "compute", {
            ami: "ami-0e38c97339cddf4bd", // Canonical, Ubuntu, 22.04 LTS, amd64 jammy image build on 2023-02-08 x86
            instanceType: "t2.micro",
        });

        new TerraformOutput(this, "public_ip", {
            value: ec2Instance.publicIp,
        });
    }
}

const app = new App();
const stack = new MyStack(app, "aws_instance");

new RemoteBackend(stack, {
    hostname: "app.terraform.io",
    organization: "kenken",
    workspaces: {
        name: "learn-cdktf",
    },
});

app.synth();
