// transaction.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

import { NextFunction, Request, Response } from 'express';

export const TRANSACTION_QUERY_RUNNER_KEY = 'queryRunner';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
    constructor(private readonly dataSource: DataSource) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

        // Start a new transaction
        await queryRunner.connect();
        await queryRunner.startTransaction();

        // Store the queryRunner in the request object for later use
        req[TRANSACTION_QUERY_RUNNER_KEY] = queryRunner;

        res.on('finish', async () => {
            try {
                // If the response was successful, commit the transaction
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    await queryRunner.commitTransaction();
                } else {
                    // If the response failed, rollback the transaction
                    await queryRunner.rollbackTransaction();
                }
            } catch (error) {
                // Handle commit/rollback errors
                console.error('Error during transaction handling:', error);
                await queryRunner.rollbackTransaction();
            } finally {
                // Release the query runner
                await queryRunner.release();
            }
        });

        next();
    }
}
