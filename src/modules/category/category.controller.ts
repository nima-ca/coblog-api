import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../user/entities/user.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller({ path: 'category', version: '1' })
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Roles(UserRole.Admin)
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    findAll() {
        return this.categoryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(+id);
    }

    @Roles(UserRole.Admin)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.categoryService.update(+id, updateCategoryDto);
    }

    @Roles(UserRole.Admin)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoryService.remove(+id);
    }
}
