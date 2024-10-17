import { Injectable } from '@nestjs/common';
import { countByKey } from 'src/common/utils/count';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { Reaction, ReactionType } from './entities/reaction.entity';

@Injectable()
export class ReactionService {
    create(createReactionDto: CreateReactionDto) {
        return 'This action adds a new reaction';
    }

    findAll() {
        return `This action returns all reaction`;
    }

    findOne(id: number) {
        return `This action returns a #${id} reaction`;
    }

    update(id: number, updateReactionDto: UpdateReactionDto) {
        return `This action updates a #${id} reaction`;
    }

    remove(id: number) {
        return `This action removes a #${id} reaction`;
    }

    countReactions(reactions: Reaction[]) {
        return {
            [ReactionType.LIKE]: countByKey(
                reactions,
                'type',
                ReactionType.LIKE,
            ),
            [ReactionType.ANGRY]: countByKey(
                reactions,
                'type',
                ReactionType.ANGRY,
            ),
            [ReactionType.DISLIKE]: countByKey(
                reactions,
                'type',
                ReactionType.DISLIKE,
            ),
            [ReactionType.LOVE]: countByKey(
                reactions,
                'type',
                ReactionType.LOVE,
            ),
            [ReactionType.SAD]: countByKey(reactions, 'type', ReactionType.SAD),
            [ReactionType.THINK]: countByKey(
                reactions,
                'type',
                ReactionType.THINK,
            ),
            [ReactionType.WOW]: countByKey(reactions, 'type', ReactionType.WOW),
        };
    }
}
