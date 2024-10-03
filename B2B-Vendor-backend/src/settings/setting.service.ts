// src/faq/faq.service.ts

import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq, Logo } from './setting.entity';
import { CreateFaqDto, CreateLogoDto, UpdateFaqDto } from './setting.dto';
import { bucket } from '../firebase/firebase.config'; // Import the bucket configuration


@Injectable()
export class FaqService {
    constructor(
        @InjectRepository(Faq)
        private faqRepository: Repository<Faq>
    ) { }

    async create(createFaqDto: CreateFaqDto): Promise<{ message: string, data: Faq }> {
        try {
            const faq = this.faqRepository.create(createFaqDto);
            const data = await this.faqRepository.save(faq);
            return { message: 'FAQ Create successfully', data: data };
        } catch (error: any) {
            throw new InternalServerErrorException('Error creating FAQ', error.message);
        }
    }

    async findAll(): Promise<Faq[]> {
        try {
            return await this.faqRepository.find();

        } catch (error: any) {
            throw new InternalServerErrorException('Error retrieving FAQs', error.message);
        }
    }

    async findOne(id: string): Promise<Faq> {
        try {
            const faq = await this.faqRepository.findOneBy({ id });
            if (!faq) {
                throw new NotFoundException(`FAQ with ID ${id} not found`);
            }
            return faq;
        } catch (error: any) {
            throw error
        }
    }

    async update(id: string, updateFaqDto: UpdateFaqDto): Promise<{ message: string, data: Faq }> {
        try {
            const faq = await this.findOne(id); // This will throw if not found
            Object.assign(faq, updateFaqDto);
            const result = await this.faqRepository.save(faq);
            return { message: 'FAQ Updated successfully', data: result };

        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error; // Re-throw the not found exception
            }
            throw new InternalServerErrorException('Error updating FAQ', error.message);
        }
    }

    async remove(id: string): Promise<{ message: string }> {
        try {
            const faq = await this.findOne(id); // This will throw if not found
            await this.faqRepository.delete(faq.id);
            return { message: 'FAQ deleted successfully' };
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error; // Re-throw the not found exception
            }
            throw new InternalServerErrorException('Error deleting FAQ', error.message);
        }
    }
}

@Injectable()
export class LogoService {
    constructor(
        @InjectRepository(Logo)
        private logoRepository: Repository<Logo>
    ) { }

    async create(createLogoDto: { logoImage: string }): Promise<{ message: string; data: Logo }> {
        try {
            const { logoImage } = createLogoDto;
            // Validate input
            if (!logoImage) {
                throw new Error('Logo image is required.');
            }
            // Convert base64 string to buffer
            const buffer = Buffer.from(logoImage, 'base64');
            // Upload the image to Firebase Storage
            const blob = bucket.file(`logos/${Date.now()}.png`); // Use Date.now() for a unique file name
            await blob.save(buffer, {
                metadata: { contentType: 'image/png' }, // Adjust the content type as needed
            });

            // Get the public URL for the uploaded image
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

            // Create the logo entry in the database
            const logo = this.logoRepository.create({ logoImage: publicUrl });
            const savedLogo = await this.logoRepository.save(logo);

            return { message: 'Logo created successfully', data: savedLogo };
        } catch (error: any) {
            throw new InternalServerErrorException('Error creating logo', error.message);
        }
    }


    async findAll(): Promise<Logo[]> {
        try {
            return await this.logoRepository.find();
        } catch (error: any) {
            throw new InternalServerErrorException('Error retrieving logos', error.message);
        }
    }

    async findOne(id: string): Promise<Logo> {
        try {
            const logo = await this.logoRepository.findOneBy({ id });
            if (!logo) {
                throw new NotFoundException(`Logo with ID ${id} not found`);
            }
            return logo;
        } catch (error: any) {
            throw error
        }
    }
    async update(id: string, updateLogoDto: CreateLogoDto): Promise<{ message: string; data: Logo }> {
        try {
            const logo = await this.findOne(id); // Fetch the existing logo
    
            // Use the existing logo image if no new one is provided
            let logoImage = logo.logoImage;
    
            // If a new logo image is provided, upload it
            if (updateLogoDto.logoImage) {
                const blob = bucket.file(`logos/${Date.now()}.png`); // Use Date.now() for unique naming
                const buffer = Buffer.from(updateLogoDto.logoImage, 'base64'); // Convert base64 string to buffer
    
                await blob.save(buffer, {
                    metadata: { contentType: 'image/png' },
                });
    
                // Get the public URL for the new image
                logoImage = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            }
    
            // Update the logo in the repository
            const updatedLogo = this.logoRepository.merge(logo, { logoImage });
            const result = await this.logoRepository.save(updatedLogo);
    
            return { message: 'Logo updated successfully', data: result };
        } catch (error: any) {
            // Handle errors accordingly
            if (error instanceof NotFoundException) {
                throw error; // Re-throw not found error
            }
            throw new InternalServerErrorException('Error updating logo', error.message);
        }
    }
    
    


    async remove(id: string): Promise<{ message: string }> {
        try {
            const faq = await this.findOne(id); // This will throw if not found
            await this.logoRepository.delete(faq.id);
            return { message: 'Logo deleted successfully' };
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error; // Re-throw the not found exception
            }
            throw new InternalServerErrorException('Error deleting Logo', error.message);
        }
    }
}