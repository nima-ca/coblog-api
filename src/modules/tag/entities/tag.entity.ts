import { CoreEntity } from 'src/common/models/core.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class Tag extends CoreEntity {
    @Column()
    name: string;

    @ManyToMany(() => Post, (post) => post.tags)
    posts: Post[];
}
