export interface ILookupTableDto {
    id: number | undefined;
    displayName: string | undefined;
}

export class LookupTableDto implements ILookupTableDto {
    id: number | undefined;
    displayName!: string | undefined;
}