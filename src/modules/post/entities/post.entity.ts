import { CoreEntity } from 'src/common/models/coreEntity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { Reaction } from 'src/modules/reaction/entities/reaction.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
} from 'typeorm';

@Entity()
export class Post extends CoreEntity {
    @Column()
    title: string;

    @Column('text')
    content: string;

    @Column({ default: false })
    isPublished: boolean;

    @ManyToOne(() => User, (user) => user.posts)
    author: User;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @ManyToMany(() => Category, (category) => category.posts)
    @JoinTable({ name: 'post_category' })
    categories: Category[];

    @ManyToMany(() => Tag, (tag) => tag.posts)
    @JoinTable({ name: 'post_tag' })
    tags: Tag[];

    @OneToMany(() => Reaction, (reaction) => reaction.post)
    reactions: Reaction[];
}
