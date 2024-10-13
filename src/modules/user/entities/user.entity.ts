import { CoreEntity } from 'src/common/models/coreEntity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { Reaction } from 'src/modules/reaction/entities/reaction.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum UserRole {
    User = 'user',
    Admin = 'admin',
}

export enum UserProvider {
    Google = 'google',
    Password = 'password',
}

@Entity()
export class User extends CoreEntity {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true, default: null })
    profilePicture: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
    role: UserRole;

    @Column({
        type: 'enum',
        enum: UserProvider,
        default: UserProvider.Password,
    })
    provider: UserProvider;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ nullable: true })
    otp: string;

    @Column({ type: 'timestamptz', nullable: true })
    otpSendTime: Date;

    @Column({ type: 'timestamptz', nullable: true })
    lastLogin: Date | null;

    @OneToMany(() => Post, (post) => post.author)
    posts: Post[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => Reaction, (reaction) => reaction.user)
    reactions: Reaction[];
}
