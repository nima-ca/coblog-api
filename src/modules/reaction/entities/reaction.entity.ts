import { CoreEntity } from 'src/common/models/coreEntity';
import { User } from 'src/modules/auth/entities/user.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum ReactionType {
    LIKE = 'like',
    DISLIKE = 'dislike',
    LOVE = 'love',
    WOW = 'wow',
    SAD = 'sad',
    ANGRY = 'angry',
    THINK = 'think',
}

@Entity()
export class Reaction extends CoreEntity {
    @ManyToOne(() => User, (user) => user.reactions)
    user: User;

    @ManyToOne(() => Post, (post) => post.reactions, { nullable: true })
    post: Post;

    @ManyToOne(() => Comment, (comment) => comment.reactions, {
        nullable: true,
    })
    comment: Comment;

    @Column({
        type: 'enum',
        enum: ReactionType,
    })
    type: ReactionType;
}
