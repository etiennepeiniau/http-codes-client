#!/bin/bash
yarn
yarn webpack
aws s3 sync dist s3://http-codes.xyz --delete