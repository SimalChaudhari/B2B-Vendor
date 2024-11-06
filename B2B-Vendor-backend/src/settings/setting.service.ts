// src/faq/faq.service.ts

import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner, ContactUs, Faq, PrivacyPolicy, TermsConditions } from './setting.entity';
import { CreateBannerDto, CreateContactDto, CreateFaqDto, CreateLogoDto, CreatePrivacyPolicyDto, CreateTermsConditionsDto, UpdateBannerDto, UpdateFaqDto, UpdateLogoDto } from './setting.dto';
// import { bucket } from '../firebase/firebase.config'; // Import the bucket configuration
import * as admin from 'firebase-admin';
import { FirebaseService } from 'service/firebase.service';

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
// Privacy policy

@Injectable()
export class PrivacyPolicyService {
    constructor(
        @InjectRepository(PrivacyPolicy)
        private privacyPolicyRepository: Repository<PrivacyPolicy>
    ) { }

    async create(createPrivacyPolicyDto: CreatePrivacyPolicyDto): Promise<{ message: string; data: PrivacyPolicy }> {
        try {
            const privacyPolicy = this.privacyPolicyRepository.create(createPrivacyPolicyDto);
            const savedPolicy = await this.privacyPolicyRepository.save(privacyPolicy);
            return { message: 'Privacy Policy created successfully', data: savedPolicy };
        } catch (error: any) {
            throw new InternalServerErrorException('Error creating privacy policy', error.message);
        }
    }

    async findAll(): Promise<PrivacyPolicy[]> {
        try {
            return await this.privacyPolicyRepository.find();
        } catch (error: any) {
            throw new InternalServerErrorException('Error retrieving privacy policies', error.message);
        }
    }

    async findOne(id: string): Promise<PrivacyPolicy> {
        try {
            const privacyPolicy = await this.privacyPolicyRepository.findOneBy({ id });
            if (!privacyPolicy) {
                throw new NotFoundException(`Privacy Policy with ID ${id} not found`);
            }
            return privacyPolicy;
        } catch (error: any) {
            throw new InternalServerErrorException('Error retrieving the privacy policy', error.message);
        }
    }

    async update(id: string, updatePrivacyPolicyDto: CreatePrivacyPolicyDto): Promise<{ message: string; data: PrivacyPolicy }> {
        try {
            const privacyPolicy = await this.findOne(id); // This will throw if not found

            // Merge and save updated privacy policy
            const updatedPolicy = this.privacyPolicyRepository.merge(privacyPolicy, updatePrivacyPolicyDto);
            const result = await this.privacyPolicyRepository.save(updatedPolicy);

            return { message: 'Privacy Policy updated successfully', data: result };
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error; // Re-throw the not found exception
            }
            throw new InternalServerErrorException('Error updating privacy policy', error.message);
        }
    }

    async remove(id: string): Promise<{ message: string }> {
        try {
            const privacyPolicy = await this.findOne(id); // This will throw if not found
            await this.privacyPolicyRepository.delete(privacyPolicy.id);
            return { message: 'content deleted successfully' };
        } catch (error: any) {
            throw new InternalServerErrorException('Error deleting privacy policy', error.message);
        }
    }
}

// term And Condition
@Injectable()
export class TermsConditionsService {
    constructor(
        @InjectRepository(TermsConditions)
        private termsConditionsRepository: Repository<TermsConditions>
    ) { }

    async create(createTermsConditionsDto: CreateTermsConditionsDto): Promise<{ message: string; data: TermsConditions }> {
        try {
            const termsConditions = this.termsConditionsRepository.create(createTermsConditionsDto);
            const savedTerms = await this.termsConditionsRepository.save(termsConditions);
            return { message: 'Terms and Conditions created successfully', data: savedTerms };
        } catch (error: any) {
            throw new InternalServerErrorException('Error creating terms and conditions', error.message);
        }
    }

    async findAll(): Promise<TermsConditions[]> {
        try {
            return await this.termsConditionsRepository.find();
        } catch (error: any) {
            throw new InternalServerErrorException('Error retrieving terms and conditions', error.message);
        }
    }

    async findOne(id: string): Promise<TermsConditions> {
        try {
            const termsConditions = await this.termsConditionsRepository.findOneBy({ id });
            if (!termsConditions) {
                throw new NotFoundException(`Terms and Conditions with ID ${id} not found`);
            }
            return termsConditions;
        } catch (error: any) {
            throw new InternalServerErrorException('Error retrieving the terms and conditions', error.message);
        }
    }

    async update(id: string, updateTermsConditionsDto: CreateTermsConditionsDto): Promise<{ message: string; data: TermsConditions }> {
        try {
            const termsConditions = await this.findOne(id); // This will throw if not found

            // Merge and save updated terms and conditions
            const updatedTerms = this.termsConditionsRepository.merge(termsConditions, updateTermsConditionsDto);
            const result = await this.termsConditionsRepository.save(updatedTerms);

            return { message: 'Terms and Conditions updated successfully', data: result };
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error; // Re-throw the not found exception
            }
            throw new InternalServerErrorException('Error updating terms and conditions', error.message);
        }
    }

    async remove(id: string): Promise<{ message: string }> {
        try {
            const termsConditions = await this.findOne(id); // This will throw if not found
            await this.termsConditionsRepository.delete(termsConditions.id);
            return { message: 'Conditions deleted successfully' };

        } catch (error: any) {
            throw new InternalServerErrorException('Error deleting terms and conditions', error.message);
        }
    }
}

// Contact as

@Injectable()
export class ContactUsService {
    constructor(
        @InjectRepository(ContactUs)
        private contactRepository: Repository<ContactUs>
    ) { }

    async create(createContactDto: CreateContactDto): Promise<{ message: string; data: ContactUs }> {
        try {
            const contact = this.contactRepository.create(createContactDto);
            const savedContact = await this.contactRepository.save(contact);
            return { message: 'Contact message created successfully', data: savedContact };
        } catch (error: any) {
            throw new InternalServerErrorException('Error creating contact message', error.message);
        }
    }

    async findAll(): Promise<ContactUs[]> {
        try {
            return await this.contactRepository.find();
        } catch (error: any) {
            throw new InternalServerErrorException('Error retrieving contact messages', error.message);
        }
    }

    async findOne(id: string): Promise<ContactUs> {
        try {
            const contact = await this.contactRepository.findOneBy({ id });
            if (!contact) {
                throw new NotFoundException(`Contact message with ID ${id} not found`);
            }
            return contact;
        } catch (error: any) {
            throw new InternalServerErrorException('Error retrieving the contact message', error.message);
        }
    }

    async update(id: string, updateContactDto: CreateContactDto): Promise<{ message: string; data: ContactUs }> {
        try {
            const contact = await this.findOne(id); // This will throw if not found

            // Merge and save updated contact message
            const updatedContact = this.contactRepository.merge(contact, updateContactDto);
            const result = await this.contactRepository.save(updatedContact);

            return { message: 'Contact message updated successfully', data: result };
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error; // Re-throw the not found exception
            }
            throw new InternalServerErrorException('Error updating contact message', error.message);
        }
    }

    async remove(id: string): Promise<{ message: string }> {
        try {
            const contact = await this.findOne(id); // This will throw if not found
            await this.contactRepository.delete(contact.id);
            return { message: 'contact as deleted successfully' };
        } catch (error: any) {
            throw new InternalServerErrorException('Error deleting contact message', error.message);
        }
    }
}


@Injectable()
export class BannerService {
    constructor(
        @InjectRepository(Banner)
        private bannerRepository: Repository<Banner>,
        private firebaseService: FirebaseService
    ) { }

    async createBannerWithImages(
        bannerImages: Express.Multer.File[],
        createBannerDto: CreateBannerDto
    ): Promise<Banner> {
        const imageUrls: string[] = []; // Array to hold uploaded image URLs

        for (const file of bannerImages) {
            const filePath = `banners/${Date.now()}-${file.originalname}`;
            const imageUrl = await this.firebaseService.uploadFile(filePath, file.buffer);
            imageUrls.push(imageUrl); // Collect the uploaded image URL
        }

        const newBanner = this.bannerRepository.create({
            name: createBannerDto.name,
            BannerImages: imageUrls, // Store all uploaded image URLs in the banner
        });

        return await this.bannerRepository.save(newBanner); // Save the new banner entity
    }

    async updateBannerImages(
        bannerId: string, newBannerImages: Express.Multer.File[], updateBannerDto: UpdateBannerDto): Promise<Banner> {
        // Find the existing banner
        const banner = await this.bannerRepository.findOne({ where: { id: bannerId } });
        if (!banner) {
            throw new NotFoundException('Banner not found');
        }

        // Delete all old images from Firebase if they exist
        if (banner.BannerImages && banner.BannerImages.length > 0) {
            await this.firebaseService.deleteImage(banner.BannerImages);
        }

        // Upload new BannerImages if provided, otherwise clear the BannerImages array
        let newImageUrls: string[] = [];
        if (newBannerImages && newBannerImages.length > 0) {
            newImageUrls = await Promise.all(
                newBannerImages.map(async (file) => {
                    const filePath = `banners/${Date.now()}-${file.originalname}`;
                    return await this.firebaseService.uploadFile(filePath, file.buffer);
                })
            );
        }

        // Update the name and BannerImages array
        banner.name = updateBannerDto.name || banner.name;
        // Update the banner entity with the new image URLs (or empty array)
        banner.BannerImages = newImageUrls;

        // Save the updated banner entity
        return await this.bannerRepository.save(banner);
    }

    // Get all banners
    async getAllBanners(): Promise<Banner[]> {
        return await this.bannerRepository.find();
    }

    // Get a specific banner by ID
    async getBannerById(bannerId: string): Promise<Banner> {
        const banner = await this.bannerRepository.findOne({ where: { id: bannerId } });
        if (!banner) {
            throw new NotFoundException('Banner not found');
        }
        return banner;
    }

    async deleteBanner(bannerId: string): Promise<{ message: string }> {
        // Find the banner by ID
        const banner = await this.bannerRepository.findOne({ where: { id: bannerId } });
        if (!banner) {
            throw new NotFoundException('Banner not found');
        }

        // Check if the banner has associated images and delete them from Firebase Storage
        if (banner.BannerImages && banner.BannerImages.length > 0) {
            try {
                await this.firebaseService.deleteImage(banner.BannerImages);

            } catch (error) {

                throw new Error('Failed to delete associated images from Firebase');
            }
        }

        // Finally, delete the banner from the database
        await this.bannerRepository.delete(bannerId);
        // Return a success message
        return { message: `Banner image has been deleted successfully.` }


    }


}