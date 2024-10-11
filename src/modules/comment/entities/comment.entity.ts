import { CoreEntity } from 'src/common/models/core.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { Reaction } from 'src/modules/reaction/entities/reaction.entity';
import { User } from 'src/modules/user/entities/user.entity';
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
