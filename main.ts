import {Construct} from "constructs";
import {App, TerraformStack, TerraformOutput, RemoteBackend} from "cdktf";
import {AwsProvider} from "@cdktf/provider-aws/lib/provider";
import {Instance} from "@cdktf/provider-aws/lib/instance";
import * as dotenv from "dotenv";

// Define stack
class MyStack extends TerraformStack {
    // Define constructor
    constructor(scope: Construct, id: string) {
        super(scope, id);

        dotenv.config();

        // Define provider
        new AwsProvider(this, "AWS", {
            region: "ap-northeast-2",
            accessKey: process.env.AWS_ACCESS_KEY,
            secretKey: process.env.AWS_SECRET_KEY,
        });


        // Define resource
        const ec2Instance = new Instance(this, "compute", {
            ami: "ami-0e38c97339cddf4bd", // Canonical, Ubuntu, 22.04 LTS, amd64 jammy image build on 2023-02-08 x86_64
            instanceType: "t2.micro",
        });

        // Define output
        new TerraformOutput(this, "public_ip", {
            value: ec2Instance.publicIp,
        });
    }
}

// Define app
const app = new App();
// Define stack
const stack = new MyStack(app, "aws_instance");

// Define backend
new RemoteBackend(stack, {
    hostname: "app.terraform.io",
    organization: "kenken",
    workspaces: {
        name: "learn-cdktf",
    },
});

// Synth
app.synth();
