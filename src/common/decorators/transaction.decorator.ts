import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { TRANSACTION_QUERY_RUNNER_KEY } from '../middleware/transaction.middleware';

export const GetQueryRunner = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): QueryRunner => {
        const request = ctx.switchToHttp().getRequest();
        return request[TRANSACTION_QUERY_RUNNER_KEY] as QueryRunner;
    },
);
