import { IsNotEmpty } from "class-validator";

export class CreateSyncLogDto {

    @IsNotEmpty()
    attempt_count?: number;
    @IsNotEmpty()
    status?: string;


}
