import { IsString, IsOptional, Matches } from 'class-validator';

export class AddressDto {
  @IsOptional()
  @IsString()
  streetNumberAndName?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @Matches(/^\d{5}(-\d{4})?$/, {
    message: 'Zip code must be 5 digits (12345) or ZIP+4 format (12345-6789)',
  })
  zip?: string;
}
