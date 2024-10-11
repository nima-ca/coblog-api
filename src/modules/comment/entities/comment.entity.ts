import { CoreEntity } from 'src/common/models/coreEntity';
import { User } from 'src/modules/auth/entities/user.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { Reaction } from 'src/modules/reaction/entities/reaction.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Comment extends CoreEntity {
    @Column('text')
    content: string;

    @ManyToOne(() => User, (user) => user.comments)
    user: User;

    @ManyToOne(() => Post, (post) => post.comments)
    post: Post;

    @OneToMany(() => Reaction, (reaction) => reaction.comment)
    reactions: Reaction[];
}
