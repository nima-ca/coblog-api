import { CoreEntity } from 'src/common/models/coreEntity';
import { Post } from 'src/modules/post/entities/post.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class Category extends CoreEntity {
    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Post, (post) => post.categories, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    posts: Post[];
}
