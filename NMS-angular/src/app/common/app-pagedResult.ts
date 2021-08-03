export interface IPagedResultDto{
    totalCount:number| undefined;
    items:any;
  
  }

  export interface IGetAllInputFilterDto{
    filter: any;
      sorting: string | null | undefined;
       skipCount: number | null | undefined;
      maxResultCount: number | null | undefined;
  }