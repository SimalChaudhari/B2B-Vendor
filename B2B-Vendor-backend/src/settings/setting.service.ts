// src/faq/faq.service.ts

import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactUs, Faq, Logo, PrivacyPolicy, TermsConditions } from './setting.entity';
import { CreateContactDto, CreateFaqDto, CreateLogoDto, CreatePrivacyPolicyDto, CreateTermsConditionsDto, UpdateFaqDto, UpdateLogoDto } from './setting.dto';
import { bucket } from '../firebase/firebase.config'; // Import the bucket configuration
import * as admin from 'firebase-admin';

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
            const publicUrl = `${process.env.STORAGE_URL}/${bucket.name}/${blob.name}`;
            // Create the logo entry in the database
            const logo = this.logoRepository.create({ logoImage: publicUrl });
            const savedLogo = await this.logoRepository.save(logo);
            return { message: 'Logo created successfully', data: savedLogo };
        } catch (error: any) {
            throw new InternalServerErrorException('Error creating logo', error.message);
        }
    }

    async update(id: string, updateLogoDto: UpdateLogoDto): Promise<{ message: string; data: Logo }> {
        try {
            const logo = await this.findOne(id); // Fetch the existing logo
            let logoImage = logo.logoImage;
            const fileName = logoImage.split('/').pop();
            if (updateLogoDto.logoImage) {
                const blob = bucket.file(`logos/${fileName}`); // Use the same file name to overwrite
                const buffer = Buffer.from(updateLogoDto.logoImage, 'base64'); // Convert base64 string to buffer
                await blob.save(buffer, {
                    metadata: { contentType: 'image/png' },
                });
            }
            const updatedLogo = this.logoRepository.merge(logo, { logoImage });
            const result = await this.logoRepository.save(updatedLogo);
            return { message: 'Logo updated successfully', data: result };
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error; // Re-throw not found error
            }
            throw new InternalServerErrorException('Error updating logo', error.message);
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

    async remove(id: string): Promise<{ message: string }> {
        try {
            const logo = await this.findOne(id); // This will throw if not found
            if (!logo) {
                throw new Error('Logo not found.');
            }
            // Delete the image from Firebase Storage
            const fileName = logo.logoImage.split('/').pop(); // Extract the file name from the URL
            const bucket = admin.storage().bucket(); // Get the storage bucket
            const file = bucket.file(`logos/${fileName}`);
            await file.delete();
            // Delete the logo entry from the database
            await this.logoRepository.delete(id);
            return { message: 'Logo deleted successfully' };
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error; // Re-throw the not found exception
            }
            throw new InternalServerErrorException('Error deleting logo', error.message);
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