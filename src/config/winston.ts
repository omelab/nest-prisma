import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { WinstonModuleOptions } from 'nest-winston';
import * as WinstonCloudWatch from 'winston-cloudwatch';

const isProduction = false; // process.env.NODE_ENV === 'production';

export default {
  format: winston.format.colorize(),
  exitOnError: false,
  transports: isProduction
    ? new WinstonCloudWatch({
        name: 'sicms',
        awsOptions: {
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_KEY_SECRET,
          },
        },
        logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
        logStreamName: process.env.CLOUDWATCH_STREAM_NAME,
        awsRegion: process.env.CLOUDWATCH_AWS_REGION,
        messageFormatter: function (item) {
          return (
            item.level + ': ' + item.message + ' ' + JSON.stringify(item.meta)
          );
        },
      })
    : new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike('SI Logger', {
            prettyPrint: true,
          }),
        ),
      }),
} as WinstonModuleOptions;
